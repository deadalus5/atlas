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

- **Layered body map.** Posterior and anterior views with a depth slider that
  peels superficial → intermediate → deep → skeletal. Click the same spot at
  different depths and you get different structures.
- **Referred-pain reverse lookup.** Click where it *hurts* and the map lights up
  the distant muscles whose documented referral zones cover that point.
- **Routines that assemble themselves.** Select structures, get an ordered
  session (mobilise → release → activate → stretch → integrate) and a
  full-screen player with timers, side-switching and spoken cues.
- **Plain or clinical.** Every description has two registers, one toggle apart.
- **Honest about evidence.** Claims are graded, and the myths this genre repeats
  are corrected rather than echoed.

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
