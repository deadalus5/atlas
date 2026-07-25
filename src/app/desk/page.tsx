"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { getStructure } from "@/data";
import { useAtlas } from "@/store/atlas";
import { cn } from "@/lib/cn";

interface Question {
  id: string;
  ask: string;
  options: {
    value: string;
    label: string;
    /** Fixes triggered by this answer. */
    fixes?: { text: string; structures?: string[] }[];
    good?: boolean;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: "screen",
    ask: "Where is the top of your main screen, relative to your eyes?",
    options: [
      { value: "level", label: "About level with my eyes", good: true },
      {
        value: "below",
        label: "Below eye level — I look down at it",
        fixes: [
          {
            text: "Raise the screen until its top edge is level with your eyes. Every centimetre your head drifts forward multiplies the load your neck extensors carry all day.",
            structures: ["trapezius-upper", "levator-scapulae"],
          },
        ],
      },
      {
        value: "laptop",
        label: "It is a laptop, on the desk or my lap",
        fixes: [
          {
            text: "A laptop cannot be ergonomic on its own — the screen and keyboard are fixed together, so one of them is always wrong. Put it on a stand at eye level and use a separate keyboard and mouse. This is the single highest-value change on this page.",
            structures: ["trapezius-upper", "levator-scapulae", "rhomboid-major"],
          },
        ],
      },
      {
        value: "side",
        label: "Off to one side",
        fixes: [
          {
            text: "Move it directly in front of you. Spending the day rotated a few degrees loads one levator scapulae far more than the other, and it is a very common reason for a one-sided stiff neck.",
            structures: ["levator-scapulae", "trapezius-upper"],
          },
        ],
      },
    ],
  },
  {
    id: "arms",
    ask: "What are your arms doing while you work?",
    options: [
      { value: "supported", label: "Forearms supported on armrests or the desk", good: true },
      {
        value: "hanging",
        label: "Hanging unsupported from my shoulders",
        fixes: [
          {
            text: "Support your forearms. Each unsupported arm is roughly 4kg hanging from the shoulder girdle, and the muscles between your shoulder blades hold it there for the whole working day.",
            structures: ["rhomboid-major", "trapezius-middle", "trapezius-upper"],
          },
        ],
      },
      {
        value: "reaching",
        label: "Reaching forward to the keyboard or mouse",
        fixes: [
          {
            text: "Pull the keyboard and mouse close enough that your elbows stay by your sides. Reaching holds the mid-back muscles long and loaded — which is what produces that burning between the shoulder blades by mid-afternoon.",
            structures: ["rhomboid-major", "trapezius-middle"],
          },
        ],
      },
    ],
  },
  {
    id: "hips",
    ask: "How do your hips sit in the chair?",
    options: [
      { value: "above", label: "Hips slightly above my knees", good: true },
      {
        value: "level",
        label: "About level with my knees",
        fixes: [
          {
            text: "Raise the seat a little so your hips sit just above your knees. It reduces how far the hip flexors are held short and takes some rounding out of the low back.",
            structures: ["psoas-major"],
          },
        ],
      },
      {
        value: "below",
        label: "Sunk below my knees, in a soft or low seat",
        fixes: [
          {
            text: "That position holds the hip flexors at their shortest and rounds the low back for hours. Raise the seat, or sit on a cushion, so the hips clear the knees.",
            structures: ["psoas-major", "gluteus-maximus", "multifidus"],
          },
        ],
      },
    ],
  },
  {
    id: "pocket",
    ask: "Do you sit on a wallet or phone in a back pocket?",
    options: [
      { value: "no", label: "No", good: true },
      {
        value: "yes",
        label: "Yes, most days",
        fixes: [
          {
            text: "Take it out. This is not folklore — it tilts your pelvis for as long as you are sitting on it, and it is a genuinely common driver of one-sided low back and deep buttock pain.",
            structures: ["quadratus-lumborum", "piriformis"],
          },
        ],
      },
    ],
  },
  {
    id: "sleep",
    ask: "How do you sleep?",
    options: [
      { value: "back", label: "On my back", good: true },
      {
        value: "side",
        label: "On my side",
        fixes: [
          {
            text: "Use one pillow that exactly fills the gap between your ear and the mattress — no more, no fewer — and put a pillow between your knees. Without it the top hip drops all night and the gluteus medius spends eight hours in a lengthened, compressed position.",
            structures: ["gluteus-medius", "levator-scapulae", "quadratus-lumborum"],
          },
        ],
      },
      {
        value: "front",
        label: "On my front",
        fixes: [
          {
            text: "Sleeping face down means your neck is rotated near end-range for hours. If you cannot change it, use the thinnest pillow you can tolerate and put one under your hips to reduce the arch in your low back.",
            structures: ["levator-scapulae", "trapezius-upper", "multifidus"],
          },
        ],
      },
    ],
  },
  {
    id: "breaks",
    ask: "How often do you actually get up?",
    options: [
      { value: "often", label: "Every half hour or so", good: true },
      {
        value: "hourly",
        label: "Roughly once an hour",
        fixes: [
          {
            text: "Push toward every 30 minutes. For desk-driven tension, how often you move matters considerably more than how long you stretch when you finally do.",
          },
        ],
      },
      {
        value: "rarely",
        label: "I look up and three hours have gone",
        fixes: [
          {
            text: "Set something to interrupt you. Muscles held in one position complain about the duration, not the posture — and gluteus medius in particular switches off with sustained sitting faster than almost anything else.",
            structures: ["gluteus-medius", "psoas-major", "trapezius-upper"],
          },
        ],
      },
    ],
  },
  {
    id: "carry",
    ask: "How do you carry your bag?",
    options: [
      { value: "backpack", label: "Backpack, both straps", good: true },
      {
        value: "shoulder",
        label: "One shoulder",
        fixes: [
          {
            text: "Switch to a backpack, or at least swap shoulders regularly. A single-strap bag makes the upper trapezius shrug continuously just to stop it sliding off.",
            structures: ["trapezius-upper", "levator-scapulae"],
          },
        ],
      },
      {
        value: "child",
        label: "I carry a small child on one hip",
        fixes: [
          {
            text: "Swap sides deliberately and often — the habitual side is almost always the same one. Carrying weight on one hip makes the quadratus lumborum on the opposite side work continuously to keep you upright.",
            structures: ["quadratus-lumborum", "gluteus-medius"],
          },
        ],
      },
    ],
  },
];

