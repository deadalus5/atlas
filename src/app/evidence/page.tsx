"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Chip } from "@/components/ui";
import { EVIDENCE_COPY, type EvidenceGrade } from "@/data";
import { PUBLISHERS, REFERENCES } from "@/data/references";
import { MEDIA } from "@/data/media";
import { cn } from "@/lib/cn";

/**
 * The myths this genre repeats endlessly. Getting these right is most of the
 * reason to trust anything else on the site.
 */
const MYTHS = [
  {
    claim: "Bad posture causes back pain.",
    truth:
      "The link between how you sit and whether your back hurts is far weaker than everyone assumes. Large studies have repeatedly failed to find that any particular spinal alignment predicts pain. What does predict trouble is staying in one position for hours, whatever that position is.",
    instead:
      "There is no single correct posture. The best posture is the next one — change position often, and treat “my posture is wrong” as a much smaller factor than it is usually made out to be.",
  },
  {
    claim: "Discs slip out of place.",
    truth:
      "Discs are firmly attached to the vertebrae above and below. Nothing slips out and nothing goes back in. A disc can bulge or herniate, which is the inner material pushing against or through the outer ring — a very different thing from a bone or disc “going out”.",
    instead:
      "Nothing in your back is out of place that needs putting back. Most disc herniations reduce on their own over weeks to months.",
  },
  {
    claim: "My MRI shows a bulge, so that is what hurts.",
    truth:
      "Disc bulges are extremely common in people with no pain at all, and become more common with age — by their 50s, the majority of pain-free people have at least one. An imaging finding is not automatically the cause of your symptoms.",
    instead:
      "Scan findings have to be matched to your actual symptoms and examination. Many findings are the spinal equivalent of grey hair.",
  },
  {
    claim: "You need a strong core to protect your back.",
    truth:
      "Core strengthening helps back pain about as much as general exercise does — which is to say, it helps, but not because it is bracing anything. There is no good evidence that people with back pain have weak deep abdominals as a cause, or that bracing constantly protects you.",
    instead:
      "Exercise you will actually keep doing beats the theoretically optimal one. Constant bracing is unnecessary and can make things worse.",
  },
  {
    claim: "Stretching prevents injury.",
    truth:
      "Static stretching before activity does not meaningfully reduce injury risk, and can briefly reduce power output. That does not make stretching useless — it changes how you feel and how much range you have — but injury prevention is not what it does.",
    instead:
      "Stretch because it feels good and gives you range. For injury risk, gradual loading and not spiking your training volume matter far more.",
  },
  {
    claim: "Pain means damage.",
    truth:
      "Pain is produced by the nervous system in response to perceived threat, and its intensity correlates poorly with tissue state — especially after the first few weeks. This is why pain can persist long after tissue has healed, and why stress and sleep change how much things hurt.",
    instead:
      "Hurt does not necessarily equal harm. Persistent pain often needs the nervous system settling down as much as it needs tissue work.",
  },
  {
    claim: "Rest is best for a bad back.",
    truth:
      "Bed rest makes acute low back pain worse and slower to resolve. This is one of the better-established findings in the field, and it reversed the standard advice decades ago.",
    instead:
      "Stay as active as the pain reasonably allows, and get moving early. Modify what you do rather than stopping.",
  },
  {
    claim: "My pelvis is out of alignment and needs correcting.",
    truth:
      "Clinicians cannot reliably agree with each other when assessing pelvic position, small asymmetries are near-universal, and no treatment has been shown to change position in a lasting way.",
    instead:
      "Asymmetry is normal. If a treatment helps you, that is worth something — but the explanation is unlikely to be that something was put back.",
  },
  {
    claim: "Cracking your joints causes arthritis.",
    truth:
      "The sound is gas moving in the joint fluid. The best-known investigation of this involved a doctor cracking the knuckles of one hand only for over sixty years and finding no difference.",
    instead:
      "It is not damaging you. If it becomes compulsive, that is worth looking at — but not for arthritis reasons.",
  },
];

const GRADES: EvidenceGrade[] = ["strong", "moderate", "emerging", "traditional"];

