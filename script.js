const applyTheme = (selectedTheme) => {
      if (selectedTheme === '💻') {
        document.documentElement.style.removeProperty('--theme');
        localStorage.removeItem('theme');
      } else {
        document.documentElement.style.setProperty('--theme', selectedTheme);
        localStorage.setItem('theme', selectedTheme);
      }
    };

    window.addEventListener('DOMContentLoaded', () => {
      const themeSelect = document.querySelector('#theme');
      const savedTheme = localStorage.getItem('theme');

      // Apply saved theme on load
      if (savedTheme) {
        themeSelect.value = savedTheme;
        applyTheme(savedTheme);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? '🌑' : '☀️');
      }

      themeSelect.addEventListener('change', (e) => {
        const selected = e.target.value;
        if (!document.startViewTransition) {
          applyTheme(selected);
          return;
        }
        document.startViewTransition(() => {
          applyTheme(selected);
        });
      });
    });
