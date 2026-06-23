---
slug: game-quality-rescue
status: approved
intent: unclear
pending-action: fill existing placeholder .omo/plans/game-quality-rescue.md after explicit user approval; do not implement in this planning session
approach: Stop treating the project as publish-ready. Reframe it as a quality rescue: preserve the red-line constraints (single-button timing, vanilla Canvas/JS, no engine, no TypeScript, no new backend), but replace the demo-feeling execution with a vertical slice that has a real micro-story, recognizable characters, authored scene beats, tactile timing feedback, proper design-system documentation, and browser-based visual/QA gates.
---

# Draft: game-quality-rescue

## Routing call
- Intent = UNCLEAR: the user's concrete desired end-state is not a detailed feature request; it is a severe quality rejection of the current game. Per UNCLEAR path, do not interrogate the user; derive best-practice defaults from repo evidence and present them for veto at the approval gate.
- Loaded routing references: shared/ulw-plan full workflow + unclear intent path; frontend design router + redesign skill + perfection ruleset; pua for quality-complaint response discipline.

## Immediate diagnosis
- The user's complaint is valid. The current implementation is closer to a functional prototype than a game worth public attention.
- This is not meaningfully solved by blaming Kimi/GLM/model choice. The repo evidence points to process failure: acceptance criteria validated mechanics/build/test, but did not enforce player desire, visual distinctiveness, narrative clarity, or repeat-play value.

## Components ledger
| id | component | current evidence | rescue outcome |
|---|---|---|---|
| C1 | Product promise and state truth | README says prototype at README.md:5-10; project-state says published at docs/project-state.md:7-10 | Align docs/status to "not publish-ready until quality gate passes" |
| C2 | Visual identity/design system | No DESIGN.md found; art-direction is descriptive only (docs/art-direction.md:1-94); raw colors live in code/index | Add DESIGN.md before UI/visual edits; all visual tokens and character language trace to it |
| C3 | Character/narrative embodiment | Spec promises specific characters and story beats (specs/active/single-button-timing.md:127-167); implementation mostly draws geometric blobs/rectangles (src/main.js:620-648, 681-717) | Make the toad/bird and room readable without explanation; add micro-story beats before/during/after play |
| C4 | Core loop feel | Current loop is one moving object + timing window (src/main.js:499-618); user finds it one-and-done | Keep one-button rule, but add authored rhythm patterns, escalating scene beats, readable near-miss feedback, and reason to retry |
| C5 | QA gates | E2E only checks state transitions and no console error (e2e/game.spec.js:3-75); final verification accepted P0-only playtest despite plan requiring >=3 raw feedbacks | Add visual/narrative/playability gates: screenshots, deterministic timing tests, 3 raw playtests, and an explicit "want to replay?" criterion |
| C6 | PWA/public polish | Manifest and favicon still use vite.svg (index.html:8; public/manifest.json:8-13) | Replace placeholder identity assets; add meta description/social basics if public link remains |

## Findings (evidence)
- Current rendering is code-drawn primitives: item shapes are only rect/circle (src/main.js:86-93), rendered as simple filled rectangles/circles with highlight (src/main.js:620-636). This directly matches the user's "线条、方格、圆圈" complaint.
- The playable loop is mechanically thin: generate one object, move along a horizontal track, press at the target (src/main.js:151-185, 205-217, 499-618). Combo exists, but it is a score multiplier, not a new experience layer (src/main.js:227-257).
- The story is mostly front/back-loaded text, not gameplay: title subtitle (src/main.js:452-455), selection labels (src/main.js:470-496), ending text (src/main.js:720-737). During play, the player mostly sees track/window/item abstractions.
- The two roles are not meaningfully differentiated enough in play: `generateObject()` changes start/target direction (src/main.js:159-160), and text changes (src/main.js:388), but the core beat remains the same moving object.
- A likely visual bug exists: `COLORS.targetWindow` and `COLORS.targetBorder` are used (src/main.js:541-544) but not defined in COLORS (src/main.js:62-72). The timing window may render with a stale/default style instead of an intentional one.
- TestMode is not actually deterministic as specified: code still uses Math.random in object generation and particles (src/main.js:127-181, 270-277), while the testMode hook only exposes state (src/main.js:852-881). The spec promised fixed seed/clock (specs/active/single-button-timing.md:27-29; docs/interfaces.md:58-63).
- QA passed the wrong things: e2e asserts title/select/playing and any lastResult truthy, plus mobile/resize existence (e2e/game.spec.js:3-75). It does not assert readable characters, visible timing window, story beats, satisfying feedback, or replay desire.
- The playtest gate was weakened: plan required >=3 raw feedbacks including mobile (personal-browser-game plan lines 174-179); actual task-6 report records only P0 author feedback and says more feedback is still missing (.omo/evidence/task-6-personal-browser-game.md:5-8, 59-63). Final verification still marks T6 complete with "P0 作者反馈" (.omo/evidence/task-final-verification.md:46-56).
- Public polish still has scaffold residue: favicon and manifest icon point to vite.svg (index.html:8; public/manifest.json:8-13).
- Docs are inconsistent: README says current phase is prototype (README.md:5-10); project-state says published and awaiting itch upload (docs/project-state.md:7-10).

