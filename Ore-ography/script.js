const oreGrid = document.getElementById('oreGrid');
const modal = document.getElementById('oreModal');
const closeBtn = document.querySelector('.close');

// Modal fields
const oreHeaderImage = document.getElementById('oreHeaderImage');
const oreHeaderName = document.getElementById('oreHeaderName');
const oreDepth = document.getElementById('oreDepth');
const oreLocation = document.getElementById('oreLocation');
const oreRate = document.getElementById('oreRate');
const oreNotes = document.getElementById('oreNotes');

// Load JSON dynamically
fetch('ores.json')
  .then(res => res.json())
  .then(ores => {
    ores.forEach(ore => {
      const div = document.createElement('div');
      div.classList.add('ore');
      div.innerHTML = `<img src="${ore.image}" alt="${ore.name}">`;
      div.addEventListener('click', () => showOreDetails(ore));
      oreGrid.appendChild(div);
    });
  })
  .catch(err => console.error("❌ Failed to load ore data:", err));

function showOreDetails(ore) {
  oreHeaderImage.src = ore.image;
  oreHeaderName.textContent = ore.name;
  oreDepth.textContent = ore.depth;
  oreLocation.textContent = ore.location;
  oreRate.textContent = ore.rate;
  oreNotes.textContent = ore.notes;

  modal.classList.add('show');
  modal.style.display = 'flex';
}

function hideModal() {
  modal.classList.remove('show');
  setTimeout(() => modal.style.display = 'none', 300);
}

closeBtn.addEventListener('click', hideModal);
modal.addEventListener('click', e => { if (e.target === modal) hideModal(); });
