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
      ? `Next Upgrade Requirements`
      : `Current Level Requirements`;
    card.appendChild(label);

    Object.entries(upgradeInfo.requirements).forEach(([item, amount]) => {
      const row = document.createElement('div');
      row.className = 'item-row';

      const label = document.createElement('span');
      label.textContent = `${item.toUpperCase()} (${amount})`;
      row.appendChild(label);

      const progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      const fill = document.createElement('div');
      fill.className = 'progress-fill';
      fill.style.width = '0%';
      progressBar.appendChild(fill);
      row.appendChild(progressBar);

      card.appendChild(row);
    });
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
