const capsule = document.getElementById('capsule');

if (capsule) {
  capsule.addEventListener('click', () => {
    if (capsule.classList.contains('opening')) {
      return;
    }
    capsule.classList.add('opening');
    capsule.disabled = true;
    capsule.style.pointerEvents = 'none';
    capsule.blur();

    window.setTimeout(() => {
      capsule.style.opacity = '0';
      capsule.style.transform = 'scale(0.65)';
    }, 600);

    window.setTimeout(() => {
      const target = new URL('portfolio/index.html', window.location.href);
      window.location.href = target.href;
    }, 1400);
  });
}
