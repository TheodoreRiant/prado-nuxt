export default defineNuxtPlugin(() => {
  const saved = localStorage.getItem('prado-theme') as 'light' | 'dark' | null;
  const theme = saved ?? 'dark';
  document.documentElement.setAttribute('data-theme', theme);

  const themeState = useState('theme');
  themeState.value = theme;
});
