"use client";

import { useActionState } from "react";
import { sendFeedback, type FeedbackState } from "@/app/retours/actions";
import ToneAnimation from "@/components/ToneAnimation";

const KINDS = [
  { value: "erreur", label: "Une erreur" },
  { value: "suggestion", label: "Une idée" },
  { value: "autre", label: "Autre chose" },
];

const initial: FeedbackState = { status: "idle" };

export default function FeedbackForm({ defaultKind, defaultPage }: { defaultKind: string; defaultPage: string }) {
  const [state, formAction, pending] = useActionState(sendFeedback, initial);

  if (state.status === "ok") {
    return (
      <div className="rounded-2xl border border-surface-high bg-white p-8 text-center sm:p-12" role="status">
        <ToneAnimation tones={["b", "m", "h"]} className="mx-auto" />
        <h2 className="mt-4 font-serif text-3xl font-semibold text-forest">Merci.</h2>
        <p className="mx-auto mt-2 max-w-sm leading-relaxed text-ink-soft">
          Votre message est bien arrivé. Chaque retour aide Akeñ à mieux porter la langue.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6 rounded-2xl border border-surface-high bg-white p-6 sm:p-8">
      {/* Champ piège pour les robots */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label>
          Ne pas remplir
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink-soft">Votre retour concerne</legend>
        <div className="flex flex-wrap gap-2">
          {KINDS.map((kind) => (
            <label key={kind.value} className="cursor-pointer">
              <input type="radio" name="kind" value={kind.value} defaultChecked={kind.value === defaultKind} className="peer sr-only" />
              <span className="inline-block rounded-full border border-line px-4 py-1.5 text-sm text-ink-soft transition peer-checked:border-forest peer-checked:bg-forest peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-clay">
                {kind.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="page" className="mb-1 block text-sm font-medium text-ink-soft">
          Page concernée <span className="font-normal text-outline">(facultatif)</span>
        </label>
        <input
          id="page"
          name="page"
          type="text"
          defaultValue={defaultPage}
          placeholder="/mot/…"
          maxLength={200}
          className="w-full rounded-lg border border-line bg-white px-4 py-2.5"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink-soft">Votre message</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={5}
          maxLength={4000}
          rows={6}
          placeholder="Un mot, un ton, une définition à corriger, une idée…"
          className="w-full rounded-lg border border-line bg-white px-4 py-3 leading-relaxed"
        />
      </div>

      <div>
        <label htmlFor="contact" className="mb-1 block text-sm font-medium text-ink-soft">
          Pour vous répondre <span className="font-normal text-outline">(facultatif)</span>
        </label>
        <input
          id="contact"
          name="contact"
          type="text"
          maxLength={200}
          placeholder="Une adresse e-mail, si vous le souhaitez"
          className="w-full rounded-lg border border-line bg-white px-4 py-2.5"
        />
        <p className="mt-1 text-xs text-outline">Cette information ne sert qu’à vous répondre.</p>
      </div>

      {state.status === "error" && (
        <p role="alert" className="rounded-lg bg-clay-soft p-3 text-sm text-clay">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-forest px-6 py-3 font-medium text-white hover:bg-forest-mid disabled:opacity-60"
      >
        {pending ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}
