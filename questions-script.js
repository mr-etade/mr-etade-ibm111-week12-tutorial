/* ============================================================
   IBM111 — Linear Independence — Tutorial Questions
   Answer validation + instant feedback for 10 questions.
   Patterns mirrored from the Linear Combinations tutorial.
   ============================================================ */

// ===== Answer parsing — accept fractions, decimals, signed numbers =====
function parseAnswer(input) {
  if (input === null || input === undefined) return NaN;
  const s = String(input).trim();
  if (s === '') return NaN;
  if (s.includes('/')) {
    const parts = s.split('/');
    if (parts.length !== 2) return NaN;
    const num = parseFloat(parts[0]);
    const den = parseFloat(parts[1]);
    if (isNaN(num) || isNaN(den) || den === 0) return NaN;
    return num / den;
  }
  return parseFloat(s);
}

function approxEqual(a, b, tol = 0.01) {
  if (isNaN(a) || isNaN(b)) return false;
  return Math.abs(a - b) < tol;
}

// ===== Question state =====
const questionState = {};
const TOTAL_QUESTIONS = 10;

function markComplete(qid) {
  questionState[qid] = true;
  updateProgress();
}

function updateProgress() {
  const done = Object.keys(questionState).filter(k => questionState[k]).length;
  document.getElementById('progress-text').textContent = `${done} / ${TOTAL_QUESTIONS} questions`;
  document.getElementById('progress-fill').style.width = `${(done / TOTAL_QUESTIONS) * 100}%`;

  if (done === TOTAL_QUESTIONS) {
    const card = document.getElementById('completion-card');
    card.hidden = false;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('completion-score').textContent =
      `All ${TOTAL_QUESTIONS} questions answered correctly`;
  }
}

// ===== Feedback display =====
function showFeedback(qid, type, html) {
  const fb = document.getElementById(`fb-${qid}`);
  fb.classList.remove('fb-correct', 'fb-incorrect', 'fb-partial');
  fb.classList.add(`fb-${type}`);
  fb.innerHTML = html;
  fb.classList.add('visible');
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([fb]).catch(() => {});
  }
}