export default function DeskPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const addToSession = useAtlas((s) => s.addToSession);

  const fixes = useMemo(() => {
    const out: { text: string; structures: string[] }[] = [];
    for (const q of QUESTIONS) {
      const a = answers[q.id];
      if (!a) continue;
      const opt = q.options.find((o) => o.value === a);
      for (const f of opt?.fixes ?? [])
        out.push({ text: f.text, structures: f.structures ?? [] });
    }
    return out;
  }, [answers]);

  const affected = useMemo(
    () => [...new Set(fixes.flatMap((f) => f.structures))],
    [fixes],
  );

  const answered = Object.keys(answers).length;
  const good = QUESTIONS.filter(
    (q) => q.options.find((o) => o.value === answers[q.id])?.good,
  ).length;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
          Fix the cause
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Desk, sleep and carry</h1>
        <p className="mt-3 max-w-xl text-pretty leading-relaxed text-ink-2">
          Stretching something that gets re-shortened for eight hours a day is a
          losing battle. Seven questions, and you get the specific changes worth
          making — tied to the muscles they actually affect.
        </p>

        <div className="mt-8 space-y-6">
          {QUESTIONS.map((q, i) => (
            <fieldset key={q.id}>
              <legend className="text-sm font-semibold">
                <span className="font-mono text-xs text-ink-3">
                  {String(i + 1).padStart(2, "0")}
                </span>{" "}
                {q.ask}
              </legend>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {q.options.map((o) => (
                  <button
                    key={o.value}
                    aria-pressed={answers[q.id] === o.value}
                    onClick={() =>
                      setAnswers((a) => ({ ...a, [q.id]: o.value }))
                    }
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                      answers[q.id] === o.value
                        ? o.good
                          ? "border-ok bg-ok/15 text-ok"
                          : "border-accent bg-accent text-accent-ink"
                        : "border-rule text-ink-2 hover:text-ink",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        {answered > 0 && (
          <section className="mt-10 border-t border-rule pt-6">
            <h2 className="text-xl font-semibold">
              {fixes.length === 0
                ? "Nothing to change here"
                : `${fixes.length} thing${fixes.length > 1 ? "s" : ""} worth changing`}
            </h2>
            <p className="mt-1.5 text-sm text-ink-3">
              {good} of {answered} answered already in good shape.
            </p>

            {fixes.length === 0 ? (
              <p className="mt-3 text-sm leading-relaxed text-ink-2">
                Genuinely — on what you have answered so far, your setup is not
                the problem. Which is useful to know, because it means the answer
                is somewhere else.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {fixes.map((f, i) => (
                  <li
                    key={i}
                    className="rounded-card border border-rule bg-surface p-4"
                  >
                    <p className="flex gap-2.5 text-sm leading-relaxed">
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-accent"
                      />
                      <span>{f.text}</span>
                    </p>
                    {f.structures.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5 pl-6">
                        {f.structures.map((id) => (
                          <Link
                            key={id}
                            href={`/m/${id}/`}
                            className="rounded-full border border-rule px-2.5 py-0.5 text-[11px] text-ink-2 hover:border-accent hover:text-accent"
                          >
                            {getStructure(id)?.name ?? id}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {affected.length > 0 && (
              <div className="mt-6 rounded-card border border-accent/30 bg-accent/8 p-4">
                <p className="text-sm font-semibold text-accent">
                  Build a routine for what your setup is doing to you
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">
                  Your answers point at {affected.length} structures. Add them and
                  Atlas will assemble a session — though the setup changes above
                  will do more than the stretching will.
                </p>
                <button
                  onClick={() => affected.forEach((id) => addToSession(id, "center"))}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink"
                >
                  Add all {affected.length} <ArrowRight size={14} />
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
}
