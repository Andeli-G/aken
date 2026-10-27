import FeedbackForm from "@/components/FeedbackForm";
import ToneAnimation from "@/components/ToneAnimation";

export const metadata = { title: "Retours et commentaires — Akeñ" };

const KINDS = ["erreur", "suggestion", "autre"];

export default async function Retours({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; kind?: string }>;
}) {
  const { page = "", kind = "" } = await searchParams;
  const defaultPage = page.startsWith("/") ? page.slice(0, 200) : "";
  const defaultKind = KINDS.includes(kind) ? kind : "suggestion";

  return (
    <section className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <ToneAnimation tones={["m", "h", "m", "b", "h"]} />
      <h1 className="mt-4 font-serif text-4xl font-semibold text-forest sm:text-5xl">Vos retours</h1>
      <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-soft">
        Akeñ est en alpha. Un mot mal écrit, un ton noté de travers, une définition à nuancer, une idée : tout ce que
        vous remarquez aide à rendre ce dictionnaire plus juste.
      </p>

      <div className="mt-8">
        <FeedbackForm defaultKind={defaultKind} defaultPage={defaultPage} />
      </div>

      <p className="mt-8 text-sm leading-relaxed text-outline">
        Vous préférez écrire directement ?{" "}
        <a href="mailto:dulzuradelight@gmail.com" className="underline underline-offset-4 hover:text-forest">
          dulzuradelight@gmail.com
        </a>
      </p>
    </section>
  );
}