export default function EvidencePage() {
  const [openRefs, setOpenRefs] = useState(false);
  const channels = [...new Set(MEDIA.map((m) => m.channel))].sort();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
          How this was put together
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Evidence &amp; honesty</h1>
        <p className="mt-3 max-w-xl text-pretty leading-relaxed text-ink-2">
          Almost everything in this genre repeats the same handful of claims that
          the evidence stopped supporting years ago. Atlas is more useful for
          refusing to, so here is what it will not tell you — and why.
        </p>

        {/* ---- myths ---- */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Things Atlas will not tell you</h2>
          <ul className="mt-4 space-y-4">
            {MYTHS.map((m) => (
              <li
                key={m.claim}
                className="rounded-card border border-rule bg-surface p-5"
              >
                <p className="text-sm font-semibold text-danger line-through decoration-danger/50">
                  {m.claim}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  {m.truth}
                </p>
                <p className="mt-2 border-l-2 border-accent/50 pl-3 text-sm leading-relaxed">
                  {m.instead}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- grades ---- */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold">What the labels mean</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            Every exercise carries one of these. Plenty of genuinely useful things
            are only marked “traditional” — that is not a criticism, it is a
            statement about how well the thing has been tested.
          </p>
          <dl className="mt-4 space-y-2">
            {GRADES.map((g) => (
              <div
                key={g}
                className="flex flex-col gap-1 rounded-card border border-rule bg-bg-2 p-3 sm:flex-row sm:items-baseline sm:gap-4"
              >
                <dt className="shrink-0">
                  <Chip
                    tone={
                      g === "strong" ? "ok" : g === "traditional" ? "warn" : "neutral"
                    }
                  >
                    {g}
                  </Chip>
                </dt>
                <dd className="text-sm leading-relaxed text-ink-2">
                  {EVIDENCE_COPY[g]}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---- method ---- */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold">How the content was built</h2>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-2">
            <li>
              <strong className="text-ink">The anatomy drawing</strong> is
              hand-authored SVG, built from proportional landmarks rather than
              traced from copyrighted artwork. Every structure is a real,
              individually addressable shape, which is what lets the same
              coordinate space carry trigger points, pain regions and the
              heatmap.
            </li>
            <li>
              <strong className="text-ink">Anatomical facts</strong> — origin,
              insertion, innervation, nerve roots — were compiled against the
              references listed below, principally StatPearls, Kenhub and
              TeachMeAnatomy.
            </li>
            <li>
              <strong className="text-ink">Referral patterns</strong> follow the
              trigger-point literature descending from Travell and Simons. These
              are clinically useful and widely taught, but the underlying model
              of trigger points is contested — treat a referral pattern as a lead
              to test, not a diagnosis.
            </li>
            <li>
              <strong className="text-ink">Every video</strong> was checked
              against YouTube&rsquo;s own oEmbed endpoint before shipping, and the
              title and channel shown are the ones YouTube returned. Anything that
              failed was dropped rather than shipped broken.{" "}
              {MEDIA.length} demonstrations from {channels.length} channels
              survived that check.
            </li>
            <li>
              <strong className="text-ink">Every reference link</strong> was
              fetched and confirmed to resolve. {REFERENCES.length} did.
            </li>
          </ul>
        </section>

        {/* ---- limits ---- */}
        <section className="mt-10 rounded-card border border-warn/35 bg-warn/8 p-5">
          <h2 className="text-lg font-semibold text-warn">
            What Atlas is bad at
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-2">
            <li>
              It cannot examine you. Every suggestion here is generic, and the
              single most informative thing about your problem — how it responds
              to being moved and touched — is invisible to it.
            </li>
            <li>
              It draws one idealised body. Yours is a different shape, and the
              map is a guide to roughly where things are, not a scan of you.
            </li>
            <li>
              The triage screen matches words against fixed rules. It will miss
              things you phrase unusually, so it errs toward flagging caution.
            </li>
            <li>
              Anatomical coverage is uneven. The regions with the most detail are
              the shoulder girdle and the lumbar spine; other areas are drawn but
              have less written about them so far.
            </li>
          </ul>
        </section>

        {/* ---- disclaimer ---- */}
        <section className="mt-10 border-t border-rule pt-6">
          <h2 className="text-lg font-semibold">Not medical advice</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            Atlas is an educational tool. It is not a diagnosis, it does not know
            your history, and it cannot replace being examined by someone
            qualified. If something here does not match what you are feeling,
            trust your body over the website. If a movement makes your symptoms
            worse — particularly if pain spreads further down a limb — stop doing
            it. And if anything on the red-flag list applies to you, act on that
            rather than on anything else here.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            Nothing you enter leaves your browser. There is no account, no
            server, and no analytics.
          </p>
        </section>

        {/* ---- references ---- */}
        <section className="mt-10">
          <button
            onClick={() => setOpenRefs((o) => !o)}
            className="text-lg font-semibold underline underline-offset-4"
          >
            References ({REFERENCES.length})
          </button>
          <p className="mt-2 text-sm text-ink-3">
            From {PUBLISHERS.join(", ")}.
          </p>
          {openRefs && (
            <ul className="mt-4 space-y-1.5">
              {REFERENCES.map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex items-baseline gap-2 text-sm leading-relaxed text-ink-2 hover:text-ink",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      {r.title}
                      <span className="text-ink-3"> · {r.publisher}</span>
                    </span>
                    <ExternalLink size={12} className="shrink-0 text-ink-3" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
