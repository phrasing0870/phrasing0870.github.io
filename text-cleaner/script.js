const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const cleanBtn = document.getElementById("cleanBtn");
const pasteBtn = document.getElementById("pasteBtn");
const resetBtn = document.getElementById("resetBtn");
const copyBtn = document.getElementById("copyBtn");
const reuseBtn = document.getElementById("reuseBtn");

const inputStats = document.getElementById("inputStats");
const outputStats = document.getElementById("outputStats");
const presetLabel = document.getElementById("presetLabel");
const reportContent = document.getElementById("reportContent");

const presetButtons = [...document.querySelectorAll(".cleaner-preset")];

const options = {
  invisible: document.getElementById("optInvisible"),
  nbsp: document.getElementById("optNbsp"),
  smart: document.getElementById("optSmart"),
  lineEndings: document.getElementById("optLineEndings"),
  trailing: document.getElementById("optTrailing"),
  blankLines: document.getElementById("optBlankLines"),
  markdown: document.getElementById("optMarkdown"),
  listPrefixes: document.getElementById("optListPrefixes"),
};

const presets = {
  standard: {
    label: "Standard",
    invisible: true,
    nbsp: true,
    smart: true,
    lineEndings: true,
    trailing: true,
    blankLines: true,
    markdown: false,
    listPrefixes: false,
  },

  plain: {
    label: "Plain text",
    invisible: true,
    nbsp: true,
    smart: true,
    lineEndings: true,
    trailing: true,
    blankLines: true,
    markdown: true,
    listPrefixes: true,
  },

  code: {
    label: "Code safe",
    invisible: true,
    nbsp: true,
    smart: false,
    lineEndings: true,
    trailing: false,
    blankLines: false,
    markdown: false,
    listPrefixes: false,
  },

  aggressive: {
    label: "Aggressive",
    invisible: true,
    nbsp: true,
    smart: true,
    lineEndings: true,
    trailing: true,
    blankLines: true,
    markdown: true,
    listPrefixes: true,
  },
};

function applyPreset(name) {
  const preset = presets[name];

  Object.keys(options).forEach((key) => {
    options[key].checked = preset[key];
  });

  presetButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.preset === name);
  });

  presetLabel.textContent = preset.label;
}

function getStats(text) {
  const chars = text.length;

  const words = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

  const lines = text
    ? text.split(/\r\n|\r|\n/).length
    : 0;

  return `${chars.toLocaleString()} chars · ${words.toLocaleString()} words · ${lines.toLocaleString()} lines`;
}

function updateStats() {
  inputStats.textContent = getStats(inputText.value);
  outputStats.textContent = getStats(outputText.value);
}

function countMatches(text, regex) {
  return (text.match(regex) || []).length;
}

