#!/usr/bin/env python3
"""Extrait les entrées du dictionnaire bulu-français (PDF) vers un fichier JSON.

Usage : python3 extract_dictionary.py dictionnaire.pdf entries.json

Format d'une entrée dans le PDF :
  Mot (ton)/préfixe pluriel/classe/ (phonétique) = définitions. Ex : exemple. Cf. renvoi

Le script ne corrige rien : il découpe, et garde toujours le texte brut
(champ "raw") pour permettre la relecture humaine.
"""
import json
import re
import subprocess
import sys

TONE = re.compile(r"\(([hmb]{1,3}(?:\s*[-,/]\s*[hmb]{1,3})*)\)")
CLASS = re.compile(r"^[IVX]+(?:\s*(?:et|,|ou)\s*[IVX]+)*$")
POS = re.compile(r"^(v|adv|adj|prép|conj|interj|pron|part|n|num)\.?[a-z.]*$")



# Détecte, au milieu d'un paragraphe, le début d'une nouvelle entrée collée à la précédente
# (certaines pages du PDF n'ont pas de ligne vide entre les entrées).
HIDDEN_START = re.compile(r"(?<=[.?!»”)\"]) (?=[A-ZÀ-ÖØ-Þ][^=]{0,170}? = )")
NOT_AN_ENTRY = re.compile(r"^(Ex|Cf|Voir|Proverbe|Syn|Ant)\b")
TONE_CODE = re.compile(r"\((?:[hmb]{1,3}(?:\s*[-,/]\s*[hmb]{1,3})*)\)")
ENTRY_MARK = re.compile(r"/(?:[IVX]+|adv\.?|v\.?|adj\.?|prép\.?)/")


def split_hidden_entries(block):
    cuts = []
    for m in HIDDEN_START.finditer(block):
        start = m.end()
        header = block[start : block.find(" = ", start)]
        if NOT_AN_ENTRY.match(header) or re.search(r"[.?!»”] ", header):
            continue
        if TONE_CODE.search(header) or ENTRY_MARK.search(header):
            cuts.append(start)
    parts, previous = [], 0
    for cut in cuts:
        parts.append(block[previous:cut].strip())
        previous = cut
    parts.append(block[previous:].strip())
    return [p for p in parts if p]


def read_paragraphs(pdf_path):
    text = subprocess.run(
        ["pdftotext", "-layout", pdf_path, "-"], capture_output=True, text=True, check=True
    ).stdout
    paragraphs = []
    for page_no, page in enumerate(text.split("\f"), start=1):
        for block in re.split(r"\n\s*\n", page):
            block = " ".join(block.split())
            for part in split_hidden_entries(block):
                paragraphs.append((page_no, part))
    return paragraphs


def is_entry_start(block):
    idx = block.find(" = ")
    return block[0].isupper() and 0 < idx < 160


def parse_header(header):
    entry = {}
    entry["headword"] = re.split(r"\s*[(/]", header, maxsplit=1)[0].strip()

    tone = TONE.search(header)
    entry["tone"] = tone.group(1) if tone else None

    parts = header.split("/")
    entry["plural_prefix"] = None
    entry["noun_class"] = None
    entry["pos"] = None
    if len(parts) >= 2:
        p1 = parts[1].strip()
        if POS.match(p1):
            entry["pos"] = p1
        elif p1 and len(p1) <= 4 and not p1.startswith("("):
            entry["plural_prefix"] = p1
    if len(parts) >= 3:
        p2 = parts[2].strip()
        if CLASS.match(p2):
            entry["noun_class"] = p2
        elif POS.match(p2):
            entry["pos"] = p2

    groups = [g for g in re.findall(r"\(([^()]*)\)", header) if not TONE.fullmatch(f"({g})")]
    entry["phonetic"] = groups[-1].strip() if groups else None
    return entry


def parse_body(body):
    senses = re.split(r"(?:(?<=\s)|^)\d°\)\s*", body)
    senses = [s.strip() for s in senses if s.strip()]
    examples = [e.strip() for e in re.findall(r"Ex\s*:\s*(.+?)(?=\s+Ex\s*:|\s+Cf\.|\s+Voir\s|$)", body)]
    cross_refs = [c.strip(" .") for c in re.findall(r"(?:Cf\.|Voir)\s+([^.]+)", body)]
    return {"senses": senses, "examples": examples, "cross_refs": cross_refs}


def extract(pdf_path):
    entries = []
    for page_no, block in read_paragraphs(pdf_path):
        if is_entry_start(block):
            idx = block.find(" = ")
            header, body = block[:idx].strip(), block[idx + 3 :].strip()
            entry = {"page": page_no, "raw": block}
            entry.update(parse_header(header))
            entry.update(parse_body(body))
            entries.append(entry)
        elif entries:  # suite d'une entrée coupée par un saut de page
            entries[-1]["raw"] += " " + block
            entries[-1].update(parse_body(entries[-1]["raw"].split(" = ", 1)[1]))
            entries[-1]["merged_continuation"] = True
    return entries


if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    data = extract(src)
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print(f"{len(data)} entrées écrites dans {dst}")