## Subagent audit synthesis (completed after gate brief)
- Implementation explorer confirmed the same root shape: `src/main.js` contains audio, rendering, input, state machine, game loop, and test hook in one 885-line file; the project has no content/asset pipeline and no external assets. This reinforces that the current artifact is a functional prototype, not a finished-feeling game.
- Spec auditor found the uncomfortable middle truth: low fidelity was partly allowed by the spec (`精细手绘美术` out of scope; zero external assets), but the implementation also underdelivered the intended 2B route split. Current role difference is mostly start/target direction and text, not two authored rhythms or distinct experiences.
- Visual auditor confirmed there is no `DESIGN.md`; `docs/art-direction.md` is a mood note, not an enforceable design system. It also independently flagged the undefined `COLORS.targetWindow` / `COLORS.targetBorder` usage.
- QA auditor confirmed current gates would pass a visually/narratively poor game: Vitest only tests timing math, Playwright only checks state transitions/mobile canvas existence/no console errors, and `docs/how-to-test.md` has no quality checklist.
- Planning-history auditor confirmed the process issue: the original plan over-indexed on artifact/build/publish gates, allowed a split "publish-ready vs actual publish" terminal state, and did not make user-perceived quality or documentation consistency hard gates.

## Adopted defaults for the rescue plan
| decision | adopted default | rationale | reversible |
|---|---|---|---|
| Project status | Reclassify as "quality rescue / not publish-ready" until new gates pass | User does not want to play twice; public publishing now hurts credibility | Yes |
| Strategy | Build a polished vertical slice, not a feature expansion | Project red lines forbid multi-mechanic bloat; quality must come from depth, presentation, and authored beats | Yes |
| Tech | Stay vanilla Canvas + JS; no engine, no TypeScript, no new dependency unless ADR | AGENTS red lines R2/R3 and current stack; current failure is taste/QA, not lack of engine | Yes |
| Visual direction | Hand-authored storybook/toy-theatre Canvas style: readable silhouettes, props, room layers, squash/stretch | Fits existing "toad + bird + room" concept; avoids generic asset dump and avoids copyright copying | Yes |
| Gameplay depth | Keep one-button timing, add authored rhythm patterns and scene beats instead of adding mechanics | Preserves single-mechanic constraint while making play feel designed | Yes |
| QA | Add browser screenshot QA at 375/768/1280, deterministic testMode, and raw playtest gate before any "published" claim | Current tests allowed a technically working but emotionally failed product | Yes |

## Approval gate brief to present
- Pending action: write `.omo/plans/game-quality-rescue.md` only.
- No implementation will happen in this planning session.
- If approved, the plan will include todos for: status/documentation correction; DESIGN.md creation; deterministic timing/test harness repair; visual/narrative vertical slice; one-button rhythm-depth pass; PWA identity cleanup; real browser visual QA; real playtest gate; final review.

## Approval record
- User approved writing the plan after the gate brief.
- Approval authorizes filling `.omo/plans/game-quality-rescue.md` only; it does not authorize implementation.

## Metis gap analysis integration
- Add Gate 0 framing: default to rescuing the existing "toad + bird / order + intrusion" concept because the user rejected execution quality, not the concept itself. If the user explicitly denies the concept before execution starts, execution must stop and a new spec/plan is required.
- Treat GitHub Pages as an online prototype, not a quality-approved release. Do not erase the factual publication, but remove publish-ready language until gates pass.
- Add a rescue spec/addendum before product-code changes to obey project constitution for user-visible multi-file work.
- Cap the vertical slice: one room, two readable silhouettes, at most six object types, at most three authored beats per role, no new mechanics.
- Fix deterministic testMode and stable contract docs before visual/gameplay QA.
- Clarify `miss` as game-loop timeout unless explicitly changing `judgeTiming` semantics with tests.
- Reconcile spec references to nonexistent e2e files by creating them or updating the spec.
- Make playtest raw evidence an external human-input gate: agent verifies schema and summarizes only; absence means blocked.
- Add automated red-line scans: no TypeScript, no engine/backend deps, no `vite.svg`, no unlicensed external assets.

## High-accuracy review record
- Native Momus review: APPROVE. Summary: plan executable; todos have starting points, dependencies, acceptance, QA scenarios, commit lines; playtest gate is honest and does not ask agent to invent feedback.
- Codex CLI review attempt 1: disposable CODEX_HOME had no usable auth; failed with 401 Unauthorized.
- Codex CLI review attempt 2: default auth in disposable workspace reached Codex but `openai/gpt-5.5` is rejected by the local Codex account (`model is not supported when using Codex with a ChatGPT account`). No plan content review was produced.
- Fallback independent Momus review: REJECT with three blocking fixes: PowerShell-safe `rg --glob "*.js"`, exact PWA identity Playwright command, exact playtest raw validation script command.
- Fixes applied to `.omo/plans/game-quality-rescue.md`, then fallback Momus re-review returned OKAY.
