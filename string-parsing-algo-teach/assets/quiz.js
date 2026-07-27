/* ============================================================================
   quiz.js — reusable retrieval-practice widget.

   Markup contract:

     <div class="quiz" data-quiz>
       <p class="quiz-q">Question text?</p>
       <ul class="quiz-options">
         <li data-correct data-why="Explanation shown on answer.">Right answer</li>
         <li data-why="Why this is wrong.">Wrong answer</li>
       </ul>
     </div>

   Options are shuffled on load (so re-reading a lesson is still retrieval, not
   position recall). One attempt is scored; after answering, every option reveals
   its explanation. Classic script — works from file://.
   ========================================================================= */
(function () {
  'use strict';

  function shuffle(nodes) {
    for (var i = nodes.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      nodes[i].parentNode.insertBefore(nodes[i], nodes[j]);
    }
  }

  function initQuiz(quiz) {
    var list = quiz.querySelector('.quiz-options');
    if (!list) return;

    var options = Array.prototype.slice.call(list.children);
    shuffle(options);

    var status = document.createElement('p');
    status.className = 'quiz-status';
    quiz.appendChild(status);

    var answered = false;

    options.forEach(function (opt) {
      opt.setAttribute('tabindex', '0');
      opt.setAttribute('role', 'button');

      function choose() {
        if (answered) return;
        answered = true;

        var right = opt.hasAttribute('data-correct');
        quiz.classList.add('answered');
        status.textContent = right
          ? 'Correct.'
          : 'Not quite — read the notes below, then say it back in your own words.';
        status.className = 'quiz-status ' + (right ? 'is-good' : 'is-bad');

        options.forEach(function (o) {
          o.classList.add(o.hasAttribute('data-correct') ? 'is-correct' : 'is-wrong');
          if (o === opt) o.classList.add('is-chosen');
          var why = o.getAttribute('data-why');
          if (why) {
            var note = document.createElement('span');
            note.className = 'quiz-why';
            note.textContent = why;
            o.appendChild(note);
          }
        });
      }

      opt.addEventListener('click', choose);
      opt.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); }
      });
    });
  }

  function boot() {
    var quizzes = document.querySelectorAll('[data-quiz]');
    Array.prototype.forEach.call(quizzes, initQuiz);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
