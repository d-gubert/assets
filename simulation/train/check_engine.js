// Checks the browser engine (../engine.js) against the PyTorch reference that
// train_toy_model.py stores in ../toy-model.js.
// Usage: node simulation/train/check_engine.js
"use strict";

const path = require("path");
require(path.join(__dirname, "..", "toy-model.js"));
const engine = require(path.join(__dirname, "..", "engine.js"));

const spec = globalThis.TOY_MODEL;
const model = new engine.Model(spec);
const tok = model.tokenizer;
let failures = 0;

function check(ok, message) {
  console.log(`${ok ? "ok  " : "FAIL"}  ${message}`);
  if (!ok) failures++;
}

for (const test of spec.pretokenizer_tests) {
  const got = tok.chunks(test.text);
  check(JSON.stringify(got) === JSON.stringify(test.chunks), `pre-tokenizer: ${JSON.stringify(test.text)}`);
}

for (const ref of spec.reference) {
  const prompt = tok.encodeDialogPrompt(ref.question);
  check(JSON.stringify(prompt.ids) === JSON.stringify(ref.prompt_ids), `prompt IDs: ${ref.question}`);

  const cache = model.newCache();
  let last = null;
  for (const id of prompt.ids) last = model.forward(id, cache);
  const top = engine.topIndices(last.logits, 5);
  const maxError = Math.max(...ref.top5_ids.map((id, i) => Math.abs(last.logits[id] - ref.top5_logits[i])));
  check(JSON.stringify(top) === JSON.stringify(ref.top5_ids) && maxError < 2e-3, `top-5 logits: ${ref.question} (max error ${maxError.toExponential(1)})`);

  const run = engine.simulate(model, ref.question, { temperature: 0, maxTokens: 40 });
  const greedy = run.passes.map((p) => p.token);
  check(JSON.stringify(greedy) === JSON.stringify(ref.greedy_ids), `greedy reply: ${ref.question} -> ${JSON.stringify(run.text)}`);
}

console.log(failures ? `${failures} check(s) failed.` : "All checks passed.");
process.exit(failures ? 1 : 0);
