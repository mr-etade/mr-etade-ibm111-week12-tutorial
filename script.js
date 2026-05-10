/* ============================================================
   IBM111 — Linear Independence — Tutorial Activity (landing)
   Four interactive demos:
     1. Decision-tree wizard (which method to use)
     2. Pattern toggles (quick-spot dependence)
     3. Vector-equation step-through (Method 1 walkthrough)
     4. Live determinant calculator (Method 3, 2x2 and 3x3)
   ============================================================ */

// ===== Helpers =====
function typesetMath(node) {
  if (window.MathJax && window.MathJax.typesetPromise) {
    return window.MathJax.typesetPromise(node ? [node] : undefined).catch(() => {});
  }
  return Promise.resolve();
}

// ============================================================
// DEMO 1: DECISION-TREE WIZARD
// ============================================================
(function initDecisionTree() {
  const step1 = document.getElementById('tree-step-1');
  const step2 = document.getElementById('tree-step-2');
  const step2Q = document.getElementById('tree-q2');
  const step2Opts = document.getElementById('tree-step-2-options');
  const result = document.getElementById('tree-result');
  const resultTitle = document.getElementById('tree-result-title');
  const resultBody = document.getElementById('tree-result-body');
  const restartBtn = document.getElementById('tree-restart');

  let answers = { count: null, square: null };

  // Step 2 options depend on Step 1's answer
  const step2Configs = {
    '2': {
      question: 'What is the dimension of the vectors? (i.e. how many components does each vector have?)',
      options: [
        { value: 'r2', label: 'Vectors in $\\mathbb{R}^2$' },
        { value: 'r3', label: 'Vectors in $\\mathbb{R}^3$' },
        { value: 'higher', label: 'Vectors in $\\mathbb{R}^n$ for $n \\ge 4$' }
      ]
    },
    '3': {
      question: 'What is the dimension of the vectors?',
      options: [
        { value: 'r3', label: 'Vectors in $\\mathbb{R}^3$' },
        { value: 'r2', label: 'Vectors in $\\mathbb{R}^2$' },
        { value: 'higher', label: 'Vectors in $\\mathbb{R}^n$ for $n \\ge 4$' }
      ]
    },
    'many': {
      question: 'Are you sure? Four or more vectors is a clue in itself.',
      options: [
        { value: 'rsmaller', label: 'Yes &mdash; and the dimension is smaller than the number of vectors (e.g.\u00a04 vectors in $\\mathbb{R}^3$)' },
        { value: 'requal', label: 'Yes &mdash; and the dimension equals the number of vectors' },
        { value: 'rlarger', label: 'Yes &mdash; and the dimension is larger than the number of vectors' }
      ]
    }
  };

  // Final recommendations keyed by (count, dimension)
  const recommendations = {
    '2|r2': {
      title: 'Use the determinant (Method 3)',
      body: 'You have <strong>2 vectors in $\\mathbb{R}^2$</strong> &mdash; a square $2 \\times 2$ matrix. Build $A$ with the vectors as columns and compute $\\det(A) = ad - bc$. If $\\det(A) \\ne 0$, the set is independent; if $\\det(A) = 0$, dependent. This is the fastest possible test for this case.'
    },
    '2|r3': {
      title: 'Quick-spot first, then row reduction',
      body: 'You have <strong>2 vectors in $\\mathbb{R}^3$</strong> &mdash; the matrix is $3 \\times 2$, not square, so determinant is unavailable. First check by eye: is one vector a scalar multiple of the other? If yes, they are dependent. Otherwise, use <strong>row reduction</strong> (Method 2) and look for a free column.'
    },
    '2|higher': {
      title: 'Quick-spot first, then row reduction',
      body: 'For <strong>2 vectors in any dimension</strong>, two vectors are dependent only when one is a scalar multiple of the other. Check this by eye first. If it is not obvious, use <strong>row reduction</strong> &mdash; it is the universal tool that works for any dimension.'
    },
    '3|r3': {
      title: 'Use the determinant (Method 3)',
      body: 'You have <strong>3 vectors in $\\mathbb{R}^3$</strong> &mdash; a square $3 \\times 3$ matrix. Compute $\\det(A)$ by cofactor expansion along the simplest row. If $\\det(A) \\ne 0$, independent; if $\\det(A) = 0$, dependent. Row reduction also works and is sometimes quicker if the matrix has many zeros.'
    },
    '3|r2': {
      title: 'Instantly dependent &mdash; no calculation needed',
      body: 'You have <strong>3 vectors in $\\mathbb{R}^2$</strong>. Any set with more vectors than dimensions is automatically dependent &mdash; you cannot fit more than $n$ independent vectors in $\\mathbb{R}^n$. Just write down the conclusion: <strong>linearly dependent</strong>.'
    },
    '3|higher': {
      title: 'Use row reduction (Method 2)',
      body: 'You have <strong>3 vectors in $\\mathbb{R}^n$ with $n \\ge 4$</strong> &mdash; the matrix is non-square, so no determinant. Build the matrix with vectors as columns, row-reduce to echelon form, and count pivot columns. If every column has a pivot, independent; otherwise, dependent.'
    },
    'many|rsmaller': {
      title: 'Instantly dependent &mdash; no calculation needed',
      body: 'You have <strong>more vectors than dimensions</strong>. By the pigeonhole-style rule for vectors, any such set in $\\mathbb{R}^n$ must be dependent. Just state the conclusion: <strong>linearly dependent</strong>.'
    },
    'many|requal': {
      title: 'Use the determinant (Method 3)',
      body: 'You have a <strong>square matrix</strong>. Compute $\\det(A)$ &mdash; if non-zero, independent; if zero, dependent. For matrices larger than $3 \\times 3$, row reduction is often quicker than determinant by hand, so consider Method 2 if cofactor expansion looks painful.'
    },
    'many|rlarger': {
      title: 'Use row reduction (Method 2)',
      body: 'You have a <strong>tall non-square matrix</strong> (more rows than columns). Determinant is not defined. Row-reduce to echelon form and count pivot columns &mdash; one pivot per column means independent.'
    }
  };

  // Wire up Step 1 buttons
  step1.querySelectorAll('.tree-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      step1.querySelectorAll('.tree-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      answers.count = btn.dataset.value;
      buildStep2();
    });
  });

  function buildStep2() {
    const config = step2Configs[answers.count];
    step2Q.innerHTML = config.question;
    step2Opts.innerHTML = '';
    config.options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'tree-btn';
      b.dataset.value = opt.value;
      b.innerHTML = opt.label;
      b.addEventListener('click', () => {
        step2Opts.querySelectorAll('.tree-btn').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        answers.square = opt.value;
        showResult();
      });
      step2Opts.appendChild(b);
    });
    step1.classList.remove('tree-active');
    step2.classList.remove('tree-hidden');
    step2.classList.add('tree-active');
    result.classList.add('tree-hidden');
    typesetMath(step2);
  }

  function showResult() {
    const key = `${answers.count}|${answers.square}`;
    const rec = recommendations[key];
    if (!rec) return;
    resultTitle.innerHTML = rec.title;
    resultBody.innerHTML = rec.body;
    step2.classList.remove('tree-active');
    result.classList.remove('tree-hidden');
    typesetMath(result);
  }

  restartBtn.addEventListener('click', () => {
    answers = { count: null, square: null };
    step1.querySelectorAll('.tree-btn').forEach(b => b.classList.remove('selected'));
    step1.classList.add('tree-active');
    step2.classList.add('tree-hidden');
    step2.classList.remove('tree-active');
    result.classList.add('tree-hidden');
  });
})();

