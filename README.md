# Atlas

**An interactive anatomical map of the back, neck and hips. Point at what hurts.**

→ **[deadalus5.github.io/atlas](https://deadalus5.github.io/atlas/)**

---

There is no shortage of stretch content on the internet, and that is exactly the
problem. To search for help with the knot between your shoulder blades, you first
have to know the word "rhomboid" — and the thing that hurts is frequently not the
thing that is broken. Gluteus medius refers pain into the low back. Infraspinatus
refers into the front of the shoulder. Scalenes refer down the arm. So people
search the wrong term, stretch the wrong muscle, and conclude that stretching
doesn't work.

Atlas inverts the entry point. You point at your own body. It tells you what is
under your finger — at whatever depth you choose — what that structure does, why
it is angry, what actually fixes it, and what else might be the real culprit.
Then it hands you a timed routine and gets out of the way.

The name is the C1 vertebra your skull balances on, an anatomical atlas, and the
titan who carries the weight on his back.

## What it does

- **Layered body map.** A hand-authored posterior view with a depth slider that
  peels superficial → intermediate → deep → skeletal. 89 individually clickable
  structures. Click the same spot at different depths and you get a different
  structure each time.
- **Referred-pain reverse lookup.** Click where it *hurts* and the map lights up
  the distant muscles whose documented referral zones cover that point — at
  whatever depth they live. Clicking the low back lighting up gluteus medius in
  both hips is the point of the feature.
- **Routines that assemble themselves.** Select structures, get a session
  ordered mobilise → release → activate → stretch → integrate, fitted to the
  time you have, with a full-screen player: timers, automatic side-switching,
  spoken cues, screen wake-lock.
- **Safety gating that explains itself.** Declare osteoporosis, pregnancy,
  hypermobility or leg symptoms and drills are withheld — always with the
  specific reason shown, never silently.
- **Triage without a server.** Describe the pain in your own words; a
  deterministic rule engine screens red flags first, then directional
  preference, then candidate structures. It shows you which rules it matched.
- **Journal.** Log by region in two taps; your own body fills with a heatmap.
- **Plain or clinical.** Every description has two registers, one toggle apart.
- **Honest about evidence.** Claims are graded, and the nine myths this genre
  repeats are corrected rather than echoed.

## Current state

Built and working: the posterior map, referral lookup, routine builder and
player, journal, triage, desk coach, preset routines, evidence page. 64 curated
videos and 48 reference links, each independently verified to resolve before
shipping. `npm run verify:content` gates every cross-reference in CI.

Honest gaps: **24 of the 89 drawn structures have written guidance so far** —
the rest are clickable and named but say so plainly rather than showing filler.
The anterior view, the nerve/dermatome overlay and the fascial-lines mode are
designed but not built.

## Privacy

There is no account, no server and no analytics. Your pain journal is stored in
your browser's `localStorage` and never leaves your device. Export or delete it
whenever you like.

## Not medical advice

Atlas is an educational tool. It cannot examine you and it does not know your
history. It ships a red-flag screen for the symptoms that genuinely warrant a
doctor, and you should use it — but when in doubt, see a clinician.

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export to ./out
```

The site is a fully static Next.js export. `PAGES_BASE` is empty locally and
`/atlas` in CI, where GitHub Actions builds and publishes to GitHub Pages on
every push to `main`.

## Licence

MIT for the code. Anatomical content is compiled from cited references listed
in-app on the Evidence page.
