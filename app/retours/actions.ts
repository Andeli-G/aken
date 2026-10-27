"use server";

import { supabase } from "@/lib/supabase";

export type FeedbackState = { status: "idle" | "ok" | "error"; message?: string };

const KINDS = ["erreur", "suggestion", "autre"] as const;

export async function sendFeedback(_previous: FeedbackState, formData: FormData): Promise<FeedbackState> {
  // Champ piège : invisible pour les humains, rempli par les robots
  if (String(formData.get("website") ?? "") !== "") return { status: "ok" };

  const kindRaw = String(formData.get("kind") ?? "");
  const kind = (KINDS as readonly string[]).includes(kindRaw) ? kindRaw : "autre";
  const message = String(formData.get("message") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim().slice(0, 200);
  const pageRaw = String(formData.get("page") ?? "").trim();
  const page = pageRaw.startsWith("/") ? pageRaw.slice(0, 200) : "";

  if (message.length < 5) return { status: "error", message: "Votre message est un peu court : pouvez-vous le préciser ?" };
  if (message.length > 4000) return { status: "error", message: "Votre message est trop long (4 000 caractères au maximum)." };

  const { error } = await supabase.from("feedback").insert({
    kind,
    message,
    contact: contact || null,
    page: page || null,
  });

  if (error) {
    console.error("Retour non enregistré :", error.message);
    return { status: "error", message: "Le message n’a pas pu être envoyé. Vous pouvez aussi nous écrire par e-mail, en bas de page." };
  }
  return { status: "ok" };
}
