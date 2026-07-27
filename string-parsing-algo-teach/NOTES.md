# Working Notes

## User preferences

- Language for all code: **TypeScript / JavaScript**. Wants live in-browser feedback.
- Explicitly asked for **incrementally difficult** lessons that build deep
  understanding — so hold the line on one concept per lesson, and let difficulty
  come from the exercises, not from cramming more knowledge in.
- Hard constraint he set himself: **no libraries, no regex, token by token.**
  Never hand him a regex shortcut, even as an aside.

## Teaching stance

- He has written ad-hoc `split()` parsers before and found them fragile. He does not
  need convincing that the problem is real — he needs the *structure* that replaces
  the hack. Lead with structure, not motivation.
- Because he's a working programmer, the risk is **fluency masquerading as mastery**:
  he'll read a cursor implementation and think "obviously". Every lesson must force
  retrieval — write the code, don't read the code.

## Planned lesson arc

Each lesson is one concept. Difficulty ratchets. The tmux line is the spine.

1. **The cursor** — position + `peek`/`advance`. Parse `382x99`. ✅ written
2. **Expect & fail well** — `expect(ch)`, column-accurate errors. Parse `382x99,0,0`.
3. **Two phases** — tokens vs. syntax. Tokenise the layout body.
4. **Recursive descent** — `{}` / `[]` nesting → the pane tree. The big one.
5. **Lookahead & backtracking** — the real pane-id ambiguity from `layout_parse`.
6. **The messy outer grammar** — `1: Tab #1* (3 panes) [...] @0 (active)`; names
   containing spaces and `#`; delimiter-terminated fields.
7. **Grammar notation** — EBNF, and mechanically turning a rule into a function.
8. **Round-tripping & validation** — serialise back out, verify the checksum.
9. **Design your own DSL** — capstone.

## Open questions to revisit

- Does he want the final artefact to be actual production code for a tmux tool he's
  building? If yes, lesson 6+ should target his real repo. Ask around lesson 3.
- Has not yet been asked about communities. Raise once he has something to show —
  r/ProgrammingLanguages rewards showing work.
