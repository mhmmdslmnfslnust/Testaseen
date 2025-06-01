export function createFooter() {
  const footer = document.createElement('footer');
  footer.classList.add('app-footer');
  
  footer.innerHTML = `
    <p>© ${new Date().getFullYear()} Sonnet 3.7 Test Hub. Created for personal insight and reflection.</p>
    <p>This test is not a substitute for professional advice.</p>
  `;
  
  return footer;
}
