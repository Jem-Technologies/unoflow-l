// Card Component with dynamic custom glows

export function createInteractiveCard(title, description, badgeText = '', badgeColor = 'cyan') {
  const card = document.createElement('div');
  card.className = 'card card-glowing';

  let badgeHtml = '';
  if (badgeText) {
    badgeHtml = `<span class="badge badge-${badgeColor}" style="margin-bottom: var(--space-sm);">${badgeText}</span>`;
  }

  card.innerHTML = `
    ${badgeHtml}
    <h3 style="margin-bottom: var(--space-sm); color: var(--fg);">${title}</h3>
    <p style="font-size: 0.95rem; color: var(--muted-text);">${description}</p>
  `;

  return card;
}
