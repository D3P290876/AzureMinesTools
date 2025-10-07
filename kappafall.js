// main.js
// Handles Kappa image click and falling animation

document.addEventListener('DOMContentLoaded', function() {
  const kappaImg = document.querySelector('.kappa');
  if (!kappaImg) return;

  kappaImg.addEventListener('click', function() {
    createFallingKappa();
  });
});

function createFallingKappa() {
  const kappaSrc = './src/Kappa.png';
  const img = document.createElement('img');
  img.src = kappaSrc;
  img.className = 'falling-kappa';
  img.style.position = 'fixed';
  img.style.width = '64px';
  img.style.height = '64px';
  img.style.zIndex = 1000;
  img.style.left = Math.random() * (window.innerWidth - 64) + 'px';
  img.style.top = '-64px';
  document.body.appendChild(img);

  let top = -64;
  const speed = 6 + Math.random() * 6;
  function fall() {
    top += speed;
    img.style.top = top + 'px';
    if (top < window.innerHeight) {
      requestAnimationFrame(fall);
    } else {
      img.remove();
    }
  }
  fall();
}
