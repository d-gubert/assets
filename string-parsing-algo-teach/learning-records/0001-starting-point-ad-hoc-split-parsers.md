# Starting point: ad-hoc `split()` parsers, no formal parsing structure

Douglas reports having written parsers with `split()`, `indexOf()` and regex, and
that they "always felt fragile" — so he has real exposure to the problem domain but
no exposure to the standard structure that solves it (cursor → tokens → recursive
descent). He is a comfortable working programmer and chose TypeScript/JavaScript.

**Implications for teaching:**

- Skip all motivation for "why not just split" beyond one concrete demonstration —
  he already believes it. Spend the budget on structure instead.
- Do *not* assume any vocabulary: lexeme, token, terminal, non-terminal, lookahead,
  and recursive descent are all new. Introduce them one at a time and put each into
  [[glossary]] only once used correctly.
- The main risk is **fluency without storage strength**. A cursor is easy to read and
  easy to nod at. Every lesson must make him type the code from memory rather than
  recognise it on a page.
- Mission is broad (tmux tool + own DSL + fundamentals), so the tmux line is the
  spine, but each lesson should name the transferable rule as well as the tmux fact.
