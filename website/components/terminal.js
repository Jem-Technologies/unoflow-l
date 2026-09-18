// Terminal Component - Mock command line interaction
import { createCopyButton } from '/lib/ui.js';

export function renderTerminal(command, outputLines = []) {
  const container = document.createElement('div');
  container.className = 'card';
  container.style.fontFamily = 'var(--font-mono)';
  container.style.fontSize = '0.9rem';
  container.style.backgroundColor = '#000000';
  container.style.borderColor = 'var(--border-color)';
  container.style.padding = 'var(--space-md)';
  container.style.overflowX = 'auto';

  // Header Dots
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = 'var(--space-md)';
  header.style.borderBottom = '1px solid #111';
  header.style.paddingBottom = 'var(--space-sm)';

  const dots = document.createElement('div');
  dots.style.display = 'flex';
  dots.style.gap = '6px';
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.style.width = '10px';
    dot.style.height = '10px';
    dot.style.borderRadius = '50%';
    dot.style.backgroundColor = i === 0 ? '#ff5f56' : i === 1 ? '#ffbd2e' : '#27c93f';
    dots.appendChild(dot);
  }
  header.appendChild(dots);

  const copyBtn = createCopyButton(command, 'copy-btn');
  header.appendChild(copyBtn);
  container.appendChild(header);

  // Command input
  const cmdRow = document.createElement('div');
  cmdRow.style.color = 'var(--accent)';
  cmdRow.style.marginBottom = 'var(--space-xs)';
  cmdRow.innerHTML = `<span style="color: #666;">$</span> ${command}`;
  container.appendChild(cmdRow);

  // Output
  outputLines.forEach(line => {
    const row = document.createElement('div');
    row.style.color = '#888';
    row.textContent = line;
    container.appendChild(row);
  });

  return container;
}
