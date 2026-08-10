# Start here

## If you need the presentation

### Fastest option

Open the finished file: `Knoxx-Outbound-Intelligence-Interview.pptx`.

### If you want Gamma to restyle it

1. Open `gamma-master-prompt.md` and paste its instruction into Gamma.
2. Upload or paste `interview-deck-gamma.md` as the content source.
3. Upload `architecture-clean.png` when Gamma asks for the architecture image.
4. Do not let Gamma invent URLs, metrics or claims.

## If you need the Lovable frontend

Paste all of `lovable-master-prompt.md` into Lovable. It explicitly requires the existing Supabase project and prohibits creation of a second backend.

The live site is `https://knoxx-insight-quest.lovable.app`. The production Supabase integration is merged into the GitHub-connected `main` branch. In Lovable, use **Publish → Update** once to refresh the public snapshot.

The revised presentation is available in [Google Slides](https://docs.google.com/presentation/d/1rv1xUF5RiuSoF6CzxqHfBlhyvNNfFVDlW1JK5qAW9HM/edit).

## If you need an architecture visual

Choose either method:

- Import `architecture-clean.svg` or `architecture-clean.png` for the polished static architecture.
- Paste the Mermaid blocks from `miro-architecture.md` for editable diagrams and state machines.

The static SVG/PNG is the presentation source of truth. A Miro board is optional and should not block the interview.

## If you are preparing for the interview

Read in this order:

1. `interview-ready-guide.md` — first-pass preparation.
2. `Knoxx-Outbound-Intelligence-Interview.pptx` — rehearse the story.
3. `CPO_REVIEW.md` — understand the product verdict and remaining blockers.
4. `workflow-interview-guide.md` — detailed node/debugging reference.
5. `TEST_REPORT.md` — exact proof and limitations.

## Final manual checks

- In Lovable, click **Publish → Update** after the GitHub sync completes.
- Sign in and run one live authenticated smoke test.
- Refresh screenshots only if the published UI materially changes.
