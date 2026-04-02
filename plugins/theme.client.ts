export default defineNuxtPlugin(() => {
  // data-theme is already set by the inline head script (no flash).
  // Here we just sync the Nuxt reactive state.
  const current = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null;
  const themeState = useState('theme');
  themeState.value = current ?? 'light';

  // If no theme was stored yet, apply light as default
  if (!current) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
});
