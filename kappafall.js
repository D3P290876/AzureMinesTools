// main.js
// Handles Kappa image click and falling animation

let kappaClickCount = 0;
const kappaThreshold = 1337;

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

function showKappaModal() {
  const modal = document.getElementById('kappaModal');
  if (!modal) return;
  modal.classList.add('active');
}

function hideKappaModal() {
  const modal = document.getElementById('kappaModal');
  if (!modal) return;
  modal.classList.remove('active');
}

function handleModalClick(event) {
  const modal = document.getElementById('kappaModal');
  if (!modal) return;
  if (event.target === modal) {
    hideKappaModal();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const kappaImg = document.querySelector('.kappa');
  if (!kappaImg) return;

  kappaImg.addEventListener('click', function() {
    createFallingKappa();
    kappaClickCount += 1;
    if (kappaClickCount === kappaThreshold) {
      showKappaModal();
    }
  });

  const modal = document.getElementById('kappaModal');
  if (modal) {
    modal.addEventListener('click', handleModalClick);
  }
});
