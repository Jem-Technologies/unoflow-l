// Custom general UI elements helper
export function createCopyButton(textToCopy, extraClass = '') {
  const btn = document.createElement('button');
  btn.className = `copy-btn ${extraClass}`;
  btn.textContent = 'Copy';
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      btn.textContent = 'Copied!';
      btn.style.color = 'var(--accent)';
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.style.color = '';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  });
  return btn;
}
