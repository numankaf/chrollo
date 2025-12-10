export function cssVar(name: string, fallback: string) {
  // Create a temp element so the browser resolves the CSS variable
  const probe = document.createElement('div');

  // Apply the CSS variable to a real style property
  probe.style.display = 'none';
  probe.style.color = `var(${name})`;

  // Must be in the DOM for computed styles to work
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).color;
  document.body.removeChild(probe);

  // If the variable is missing, browser returns transparent
  return value !== 'rgba(0, 0, 0, 0)' ? value : fallback;
}
