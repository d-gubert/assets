# Mission: String Parsing Algorithms (hand-written, no libraries, no regex)

## Why

Douglas keeps hitting gnarly real-world string formats — starting with tmux's
`list-windows` output — and wants to stop reaching for fragile `split()` chains
and regex. The goal is to hand-write parsers that consume input token by token,
so that a format like a tmux layout tree (which is genuinely recursive and
genuinely ambiguous) becomes something he can parse correctly, report good errors
on, and eventually design himself.

The concrete north star:

```
1: Tab #1* (3 panes) [382x99] [layout 66e3,382x99,0,0{127x99,0,0,0,127x99,128,0,2,126x99,256,0,1}] @0 (active)
```

…parsed into a structured object, with a nested pane tree, by code he wrote from
first principles.

## Success looks like

- Parse the full tmux `list-windows` line above into a typed structure, including
  the recursive layout tree, with zero libraries and zero regex.
- Explain out loud why `split()` fails on that string, and name the exact
  property of the grammar that breaks it.
- Hand-write a tokenizer and a recursive-descent parser as two separate phases,
  and say when collapsing them into one pass is the right call.
- Handle the tmux layout's real lookahead ambiguity (is that number a pane id, or
  the width of the next sibling cell?) with deliberate backtracking.
- Produce parse errors that point at a column and say what was expected.
- Write an EBNF grammar for a format, then mechanically turn it into code.
- Design and parse a small DSL of his own.

## Constraints

- **TypeScript / JavaScript** for all lesson code and exercises, so lessons can
  run parsers live in the browser with instant feedback.
- Starting point: has written ad-hoc `split()` / `indexOf()` / regex parsers that
  "always felt fragile". Comfortable programmer; new to formal parsing structure.
- Lessons must be short and completable in one sitting.
- No libraries, no regex, in exercise solutions. That constraint is the point.

## Out of scope (for now)

- Parser generators (yacc, ANTLR, tree-sitter, nearley) — the mission is the
  hand-written path.
- Parser combinator libraries.
- Full compiler back-ends: type checking, IR, codegen. Parsing only.
- Unicode/grapheme-level edge cases beyond what the tmux format demands.
