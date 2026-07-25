import Link from "next/link";
import { MousePointerClick, Layers, Radio, Timer } from "lucide-react";

const POINTS = [
  {
    icon: MousePointerClick,
    title: "Point at what hurts",
    body: "Click anywhere on the body. You get the structure under your finger, what it does, and why it is complaining.",
  },
  {
    icon: Layers,
    title: "Peel through four layers",
    body: "The same spot gives you a different muscle at each depth. Superficial, intermediate, deep, then bone.",
  },
  {
    icon: Radio,
    title: "Find the real culprit",
    body: "Switch to “It hurts here” and the map lights up the distant muscles that refer pain to that spot. It is often nowhere near where you feel it.",
  },
  {
    icon: Timer,
    title: "Leave with a routine",
    body: "Everything you tap collects into a session, ordered properly and timed, with a player that counts you through it.",
  },
];

export default function AtlasHome() {
  return (
    <div className="p-5 sm:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
        Start here
      </p>
      <h1 className="mt-2 text-3xl font-semibold leading-tight">
        Where does it hurt?
      </h1>
      <p className="mt-3 text-pretty leading-relaxed text-ink-2">
        Most people have to already know the word “rhomboid” before they can
        search for help. Atlas works the other way round — point at your own
        body and it tells you what is under there.
      </p>

      <ul className="mt-6 space-y-4">
        {POINTS.map((p) => (
          <li key={p.title} className="flex gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-rule bg-bg-2 text-accent">
              <p.icon size={15} />
            </span>
            <span>
              <span className="block text-sm font-semibold">{p.title}</span>
              <span className="mt-0.5 block text-sm leading-relaxed text-ink-2">
                {p.body}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-7 rounded-card border border-rule bg-bg-2 p-4">
        <p className="text-sm font-semibold">Not sure what you are looking at?</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">
          Describe it in your own words instead and Atlas will work out where to
          start.
        </p>
        <Link
          href="/triage/"
          className="mt-3 inline-flex rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-ink"
        >
          Describe your pain
        </Link>
      </div>

      <p className="mt-6 border-t border-rule pt-4 text-xs leading-relaxed text-ink-3">
        Atlas is an educational tool, not a diagnosis. It cannot examine you and
        does not know your history. If something here does not match what you
        are feeling, trust your body and see a clinician.{" "}
        <Link href="/evidence/" className="underline underline-offset-2">
          How this was put together
        </Link>
        .
      </p>
    </div>
  );
}
