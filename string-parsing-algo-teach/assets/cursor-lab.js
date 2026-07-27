/* ============================================================================
   cursor-lab.js — a hand-driven cursor over a string.

   The learner presses peek() / advance() / atEnd() and watches the position move.
   The point is to make the peek-vs-advance distinction physical: peek returns a
   character and the marker does NOT move; advance returns a character and it does.

   Markup contract:

     <div data-cursor-lab data-input="382x99"></div>

   Optional: data-label="…" puts a caption above the tape.

   Classic script, works from file://.
   ========================================================================= */
(function () {
  'use strict';

  /* Inputs in this workspace contain {, }, [, ], # and friends — escape before
     touching innerHTML so a future lesson with a '<' does not break the tape.
     Written as a character scan rather than a regex, because this workspace
     does not use regex. Yes, that includes the tooling. */
  var ENTITY = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
  function esc(s) {
    s = String(s);
    var out = '';
    for (var i = 0; i < s.length; i++) {
      out += ENTITY[s[i]] || s[i];
    }
    return out;
  }

  function initLab(root) {
    var src = root.getAttribute('data-input') || '';
    var label = root.getAttribute('data-label') || '';
    var pos = 0;

    root.classList.add('cursor-lab');
    root.innerHTML = '';

    if (label) {
      var cap = document.createElement('div');
      cap.className = 'lab-label';
      cap.textContent = label;
      root.appendChild(cap);
    }

    var tape = document.createElement('div');
    tape.className = 'lab-tape';
    root.appendChild(tape);

    var cells = [];
    for (var i = 0; i < src.length; i++) {
      var cell = document.createElement('span');
      cell.className = 'lab-cell';
      cell.innerHTML = '<span class="lab-ch">' + (src[i] === ' ' ? '&middot;' : esc(src[i]))
        + '</span><span class="lab-idx">' + i + '</span>';
      tape.appendChild(cell);
      cells.push(cell);
    }
    var endCell = document.createElement('span');
    endCell.className = 'lab-cell lab-end';
    endCell.innerHTML = '<span class="lab-ch">⏾</span><span class="lab-idx">'
      + src.length + '</span>';
    tape.appendChild(endCell);
    cells.push(endCell);

    var bar = document.createElement('div');
    bar.className = 'lab-controls no-print';
    root.appendChild(bar);

    var log = document.createElement('div');
    log.className = 'lab-log';
    root.appendChild(log);

    function render() {
      cells.forEach(function (c, idx) {
        c.classList.toggle('is-consumed', idx < pos);
        c.classList.toggle('is-current', idx === pos);
      });
    }

    function say(call, result, moved) {
      var row = document.createElement('div');
      row.className = 'lab-row';
      row.innerHTML = '<code>' + esc(call) + '</code>'
        + '<span class="lab-arrow">→</span>'
        + '<span class="lab-val">' + esc(result) + '</span>'
        + '<span class="lab-pos">' + (moved ? 'pos moved to ' : 'pos still ') + pos + '</span>';
      log.insertBefore(row, log.firstChild);
      while (log.children.length > 6) log.removeChild(log.lastChild);
    }

    function chAt(i) {
      return i < src.length ? JSON.stringify(src[i]) : '"\\0"  (past the end)';
    }

    function mkBtn(text, cls, fn) {
      var b = document.createElement('button');
      b.textContent = text;
      if (cls) b.className = cls;
      b.addEventListener('click', fn);
      bar.appendChild(b);
      return b;
    }

    mkBtn('peek()', '', function () {
      say('peek()', chAt(pos), false);
      render();
    });

    mkBtn('advance()', '', function () {
      if (pos >= src.length) { say('advance()', 'nothing left to consume', false); return; }
      var c = chAt(pos);
      pos++;
      say('advance()', c, true);
      render();
    });

    mkBtn('atEnd()', 'ghost', function () {
      say('atEnd()', pos >= src.length ? 'true' : 'false', false);
      render();
    });

    mkBtn('reset', 'ghost', function () {
      pos = 0;
      log.innerHTML = '';
      render();
    });

    render();
  }

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-cursor-lab]'), initLab);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
