(() => {
  'use strict';

  const STORAGE_KEY = 'questionEditor.jsonOptions.v1';
  const DEFAULT_JSON_OPTIONS = ['quiz-data_rekishi3.json'];
  const COLUMNS = ['id', 'era', 'question', 'image', 'imageAlt', 'answer', 'wrong1', 'wrong2', 'wrong3', 'explanation'];

  const state = {
    rows: [],
    selectedIndex: -1,
    sourceLabel: '未読込',
    jsonOptions: [],
  };

  const el = {
    importFile: document.getElementById('import-file'),
    addRow: document.getElementById('add-row'),
    validate: document.getElementById('validate-data'),
    normalizeIds: document.getElementById('normalize-ids'),
    exportJson: document.getElementById('export-json'),
    exportExcel: document.getElementById('export-excel'),
    exportCsv: document.getElementById('export-csv'),
    copyJson: document.getElementById('copy-json'),
    downloadTemplate: document.getElementById('download-template'),
    downloadCsvTemplate: document.getElementById('download-csv-template'),
    editorBody: document.getElementById('editor-body'),
    previewArea: document.getElementById('preview-area'),
    jsonOutput: document.getElementById('json-output'),
    validationOutput: document.getElementById('validation-output'),
    questionCount: document.getElementById('question-count'),
    sourceLabel: document.getElementById('source-label'),
    targetLabel: document.getElementById('target-label'),
    statusMessage: document.getElementById('status-message'),
    targetSelect: document.getElementById('target-json-file'),
    addJsonOption: document.getElementById('add-json-option'),
    removeJsonOption: document.getElementById('remove-json-option'),
    resetJsonOptions: document.getElementById('reset-json-options'),
  };

  const showStatus = (message) => { el.statusMessage.textContent = message; };
  const sanitizeRow = (row = {}) => Object.fromEntries(COLUMNS.map((k) => [k, String(row[k] ?? '').trim()]));

  const normalizeInputRows = (rows) => rows.map((row) => {
    const base = sanitizeRow(row);
    const wrongChoices = Array.isArray(row.wrongChoices) ? row.wrongChoices : [];
    if (!base.wrong1 && wrongChoices[0]) base.wrong1 = String(wrongChoices[0]);
    if (!base.wrong2 && wrongChoices[1]) base.wrong2 = String(wrongChoices[1]);
    if (!base.wrong3 && wrongChoices[2]) base.wrong3 = String(wrongChoices[2]);
    return base;
  });

  const toExportRows = () => state.rows.map((r) => ({
    id: r.id,
    era: r.era,
    question: r.question,
    image: r.image,
    imageAlt: r.imageAlt,
    answer: r.answer,
    wrongChoices: [r.wrong1, r.wrong2, r.wrong3].filter(Boolean),
    explanation: r.explanation,
  }));

  const createInputCell = (value, onInput) => {
    const input = document.createElement('textarea');
    input.rows = 1;
    input.value = value;
    input.addEventListener('input', () => onInput(input.value));
    return input;
  };

  const renderTable = () => {
    el.editorBody.innerHTML = '';
    state.rows.forEach((row, index) => {
      const tr = document.createElement('tr');
      tr.dataset.index = String(index);
      if (index === state.selectedIndex) tr.classList.add('selected');

      COLUMNS.forEach((key) => {
        const td = document.createElement('td');
        const input = createInputCell(row[key], (value) => { row[key] = value; updateDerived(); });
        td.appendChild(input);
        tr.appendChild(td);
      });

      const actions = document.createElement('td');
      const del = document.createElement('button');
      del.type = 'button';
      del.textContent = '削除';
      del.className = 'danger';
      del.dataset.action = 'delete';
      actions.appendChild(del);
      tr.appendChild(actions);
      el.editorBody.appendChild(tr);
    });
  };

  const renderPreview = () => {
    const row = state.rows[state.selectedIndex];
    if (!row) {
      el.previewArea.innerHTML = '<p class="preview-empty">行を選ぶと、質問と選択肢の見え方をここで確認できます。</p>';
      return;
    }
    const choices = [row.answer, row.wrong1, row.wrong2, row.wrong3].filter(Boolean);
    const imageHtml = row.image ? `<img src="${row.image}" alt="${row.imageAlt || ''}" class="preview-image" />` : '';
    el.previewArea.innerHTML = `<p><strong>${row.question || '(問題文なし)'}</strong></p>${imageHtml}<ol>${choices.map((c) => `<li>${c}</li>`).join('')}</ol><p>${row.explanation || ''}</p>`;
  };

  const updateDerived = () => {
    el.questionCount.textContent = String(state.rows.length);
    el.sourceLabel.textContent = state.sourceLabel;
    el.targetLabel.textContent = el.targetSelect.value || '未選択';
    el.jsonOutput.value = JSON.stringify(toExportRows(), null, 2);
  };

  const assignEmptyIds = () => {
    let maxId = state.rows.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0);
    state.rows.forEach((r) => { if (!r.id) { maxId += 1; r.id = String(maxId); } });
  };

  const downloadBlob = (name, blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const filenameBase = () => (el.targetSelect.value || 'quiz-data').replace(/\.(json|xlsx|csv)$/i, '');

  const parseRowsFromSheetObjects = (objs) => normalizeInputRows(objs.map((obj) => ({
    id: obj.id,
    era: obj.era,
    question: obj.question,
    image: obj.image,
    imageAlt: obj.imageAlt,
    answer: obj.answer,
    wrong1: obj.wrong1,
    wrong2: obj.wrong2,
    wrong3: obj.wrong3,
    explanation: obj.explanation,
    wrongChoices: obj.wrongChoices,
  })));

  const loadJsonOptions = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      state.jsonOptions = raw ? JSON.parse(raw) : [...DEFAULT_JSON_OPTIONS];
      if (!Array.isArray(state.jsonOptions) || !state.jsonOptions.length) state.jsonOptions = [...DEFAULT_JSON_OPTIONS];
    } catch {
      state.jsonOptions = [...DEFAULT_JSON_OPTIONS];
    }
    renderJsonOptions();
  };

  const saveJsonOptions = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state.jsonOptions));

  const renderJsonOptions = () => {
    const current = el.targetSelect.value;
    el.targetSelect.innerHTML = '';
    state.jsonOptions.forEach((name) => {
      const op = document.createElement('option');
      op.value = name;
      op.textContent = name;
      el.targetSelect.appendChild(op);
    });
    el.targetSelect.value = state.jsonOptions.includes(current) ? current : state.jsonOptions[0];
    updateDerived();
  };


  el.editorBody.addEventListener('click', (event) => {
    const tr = event.target.closest('tr[data-index]');
    if (!tr) return;
    const index = Number(tr.dataset.index);

    if (event.target.matches('[data-action="delete"]')) {
      state.rows.splice(index, 1);
      if (state.selectedIndex >= state.rows.length) {
        state.selectedIndex = state.rows.length - 1;
      }
      renderTable();
      renderPreview();
      updateDerived();
      return;
    }

    state.selectedIndex = index;

    if (event.target.matches('input, textarea, button')) {
      renderPreview();
      updateDerived();
      return;
    }

    renderTable();
    renderPreview();
    updateDerived();
  });

  el.importFile.addEventListener('change', async () => {
    const file = el.importFile.files?.[0];
    if (!file) return;
    const name = file.name.toLowerCase();
    try {
      if (name.endsWith('.json')) {
        const text = await file.text();
        state.rows = parseRowsFromSheetObjects(JSON.parse(text));
      } else if (name.endsWith('.csv') || name.endsWith('.xlsx') || name.endsWith('.xls')) {
        const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        state.rows = parseRowsFromSheetObjects(XLSX.utils.sheet_to_json(ws, { defval: '' }));
      } else {
        throw new Error('未対応の形式です');
      }
      state.sourceLabel = file.name;
      assignEmptyIds();
      state.selectedIndex = state.rows.length ? 0 : -1;
      renderTable(); renderPreview(); updateDerived();
      showStatus(`${file.name} を読み込みました。`);
    } catch (e) {
      showStatus(`読み込み失敗: ${e.message}`);
    }
  });

  el.addRow.addEventListener('click', () => { state.rows.push(sanitizeRow({})); state.selectedIndex = state.rows.length - 1; renderTable(); renderPreview(); updateDerived(); });
  el.validate.addEventListener('click', () => {
    const issues = [];
    state.rows.forEach((r, i) => { if (!r.question || !r.answer) issues.push(`${i + 1}行目: question/answer は必須`); });
    el.validationOutput.innerHTML = issues.length ? `<ul>${issues.map((x) => `<li>${x}</li>`).join('')}</ul>` : '<p>問題ありません。</p>';
  });
  el.normalizeIds.addEventListener('click', () => { assignEmptyIds(); renderTable(); updateDerived(); showStatus('空の id を採番しました。'); });

  el.exportJson.addEventListener('click', () => downloadBlob(`${filenameBase()}.json`, new Blob([JSON.stringify(toExportRows(), null, 2)], { type: 'application/json' })));
  el.exportCsv.addEventListener('click', () => {
    const ws = XLSX.utils.json_to_sheet(state.rows);
    const csv = XLSX.utils.sheet_to_csv(ws);
    downloadBlob(`${filenameBase()}.csv`, new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  });
  el.exportExcel.addEventListener('click', () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.rows), 'Questions');
    XLSX.writeFile(wb, `${filenameBase()}.xlsx`);
  });
  el.copyJson.addEventListener('click', async () => { await navigator.clipboard.writeText(el.jsonOutput.value); showStatus('JSON をコピーしました。'); });

  el.downloadTemplate.addEventListener('click', () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([sanitizeRow({})]), 'Template');
    XLSX.writeFile(wb, 'question-template.xlsx');
  });
  el.downloadCsvTemplate.addEventListener('click', () => {
    const ws = XLSX.utils.json_to_sheet([sanitizeRow({})]);
    downloadBlob('question-template.csv', new Blob([XLSX.utils.sheet_to_csv(ws)], { type: 'text/csv;charset=utf-8' }));
  });

  el.targetSelect.addEventListener('change', updateDerived);
  el.addJsonOption.addEventListener('click', () => {
    const value = prompt('追加する JSON ファイル名を入力してください', 'quiz-data_new.json');
    if (!value) return;
    if (!state.jsonOptions.includes(value)) state.jsonOptions.push(value);
    saveJsonOptions(); renderJsonOptions(); el.targetSelect.value = value; updateDerived();
  });
  el.removeJsonOption.addEventListener('click', () => {
    if (state.jsonOptions.length <= 1) return showStatus('候補をすべて削除することはできません。');
    state.jsonOptions = state.jsonOptions.filter((n) => n !== el.targetSelect.value);
    saveJsonOptions(); renderJsonOptions();
  });
  el.resetJsonOptions.addEventListener('click', () => {
    state.jsonOptions = [...DEFAULT_JSON_OPTIONS]; saveJsonOptions(); renderJsonOptions();
  });

  loadJsonOptions();
  state.rows = [];
  renderTable();
  renderPreview();
  updateDerived();
})();
