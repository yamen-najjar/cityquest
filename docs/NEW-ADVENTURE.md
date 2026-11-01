# Adding a new adventure

Every published adventure offers the same experience. The checklist below is enforced. `npm test` (and CI)
fails for a published adventure that misses any **required** item, with a message saying what to add. The
admin page **/admin/content** shows the same report. While an adventure is a `draft`, the missing pieces are
only warnings, so you can build it up step by step.

Look at an existing story while you work: `src/content/adventures/het-duivelshuis.ts` (Arnhem) uses every
feature.

## Required

| Feature | Where | Notes |
| --- | --- | --- |
| Eight chapters with a puzzle each, 3 hints (the last is the solution), and journal clues | `content/adventures/<slug>.ts` | Use several puzzle types. Chapter ids are short slugs. |
| An answer key for every chapter | `content/answers.server.ts` | Never in the story file. Accept the answer in every language. |
| **An intro cutscene for every chapter**, and success cutscenes for the key moments | `content/adventures/scenes.ts`, attached in `content/adventures/index.ts` with `withScenes` | Reuse the sets and the positions that existing scenes use, so props stand where the set expects them. Check the frames with `node .shots/capture-arnhem.mjs` (copy it for your slug). |
| **An evidence board** with at least 3 questions | `board` in the story file, plus `board:<id>` keys in `answers.server.ts` | Answer format: `person\|card+card` (built with `board()`). The person must have been met, and both cards must be held, when the question opens; a unit test proves it. Don't give away the finale's answer. |
| **At least one story choice** that changes the story | `choice` on a chapter | Every option must change the final scene (`ending.revealIf`) **and every ending** (`epilogueIf`). Journal notes (`Person.notes[].when`) are a good extra. |
| A 3D artifact for the finale, and a 3D model for every item | `ending.artifact`, `items[].model` | Models are built in code (`ModelSpec`); nothing is downloaded. |
| Every text in German, English and Arabic | the story and scene files | Arabic is written out, not machine-transliterated. |
| Every English text translated into Dutch | `content/translations/nl.ts`, keyed by the exact English text | `missingTranslations.nl` must stay empty. If you edit an English sentence, edit its Dutch key too. |
| Simulated checkpoints until the route is walked | `checkpoint.simulated: true` | Never present an unvalidated route as tested. |

## Optional (a matter of tone)

- **A pursuer** (`pursuit`): hints bring someone closer. It suits tense stories; the family story has none on purpose.
- **Interrogations, Morse, the cipher wheel, mirrored writing**: use whatever fits the story.

## Checks before you open a pull request

```
npm run typecheck
npm test
npm run test:e2e
```

Then add a walkthrough to `tests/e2e/` that plays the adventure to the end, including its story choice
(see `duivelshuis.spec.ts`).