function stripMarkdown(text) {
  let output = text;

  // Code fences
  output = output.replace(/^```[^\n]*\n?/gm, "");
  output = output.replace(/\n?```$/gm, "");

  // Inline code
  output = output.replace(/`([^`]+)`/g, "$1");

  // Images and links
  output = output.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1");
  output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");

  // Headings
  output = output.replace(/^\s{0,3}#{1,6}\s+/gm, "");

  // Blockquotes
  output = output.replace(/^\s{0,3}>\s?/gm, "");

  // Horizontal rules
  output = output.replace(
    /^\s{0,3}(?:-{3,}|\*{3,}|_{3,})\s*$/gm,
    ""
  );

  // Bold
  output = output.replace(/\*\*([^*]+)\*\*/g, "$1");
  output = output.replace(/__([^_]+)__/g, "$1");

  // Italic
  output = output.replace(/\*([^*]+)\*/g, "$1");
  output = output.replace(/_([^_]+)_/g, "$1");

  // Strikethrough
  output = output.replace(/~~([^~]+)~~/g, "$1");

  return output;
}

function cleanText(text) {
  let output = text;
  const changes = [];

  if (options.invisible.checked) {
    const regex =
      /[\u200B\u200C\u200D\u2060\uFEFF\u00AD]/g;

    const count = countMatches(output, regex);

    if (count > 0) {
      output = output.replace(regex, "");

      changes.push(
        `${count} invisible character${count === 1 ? "" : "s"} removed`
      );
    }
  }

  if (options.nbsp.checked) {
    const regex = /[\u00A0\u202F\u2007]/g;

    const count = countMatches(output, regex);

    if (count > 0) {
      output = output.replace(regex, " ");

      changes.push(
        `${count} non-breaking space${count === 1 ? "" : "s"} normalized`
      );
    }
  }

  if (options.smart.checked) {
    const replacements = [
      {
        regex: /[“”]/g,
        value: '"',
      },
      {
        regex: /[‘’]/g,
        value: "'",
      },
      {
        regex: /[‐-–—]/g,
        value: "-",
      },
      {
        regex: /…/g,
        value: "...",
      },
    ];

    let count = 0;

    replacements.forEach(({ regex, value }) => {
      const matches = countMatches(output, regex);

      if (matches > 0) {
        count += matches;
        output = output.replace(regex, value);
      }
    });

    if (count > 0) {
      changes.push(
        `${count} smart punctuation character${count === 1 ? "" : "s"} normalized`
      );
    }
  }

  if (options.lineEndings.checked) {
    const count = countMatches(
      output,
      /\r\n|\r/g
    );

    if (count > 0) {
      output = output.replace(/\r\n?/g, "\n");

      changes.push(
        `${count} line ending${count === 1 ? "" : "s"} normalized`
      );
    }
  }

  if (options.trailing.checked) {
    const count = countMatches(
      output,
      /[ \t]+$/gm
    );

    if (count > 0) {
      output = output.replace(/[ \t]+$/gm, "");

      changes.push(
        `${count} trailing whitespace segment${count === 1 ? "" : "s"} removed`
      );
    }
  }

  if (options.blankLines.checked) {
    const before = output;

    output = output.replace(
      /\n{3,}/g,
      "\n\n"
    );

    if (before !== output) {
      changes.push(
        "Excess blank lines collapsed"
      );
    }
  }

  if (options.markdown.checked) {
    const before = output;

    output = stripMarkdown(output);

    if (before !== output) {
      changes.push(
        "Markdown formatting stripped"
      );
    }
  }

  if (options.listPrefixes.checked) {
    const regex =
      /^\s*(?:[-*+•]|\d+[.)])\s+/gm;

    const count = countMatches(
      output,
      regex
    );

    if (count > 0) {
      output = output.replace(
        regex,
        ""
      );

      changes.push(
        `${count} list prefix${count === 1 ? "" : "es"} removed`
      );
    }
  }

  return {
    output,
    changes,
  };
}

function renderReport(changes) {
  if (changes.length === 0) {
    reportContent.className =
      "cleaner-report-empty";

    reportContent.textContent =
      "No changes were needed.";

    return;
  }

  reportContent.className = "";

  const list =
    document.createElement("ul");

  changes.forEach((change) => {
    const item =
      document.createElement("li");

    item.textContent = change;

    list.appendChild(item);
  });

  reportContent.replaceChildren(list);
}

function runCleaner() {
  const result =
    cleanText(inputText.value);

  outputText.value =
    result.output;

  renderReport(
    result.changes
  );

  copyBtn.disabled =
    !result.output;

  reuseBtn.disabled =
    !result.output;

  updateStats();
}

async function pasteText() {
  try {
    const text =
      await navigator.clipboard.readText();

    inputText.value = text;

    updateStats();
  } catch {
    inputText.focus();
  }
}

async function copyText() {
  if (!outputText.value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(
      outputText.value
    );

    copyBtn.textContent =
      "Copied";

    setTimeout(() => {
      copyBtn.textContent =
        "Copy cleaned text";
    }, 1200);
  } catch {
    outputText.select();

    document.execCommand(
      "copy"
    );
  }
}

function resetCleaner() {
  inputText.value = "";
  outputText.value = "";

  copyBtn.disabled = true;
  reuseBtn.disabled = true;

  reportContent.className =
    "cleaner-report-empty";

  reportContent.textContent =
    "No changes yet.";

  applyPreset("standard");

  updateStats();
}

presetButtons.forEach((button) => {
  button.addEventListener(
    "click",
    () => {
      applyPreset(
        button.dataset.preset
      );
    }
  );
});

inputText.addEventListener(
  "input",
  updateStats
);

cleanBtn.addEventListener(
  "click",
  runCleaner
);

pasteBtn.addEventListener(
  "click",
  pasteText
);

copyBtn.addEventListener(
  "click",
  copyText
);

resetBtn.addEventListener(
  "click",
  resetCleaner
);

reuseBtn.addEventListener(
  "click",
  () => {
    inputText.value =
      outputText.value;

    outputText.value = "";

    copyBtn.disabled = true;
    reuseBtn.disabled = true;

    reportContent.className =
      "cleaner-report-empty";

    reportContent.textContent =
      "Output moved back to input.";

    updateStats();

    inputText.focus();
  }
);

applyPreset("standard");

updateStats();