// ============================================================
// MULTIPLE CHOICE QUESTIONS
// ============================================================
const choiceAnswers = {
  q1: {
    correct: 'b',
    feedback: {
      correct: '<strong>Correct.</strong> Independence means $c_1\\vec{v}_1 + \\cdots + c_n\\vec{v}_n = \\vec{0}$ has <em>only</em> the trivial solution. If any non-trivial combination produces $\\vec{0}$, the set is dependent instead.',
      incorrect: '<strong>Reconsider.</strong> Independence is defined by what the equation $c_1\\vec{v}_1 + \\cdots + c_n\\vec{v}_n = \\vec{0}$ allows: the <em>only</em> way it can hold must be $c_1 = c_2 = \\cdots = c_n = 0$. Length and direction are not part of the definition.'
    }
  },
  q2: {
    correct: 'b',
    feedback: {
      correct: '<strong>Correct.</strong> Whenever the zero vector appears in a set, you can take its coefficient to be $1$ and all others $0$ &mdash; the resulting combination is $\\vec{0}$ but the coefficients are not all zero. That is the definition of dependence.',
      incorrect: '<strong>Reconsider.</strong> Look for the quickest, most obvious feature. The first vector is $\\vec{0}$. What does that let you do with the coefficients? Try $c_1 = 1$ and the rest $0$.'
    }
  },
  q4: {
    correct: 'b',
    feedback: {
      correct: '<strong>Correct.</strong> Question&nbsp;3 gave $\\det(A) = 5 \\ne 0$. The rule is: $\\det(A) \\ne 0 \\Rightarrow$ independent; $\\det(A) = 0 \\Rightarrow$ dependent. So the set is <strong>linearly independent</strong>.',
      incorrect: '<strong>Not quite.</strong> Recall the rule for square matrices: a non-zero determinant means the columns are independent; a zero determinant means dependent. Your answer to Question&nbsp;3 was $\\det(A) = 5$. Apply the rule.'
    }
  },
  q7: {
    correct: 'b',
    feedback: {
      correct: '<strong>Correct.</strong> A pivot is the leading non-zero entry of a row. Row 1 has pivot in column 1, row 2 has pivot in column 3 (the $-2$). Column 2 has no pivot &mdash; it is a free variable, meaning the equation $A\\vec{c} = \\vec{0}$ has non-trivial solutions. <strong>Dependent.</strong>',
      incorrect: '<strong>Reconsider.</strong> Read across each row from left to right and locate the first non-zero entry. Row 1 leads with $1$ in column 1. Row 2 leads with $-2$ in column 3. Row 3 is all zeros. So columns 1 and 3 are pivot columns; column 2 has no pivot &mdash; making it a free variable.'
    }
  },
  q8: {
    correct: 'b',
    feedback: {
      correct: '<strong>Correct.</strong> Four vectors in $\\mathbb{R}^4$ form a square $4 \\times 4$ matrix &mdash; perfect for the determinant. (The rule "more vectors than dimensions" only triggers when the count <em>exceeds</em> the dimension, not when they match.)',
      incorrect: '<strong>Reconsider.</strong> Count the vectors and the dimension: $4$ vectors in $\\mathbb{R}^4$. Is the matrix square? Does the "too many vectors" rule apply when they exactly match? Determinants <em>are</em> defined for any square matrix.'
    }
  },
  q10: {
    correct: 'b',
    feedback: {
      correct: '<strong>Correct.</strong> Always scan for quick patterns first. Notice $\\vec{m}_2 = 2\\vec{m}_1$ &mdash; the second metric is just double the first. Whenever one vector is a scalar multiple of another, the whole set is dependent, regardless of what the other vectors look like.',
      incorrect: '<strong>Look more closely at the first two vectors.</strong> Compare $\\vec{m}_1$ and $\\vec{m}_2$ component-by-component. Is $\\vec{m}_2$ just a scalar multiple of $\\vec{m}_1$? If so, the whole set is dependent &mdash; no determinant needed.'
    }
  }
};

document.querySelectorAll('.choice-group').forEach(group => {
  const qid = group.dataset.q;
  group.querySelectorAll('.choice').forEach(btn => {
    btn.addEventListener('click', () => {
      if (questionState[qid]) return;
      const val = btn.dataset.val;
      const config = choiceAnswers[qid];
      const isCorrect = val === config.correct;

      group.querySelectorAll('.choice').forEach(b => {
        b.classList.remove('selected', 'correct', 'incorrect');
      });

      if (isCorrect) {
        btn.classList.add('correct');
        group.querySelectorAll('.choice').forEach(b => b.disabled = true);
        showFeedback(qid, 'correct', config.feedback.correct);
        markComplete(qid);
      } else {
        btn.classList.add('incorrect');
        showFeedback(qid, 'incorrect', config.feedback.incorrect);
      }
    });
  });
});

