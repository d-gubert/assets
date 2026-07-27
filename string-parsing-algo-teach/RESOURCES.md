# String Parsing Resources

## Knowledge

- [Book: _Crafting Interpreters_ — Robert Nystrom](https://craftinginterpreters.com/)
  The primary source for this workspace. Free online, exceptionally well written.
  Use for: everything structural. The two chapters that matter most here are
  [Scanning](https://craftinginterpreters.com/scanning.html) (the cursor,
  `advance`/`peek`/`match`, lexeme vs. token) and
  [Parsing Expressions](https://craftinginterpreters.com/parsing-expressions.html)
  (recursive descent, one function per grammar rule).

- [Source: `tmux/layout-custom.c`](https://github.com/tmux/tmux/blob/master/layout-custom.c)
  The authoritative grammar for the layout string we are learning to parse. Use for:
  settling any question about the format. Key facts read directly off the source —
  cells are `%ux%u,%d,%d` (`WIDTHxHEIGHT,X,Y`), `{}` is a left-right split, `[]` is a
  top-bottom split, and `layout_parse` performs real backtracking (it saves the
  pointer, scans digits, and rewinds if it finds an `x`) to resolve the pane-id
  ambiguity. That backtrack is a whole lesson on its own.

- [Article: "Handwritten Parsers & Lexers in Go" — Ben Johnson, Gopher Academy](https://blog.gopheracademy.com/advent-2014/parsers-lexers/)
  Short, complete worked example of the two-phase lexer→parser split on a small SQL
  subset. Use for: seeing the phase boundary drawn cleanly, and the `scan`/`unscan`
  one-token-buffer trick.

- [Article: "Tmux layout checksum" — Sleep_Walker](https://sleepwalker-hnd.blogspot.com/2016/07/tmux-layout-checksum.html)
  Explains the 4-hex-digit checksum that prefixes every layout string
  (`csum = (csum >> 1) + ((csum & 1) << 15); csum += *layout;`). Use for: the
  validation/round-trip lesson, late in the arc.

- [Reference: tmux window layouts](https://www.mintlify.com/tmux/tmux/advanced/layouts)
  Plain-English description of what the layouts mean visually. Use for: sanity-checking
  that a parsed tree actually describes the pane arrangement you'd see on screen.

## Wisdom (Communities)

- [r/ProgrammingLanguages](https://reddit.com/r/ProgrammingLanguages)
  High-signal, genuinely expert, and friendly to beginners who show their work.
  Use for: "is my grammar ambiguous?", "should this be in the lexer or the parser?",
  design critique on your own DSL.

- [Crafting Interpreters community — r/craftinginterpreters](https://www.reddit.com/r/craftinginterpreters/)
  People working through the same book. Use for: getting unstuck on a specific chapter.

- [Compiler Development Discord / "Programming Language Design" servers](https://reddit.com/r/ProgrammingLanguages/wiki/index)
  Linked from the r/ProgrammingLanguages wiki sidebar. Use for: faster, chattier help
  than a forum thread.

_Community preference: not yet discussed with the user._

## Gaps

- No strong single source yet on **error recovery** strategies (panic mode,
  synchronisation points) outside of _Crafting Interpreters_ §6.3. Find one before
  the error-handling lesson.
- No good source yet on **hand-written parser performance** in JS specifically
  (charCodeAt vs. slice, avoiding intermediate strings). Search before the
  optimisation lesson, if the mission ever reaches there.
