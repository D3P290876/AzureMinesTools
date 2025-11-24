async function loadUpgrades() {
  const response = await fetch('upgrades.json');
  const data = await response.json();
  return data.stations;
}

function getSavedProgress() {
  return JSON.parse(localStorage.getItem('upgradeProgress') || '{}');
}

function saveProgress(progress) {
  localStorage.setItem('upgradeProgress', JSON.stringify(progress));
}

function createStationCard(station, currentLevel, progressData) {
  const card = document.createElement('div');
  card.className = 'station-card';

  const name = document.createElement('div');
  name.className = 'station-name';
  name.textContent = station.name;
  card.appendChild(name);

  const levelDisplay = document.createElement('div');
  levelDisplay.className = 'level';
  levelDisplay.textContent = `Level: ${currentLevel} / ${station.maxLevel}`;
  card.appendChild(levelDisplay);

  // Determine upgrade info
  const nextUpgrade = station.upgrades.find(u => u.level === currentLevel + 1);
  const currentUpgrade = station.upgrades.find(u => u.level === currentLevel);

  if (!nextUpgrade && currentLevel >= station.maxLevel) {
    const maxed = document.createElement('div');
    maxed.textContent = 'MAX LEVEL REACHED';
    card.appendChild(maxed);
  } else {
    const upgradeInfo = nextUpgrade || currentUpgrade;
    const label = document.createElement('div');
    label.style.marginBottom = '5px';
    label.style.color = '#aaa';
    label.textContent = nextUpgrade
      ? `Upgrade Requirements`
      : `Current Level Requirements`;
    card.appendChild(label);

    // ⭐ NEW ORE IMAGE REQUIREMENTS BLOCK ⭐
    const reqContainer = document.createElement('div');
    reqContainer.style.display = 'flex';
    reqContainer.style.flexDirection = 'column';
    reqContainer.style.gap = '8px';
    reqContainer.style.marginTop = '10px';

    Object.entries(upgradeInfo.requirements).forEach(([item, amount]) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '10px';

      const img = document.createElement('img');
      img.src = window.oreImages[item] || '';
      img.alt = item;
      img.style.width = '32px';
      img.style.height = '32px';
      img.style.objectFit = 'contain';
      img.style.filter = 'drop-shadow(0 0 5px #000)';

      const text = document.createElement('div');
      text.style.display = 'flex';
      text.style.flexDirection = 'column';
      text.innerHTML = `
          <span style="color:#fff; font-weight:bold;">${item}</span>
          <span style="color:lightgray;">Required: ${amount}</span>
      `;

      row.appendChild(img);
      row.appendChild(text);
      reqContainer.appendChild(row);
    });

    card.appendChild(reqContainer);
    // ⭐ END OF NEW BLOCK ⭐
  }

  // 🔘 Button container
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'space-between';
  buttonContainer.style.gap = '10px';
  buttonContainer.style.marginTop = '10px';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'upgrade-btn';
  prevBtn.textContent = 'Prev. Upg.';
  prevBtn.disabled = currentLevel <= 0;
  prevBtn.onclick = () => {
    if (currentLevel > 0) {
      progressData[station.id] = currentLevel - 1;
      saveProgress(progressData);
      renderStations();
    }
  };

  const nextBtn = document.createElement('button');
  nextBtn.className = 'upgrade-btn';
  nextBtn.textContent = 'Next Upg.';
  nextBtn.disabled = currentLevel >= station.maxLevel;
  nextBtn.onclick = () => {
    if (currentLevel < station.maxLevel) {
      progressData[station.id] = currentLevel + 1;
      saveProgress(progressData);
      renderStations();
    }
  };

  buttonContainer.appendChild(prevBtn);
  buttonContainer.appendChild(nextBtn);
  card.appendChild(buttonContainer);

  return card;
}



async function renderStations() {
  const container = document.getElementById('stations-container');
  container.innerHTML = '';

  const stations = await loadUpgrades();
  const progress = getSavedProgress();

  stations.forEach(station => {
    const currentLevel = progress[station.id] || 0;
    const card = createStationCard(station, currentLevel, progress);
    container.appendChild(card);
  });
}

renderStations();