// ============================================================
// DEMO 2: PATTERN TOGGLES (quick-spot dependence)
// ============================================================
(function initPatterns() {
  document.querySelectorAll('.pattern-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('pattern-revealed');
    });
  });
})();

// ============================================================
// DEMO 3: VECTOR-EQUATION STEP-THROUGH
// ============================================================
(function initVectorEquationSteps() {
  const display = document.getElementById('step-display');
  const progress = document.getElementById('step-progress');
  const prevBtn = document.getElementById('step-prev');
  const nextBtn = document.getElementById('step-next');
  const resetBtn = document.getElementById('step-reset');

  const steps = [
    {
      eyebrow: 'Step 1',
      title: 'Set up the vector equation',
      body: 'We test independence by writing the only equation that defines it &mdash; a linear combination of the vectors that equals the zero vector.',
      math: '$$ c_1 \\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix} + c_2 \\begin{bmatrix} 3 \\\\ 5 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix} $$',
      final: false
    },
    {
      eyebrow: 'Step 2',
      title: 'Convert to a system of equations',
      body: 'Equate components: the top component of the left side must equal $0$, and the bottom component must equal $0$. This produces two equations in two unknowns.',
      math: '$$ \\begin{cases} c_1 + 3c_2 = 0 \\\\ 2c_1 + 5c_2 = 0 \\end{cases} $$',
      final: false
    },
    {
      eyebrow: 'Step 3',
      title: 'Solve for the coefficients',
      body: 'From equation 1, $c_1 = -3c_2$. Substitute into equation 2: $2(-3c_2) + 5c_2 = 0$, so $-6c_2 + 5c_2 = 0$, giving $-c_2 = 0$.',
      math: '$$ c_2 = 0 \\quad\\Longrightarrow\\quad c_1 = -3(0) = 0 $$',
      final: false
    },
    {
      eyebrow: 'Step 4',
      title: 'Examine the solution',
      body: 'The only solution is $c_1 = c_2 = 0$ &mdash; the trivial solution. There is no non-trivial way to combine the vectors and get $\\vec{0}$.',
      math: '$$ \\text{Only solution: } c_1 = 0,\\ c_2 = 0 $$',
      final: false
    },
    {
      eyebrow: 'Conclusion',
      title: 'The set is linearly independent',
      body: 'Because the only solution to $c_1 \\vec{v}_1 + c_2 \\vec{v}_2 = \\vec{0}$ is the trivial one, the vectors $\\vec{v}_1 = \\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix}$ and $\\vec{v}_2 = \\begin{bmatrix} 3 \\\\ 5 \\end{bmatrix}$ are <strong>linearly independent</strong>. Each adds new, irreducible information.',
      math: '$$ \\{\\vec{v}_1, \\vec{v}_2\\} \\text{ is linearly independent} \\;\\checkmark $$',
      final: true
    }
  ];

  let idx = 0;

  function render() {
    const step = steps[idx];
    display.classList.toggle('step-final', !!step.final);
    display.innerHTML = `
      <span class="step-eyebrow">${step.eyebrow}</span>
      <h3 class="step-title">${step.title}</h3>
      <div class="step-body">${step.body}</div>
      <div class="step-math">${step.math}</div>
    `;
    progress.textContent = `Step ${idx + 1} of ${steps.length}`;
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === steps.length - 1;
    typesetMath(display);
  }

  prevBtn.addEventListener('click', () => { if (idx > 0) { idx--; render(); } });
  nextBtn.addEventListener('click', () => { if (idx < steps.length - 1) { idx++; render(); } });
  resetBtn.addEventListener('click', () => { idx = 0; render(); });

  render();
})();