// ============================================================
// CELL-INPUT QUESTIONS
// ============================================================
const cellAnswers = {
  q3: {
    cells: { 'det': 5 },
    correctMsg: '<strong>Correct!</strong> $\\det(A) = (4)(2) - (3)(1) = 8 - 3 = 5.$',
    hintMsg: '<strong>Check the formula.</strong> For $A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$, the determinant is $ad - bc.$ Here $a = 4, b = 3, c = 1, d = 2.$ Compute $(4)(2) - (3)(1).$'
  },
  q5: {
    cells: { 'det': 0 },
    correctMsg: '<strong>Correct!</strong> Cofactor expansion along row 1: $\\det(A) = 1\\,(1 \\cdot 1 - (-1) \\cdot 3) - 2\\,(0 \\cdot 1 - (-1) \\cdot 2) + 0 = 1(4) - 2(2) + 0 = 0.$ Since $\\det(A) = 0$, the columns are <strong>linearly dependent</strong>.',
    hintMsg: '<strong>Work the expansion carefully.</strong> $\\det(A) = a_{11} M_{11} - a_{12} M_{12} + a_{13} M_{13},$ where each $M_{1j}$ is the determinant of the $2 \\times 2$ minor obtained by deleting row 1 and column $j$. Here $a_{11} = 1, a_{12} = 2, a_{13} = 0.$ Compute $M_{11} = \\det\\!\\begin{bmatrix} 1 & -1 \\\\ 3 & 1 \\end{bmatrix}$ and $M_{12} = \\det\\!\\begin{bmatrix} 0 & -1 \\\\ 2 & 1 \\end{bmatrix}.$'
  },
  q6: {
    cells: { 'c1': 0, 'c2': 0 },
    correctMsg: '<strong>Correct!</strong> The system is $\\begin{cases} 2c_1 + c_2 = 0 \\\\ c_1 + 4c_2 = 0 \\end{cases}.$ From the first equation, $c_2 = -2c_1.$ Substituting: $c_1 + 4(-2c_1) = -7c_1 = 0,$ so $c_1 = 0,\\ c_2 = 0.$ Only the trivial solution exists, so the set is <strong>linearly independent</strong>.',
    hintMsg: '<strong>Solve the system.</strong> The equation $c_1\\vec{v}_1 + c_2\\vec{v}_2 = \\vec{0}$ gives $\\begin{cases} 2c_1 + c_2 = 0 \\\\ c_1 + 4c_2 = 0 \\end{cases}.$ The vectors are not parallel, so you should find that the only solution is the trivial one. What are the values of $c_1$ and $c_2$?'
  },
  q9: {
    cells: { 'k': 2 },
    correctMsg: '<strong>Correct!</strong> The vectors are dependent precisely when $\\det\\!\\begin{bmatrix} 3 & 6 \\\\ 1 & k \\end{bmatrix} = 3k - 6 = 0,$ giving $k = 2.$ At $k = 2,$ we have $\\vec{r}_2 = 2\\vec{r}_1$ &mdash; the two reference vectors collapse onto the same line and the navigation system fails.',
    hintMsg: '<strong>Use the determinant.</strong> Two vectors in $\\mathbb{R}^2$ are dependent exactly when $\\det\\!\\begin{bmatrix} 3 & 6 \\\\ 1 & k \\end{bmatrix} = 0.$ Compute $3k - 6$ and set it equal to zero. Solve for $k$.'
  }
};

// ============================================================
// CHECK BUTTON HANDLERS
// ============================================================
document.querySelectorAll('.check-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const qid = btn.dataset.check;
    if (questionState[qid]) return;
    const config = cellAnswers[qid];
    const inputs = document.querySelectorAll(`.cell-input[data-q="${qid}"]`);

    let allCorrect = true;
    let anyEmpty = false;

    inputs.forEach(inp => {
      inp.classList.remove('cell-correct', 'cell-incorrect');
      const expected = config.cells[inp.dataset.cell];
      const got = parseAnswer(inp.value);

      if (isNaN(got)) {
        anyEmpty = true;
        allCorrect = false;
        return;
      }

      if (approxEqual(got, expected)) {
        inp.classList.add('cell-correct');
      } else {
        inp.classList.add('cell-incorrect');
        allCorrect = false;
      }
    });

    if (anyEmpty && !allCorrect) {
      showFeedback(qid, 'partial',
        '<strong>Fill in every entry</strong> before checking. Use fractions like <code>5/3</code> or decimals like <code>1.67</code>.');
      return;
    }

    if (allCorrect) {
      inputs.forEach(inp => inp.disabled = true);
      btn.disabled = true;
      showFeedback(qid, 'correct', config.correctMsg);
      markComplete(qid);
    } else {
      showFeedback(qid, 'incorrect', config.hintMsg);
    }
  });
});

// ===== Allow Enter key to trigger Check Answer =====
document.querySelectorAll('.cell-input').forEach(inp => {
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const qid = inp.dataset.q;
      const checkBtn = document.querySelector(`.check-btn[data-check="${qid}"]`);
      if (checkBtn && !checkBtn.disabled) checkBtn.click();
    }
  });
});
