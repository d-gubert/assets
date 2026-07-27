/* ============================================================================
   exercise.js — in-page code exercise with an automatic test harness.

   Markup contract:

     <div class="exercise" data-exercise data-fn="parseDims" data-key="l1-dims">
       <textarea class="ex-code" spellcheck="false">function parseDims(s) {
       }</textarea>
       <script type="application/json" class="ex-tests">
         [ {"args": ["382x99"], "expect": {"w": 382, "h": 99}} ]
       </script>
       <div class="ex-solution" hidden><pre><code>...</code></pre></div>
     </div>

   - data-fn   : name of the function the learner must define.
   - data-key  : optional localStorage key so work survives a page reload.
   - Each test may also carry "note" (shown in the result row) and "throws": true
     (the call is expected to throw; "expect" is then matched against the message).
   - A `banned` attribute (data-banned="split,match") fails the run if the source
     mentions those identifiers — this workspace forbids regex and split().

   Classic script, no build step, works from file://.
   ========================================================================= */
(function () {
  'use strict';

  /* ------------------------------------------------------------- helpers - */

  /* Character scan, not a regex — this workspace does not use regex anywhere. */
  var ENTITY = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
  function esc(s) {
    s = String(s);
    var out = '';
    for (var i = 0; i < s.length; i++) out += ENTITY[s[i]] || s[i];
    return out;
  }

  function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a === null || b === null) return false;
    if (typeof a !== 'object') return Number.isNaN(a) && Number.isNaN(b);
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    var ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every(function (k) {
      return Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]);
    });
  }

  function show(v) {
    if (typeof v === 'string') return JSON.stringify(v);
    if (v === undefined) return 'undefined';
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  }

  function store(key, value) {
    if (!key) return;
    try { localStorage.setItem('spat:' + key, value); } catch (e) { /* file:// */ }
  }

  function load(key) {
    if (!key) return null;
    try { return localStorage.getItem('spat:' + key); } catch (e) { return null; }
  }

  /* ---------------------------------------------------------------- run - */

  function run(ex, code, tests, fnName, banned) {
    var out = ex.querySelector('.ex-out');
    out.innerHTML = '';
    ex.classList.remove('is-pass', 'is-fail');

    for (var i = 0; i < banned.length; i++) {
      var word = banned[i].trim();
      if (word && code.indexOf(word) !== -1) {
        ex.classList.add('is-fail');
        out.innerHTML = '<div class="ex-row is-bad">Blocked: this exercise forbids <code>'
          + esc(word) + '</code>. That is the whole point — consume the string yourself.</div>';
        return;
      }
    }

    var fn;
    try {
      /* jshint evil:true */
      fn = new Function('"use strict";\n' + code + '\nreturn typeof ' + fnName
        + ' === "function" ? ' + fnName + ' : null;')();
    } catch (err) {
      ex.classList.add('is-fail');
      out.innerHTML = '<div class="ex-row is-bad">Syntax error: ' + esc(err.message) + '</div>';
      return;
    }

    if (!fn) {
      ex.classList.add('is-fail');
      out.innerHTML = '<div class="ex-row is-bad">No function named <code>' + fnName
        + '</code> was defined.</div>';
      return;
    }

    var passed = 0;
    tests.forEach(function (t) {
      var row = document.createElement('div');
      row.className = 'ex-row';
      var call = fnName + '(' + t.args.map(show).join(', ') + ')';
      var ok, detail;

      try {
        var got = fn.apply(null, t.args.map(function (a) {
          return (a && typeof a === 'object') ? JSON.parse(JSON.stringify(a)) : a;
        }));
        if (t.throws) {
          ok = false;
          detail = 'expected it to throw, but it returned ' + show(got);
        } else {
          ok = deepEqual(got, t.expect);
          detail = ok ? show(got) : 'got ' + show(got) + ', expected ' + show(t.expect);
        }
      } catch (err) {
        if (t.throws) {
          ok = t.expect === undefined || String(err.message).indexOf(t.expect) !== -1;
          detail = ok ? 'threw: ' + err.message
                      : 'threw: ' + err.message + ' — expected message containing ' + show(t.expect);
        } else {
          ok = false;
          detail = 'threw ' + String(err.message);
        }
      }

      if (ok) passed++;
      row.className = 'ex-row ' + (ok ? 'is-good' : 'is-bad');
      row.innerHTML = '<span class="ex-mark">' + (ok ? '✓' : '✗') + '</span>'
        + '<code>' + esc(call) + '</code> <span class="ex-detail">' + esc(detail) + '</span>'
        + (t.note ? '<span class="ex-note">' + t.note + '</span>' : '');
      out.appendChild(row);
    });

    var summary = document.createElement('div');
    var all = passed === tests.length;
    summary.className = 'ex-summary ' + (all ? 'is-good' : 'is-bad');
    summary.textContent = passed + ' / ' + tests.length + ' passing'
      + (all ? '  —  that is the win. Move on.' : '');
    out.appendChild(summary);
    ex.classList.add(all ? 'is-pass' : 'is-fail');
  }

  /* --------------------------------------------------------------- init - */

  function initExercise(ex) {
    var area   = ex.querySelector('.ex-code');
    var specEl = ex.querySelector('.ex-tests');
    var solEl  = ex.querySelector('.ex-solution');
    var fnName = ex.getAttribute('data-fn');
    var key    = ex.getAttribute('data-key');
    var banned = (ex.getAttribute('data-banned') || '').split(',').filter(Boolean);
    if (!area || !specEl || !fnName) return;

    var tests;
    try { tests = JSON.parse(specEl.textContent); }
    catch (e) { console.error('bad ex-tests JSON', e); return; }

    var starter = area.value;
    var saved = load(key);
    if (saved !== null) area.value = saved;

    /* Tab inserts two spaces rather than moving focus. */
    area.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var s = area.selectionStart, t = area.selectionEnd;
        area.value = area.value.slice(0, s) + '  ' + area.value.slice(t);
        area.selectionStart = area.selectionEnd = s + 2;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); doRun(); }
    });
    area.addEventListener('input', function () { store(key, area.value); });

    var bar = document.createElement('div');
    bar.className = 'ex-controls no-print';

    var runBtn = document.createElement('button');
    runBtn.textContent = 'Run tests';
    bar.appendChild(runBtn);

    var resetBtn = document.createElement('button');
    resetBtn.className = 'ghost';
    resetBtn.textContent = 'Reset';
    bar.appendChild(resetBtn);

    if (solEl) {
      var solBtn = document.createElement('button');
      solBtn.className = 'ghost';
      solBtn.textContent = 'Show solution';
      solBtn.addEventListener('click', function () {
        var hidden = solEl.hasAttribute('hidden');
        if (hidden) solEl.removeAttribute('hidden'); else solEl.setAttribute('hidden', '');
        solBtn.textContent = hidden ? 'Hide solution' : 'Show solution';
      });
      bar.appendChild(solBtn);
    }

    var hint = document.createElement('span');
    hint.className = 'ex-hint';
    hint.textContent = 'Ctrl/Cmd + Enter runs';
    bar.appendChild(hint);

    var out = document.createElement('div');
    out.className = 'ex-out';

    ex.insertBefore(bar, solEl || null);
    ex.insertBefore(out, solEl || null);

    function doRun() { run(ex, area.value, tests, fnName, banned); }

    runBtn.addEventListener('click', doRun);
    resetBtn.addEventListener('click', function () {
      area.value = starter;
      store(key, starter);
      out.innerHTML = '';
      ex.classList.remove('is-pass', 'is-fail');
    });
  }

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-exercise]'), initExercise);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