// ============================================================
// DEMO 4: LIVE DETERMINANT CALCULATOR
// ============================================================
(function initDetCalculator() {
  const grid = document.getElementById('det-grid');
  const presetsWrap = document.getElementById('det-presets');
  const formulaEl = document.getElementById('det-formula');
  const valueEl = document.getElementById('det-value');
  const verdictEl = document.getElementById('det-verdict');
  const sizeBtns = document.querySelectorAll('.det-size-btn');

  let size = 2;
  // entries stored as 2D array; we keep a 3x3 buffer and use top-left 2x2 when size=2
  let entries = [
    [1, 3, 0],
    [2, 5, 0],
    [0, 0, 1]
  ];

  // Presets keyed by size
  const presets = {
    2: [
      { label: 'Independent', cells: [[1, 3], [2, 5]] },
      { label: 'Dependent (parallel)', cells: [[1, 2], [2, 4]] },
      { label: 'Standard basis', cells: [[1, 0], [0, 1]] }
    ],
    3: [
      { label: 'Independent', cells: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] },
      { label: 'Dependent (col 2 = 2 \u00d7 col 1)', cells: [[1, 2, 1], [2, 4, 0], [3, 6, 1]] },
      { label: 'Mixed', cells: [[1, 2, 0], [0, 1, -1], [2, 3, 1]] }
    ]
  };

  function buildGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < size; i++) {
      const row = document.createElement('div');
      row.className = 'det-grid-row';
      for (let j = 0; j < size; j++) {
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'det-grid-input';
        inp.value = String(entries[i][j]);
        inp.dataset.i = i;
        inp.dataset.j = j;
        inp.addEventListener('input', onCellInput);
        inp.addEventListener('focus', () => inp.select());
        row.appendChild(inp);
      }
      grid.appendChild(row);
    }
  }

  function buildPresets() {
    presetsWrap.innerHTML = '';
    presets[size].forEach((p, k) => {
      const b = document.createElement('button');
      b.className = 'preset-btn';
      b.innerHTML = p.label;
      b.addEventListener('click', () => {
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            entries[i][j] = p.cells[i][j];
          }
        }
        buildGrid();
        compute();
      });
      presetsWrap.appendChild(b);
    });
  }

  function onCellInput(e) {
    const i = parseInt(e.target.dataset.i, 10);
    const j = parseInt(e.target.dataset.j, 10);
    const raw = e.target.value.trim();
    const v = raw === '' || raw === '-' ? 0 : parseFloat(raw);
    if (!isNaN(v)) {
      entries[i][j] = v;
      compute();
    }
  }

  // Format a number for display: integers show as integers, decimals to 2 places
  function fmt(n) {
    if (Math.abs(n - Math.round(n)) < 1e-9) return String(Math.round(n));
    return n.toFixed(2);
  }

  // Format a signed term for inclusion in a formula like "+ 5" or "- 3"
  function signed(n) {
    if (n >= 0) return `+ ${fmt(n)}`;
    return `- ${fmt(-n)}`;
  }

  function compute() {
    let det, formula;

    if (size === 2) {
      const [[a, b], [c, d]] = [
        [entries[0][0], entries[0][1]],
        [entries[1][0], entries[1][1]]
      ];
      det = a * d - b * c;
      formula = `$\\det(A) = (${fmt(a)})(${fmt(d)}) - (${fmt(b)})(${fmt(c)}) = ${fmt(a*d)} ${signed(-b*c)}$`;
    } else {
      // 3x3 cofactor expansion along row 1
      const [a11, a12, a13] = entries[0];
      const [a21, a22, a23] = entries[1];
      const [a31, a32, a33] = entries[2];
      const m11 = a22 * a33 - a23 * a32;
      const m12 = a21 * a33 - a23 * a31;
      const m13 = a21 * a32 - a22 * a31;
      det = a11 * m11 - a12 * m12 + a13 * m13;
      formula = `$\\det(A) = ${fmt(a11)}(${fmt(m11)}) ${signed(-a12 * m12)} ${signed(a13 * m13)}$`;
    }

    formulaEl.innerHTML = formula;
    valueEl.innerHTML = `$\\det(A) = ${fmt(det)}$`;

    verdictEl.classList.remove('dependent', 'independent', 'neutral');
    if (Math.abs(det) < 1e-9) {
      verdictEl.classList.add('dependent');
      verdictEl.textContent = 'Linearly dependent';
    } else {
      verdictEl.classList.add('independent');
      verdictEl.textContent = 'Linearly independent';
    }

    typesetMath(formulaEl.parentElement);
  }

  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      size = parseInt(btn.dataset.size, 10);
      // load a clean default for the new size from the first preset
      const def = presets[size][0].cells;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          entries[i][j] = def[i][j];
        }
      }
      buildGrid();
      buildPresets();
      compute();
    });
  });

  // Initial render
  buildGrid();
  buildPresets();
  compute();
})();
