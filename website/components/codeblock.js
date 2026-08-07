// CodeBlock Component - formats code with line numbers and copy buttons
import { createCopyButton } from '/website/lib/ui.js';

export function renderCodeBlock(codeText, language = 'javascript', filename = '') {
  const container = document.createElement('div');
  container.className = 'codeblock-container';

  const header = document.createElement('div');
  header.className = 'codeblock-header';

  const fileSpan = document.createElement('span');
  fileSpan.textContent = filename || language;
  header.appendChild(fileSpan);

  const copyBtn = createCopyButton(codeText);
  header.appendChild(copyBtn);

  container.appendChild(header);

  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.className = `language-${language}`;
  code.textContent = codeText;

  pre.appendChild(code);
  container.appendChild(pre);

  return container;
}
