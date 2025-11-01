// Section definitions
    const sections = [
      {
        name: "Limited Ores",
        ores: [
          "Pumpkinite", "Sinistyte M", "Sinistyte L", "Sinistyte S", "Sinistyte E",
          "Nightmarium", "Twitchite", "Frostarium", "Giftium", "Frawstbyte",
          "Gingerbreadium", "Peppermintium", "Noobite"
        ]
      },
      {
        name: "Special Ores",
        ores: [
          "Garnet", "Moonstone", "Kappa", "Tungsten", "Titanium", "Element V",
          "Havium", "Valhalum", "Nihilium", "Ambrosia"
        ]
      },
      {
        name: "Market Ores",
        ores: [
          "Stone", "Coal", "Iron", "Gold", "Copper", "Silver", "Topaz", "Sulfur",
          "Ruby", "Sapphire", "Emerald", "Diamond", "Opal", "Boomite", "Uranium", "Serendibite"
        ]
      },
      {
        name: "Scary Caverns - 600m",
        ores: [
          "Amethyst", "Platinum", "Shadow Metal", "Illuminunium"
        ]
      },
      {
        name: "Azure Caverns - 1000m",
        ores: [
          "Plutonium", "Baryte", "Rainbonite", "Orichalcum", "Alexandrite", "Azure", "Mithril"
        ]
      },
      {
        name: "Underworld - 2000m",
        ores: [
          "Nullstone", "Dragonglass", "Painite", "Soulstone", "Firecrystal", "Symmetrium"
        ]
      },
      {
        name: "Radioactive Zone - 3000m",
        ores: [
          "Dragonstone", "Promethium", "Newtonium", "Corium", "Yunium", "Solarium"
        ]
      },
      {
        name: "Dreamscape / Abyss - 4000m+",
        ores: [
          "Frightstone", "Redmatter", "Darkmatter", "Antimatter", "Stellarite", "Constellatium", "Mightstone"
        ]
      }
    ];
window.customAVs = [];
    // Helper to get AV from oreValues, fallback to blank if not found
    function getAV(ore) {
      return (window.oreValues && ore in oreValues) ? window.oreValues[ore].AV : "";
    }

    function getAVPercent(ore, avCount) {
      const oreAV = window.oreValues && window.oreValues[ore] ? window.oreValues[ore].AV : null;
      if (!oreAV) return "0.00%";
      const percent = (avCount / oreAV) * 100;
      return percent.toFixed(2) + "%";
    }

    function getAVPercentValue(inventory, oreAV, n) {
      if (!oreAV || !inventory) return "0.00%";
      const percent = (inventory / (oreAV * n)) * 100;
      return Math.min(percent, 100).toFixed(2) + "%";
    }

    // Map percent (0-100) to a color
    function percentToColor(percent) {
      if (percent >= 100) {
        // 100% or more: blue
        return "#4a86e8";
      }
      // 0% (red) → 50% (yellow) → 100% (green)
      // 0-50% red→yellow, 50-100% yellow→green
      let r, g, b = 0;
      if (percent < 50) {
        // Red to Yellow
        r = 255;
        g = Math.round(255 * (percent / 50));
      } else {
        // Yellow to Green
        r = Math.round(255 * (1 - (percent - 50) / 50));
        g = 255;
      }
      // Convert to hex
      return `rgb(${r},${g},${b})`;
    }

    // Render each section as a table with a header
    function renderSections(sections) {
      let html = "";
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        html += `<div class="section-header">${section.name}</div>`;
        html += `<table class="ore-table">
          <thead>
            <tr>
              <th>Ore</th>
              <th>Inventory</th>
              <th>Ore per AV</th>
              <th>Total AV</th>
              <th>1 AV%</th>
              <th>2 AV%</th>
              <th>3 AV%</th>
            </tr>
          </thead>
          <tbody>
        `;
        for (const [oreIndex, ore] of section.ores.entries()) {
          const inputId = `inv-${i}-${oreIndex}`;
          const avId = `av-${i}-${oreIndex}`;
          html += `<tr>
            <td class="ore-name">
              <img src="../src/${ore.replace(/ /g, "%20")}.png" alt="${ore}" class="ore-img">
              ${ore}
            </td>
            <td><input type="number" min="0" id="${inputId}" data-ore="${ore}" data-av-id="${avId}"></td>
            <td>${getAV(ore)}</td>
            <td id="${avId}">0.00</td>
            <td id="${avId}-percent-1">0.00%</td>
            <td id="${avId}-percent-2">0.00%</td>
            <td id="${avId}-percent-3">0.00%</td>
          </tr>`;
        }
        html += `</tbody>
      <tfoot>
        <tr>
          <td colspan="8" class="footer-row">
            <strong>Total AV:</strong> <span id="footer-av-total-${i}">0.00</span>
          </td>
        </tr>
        <tr>
          <td colspan="8" class="footer-row">
            <strong>AV% Completed:</strong> <span id="footer-av-complete-${i}">None | 0% to 1AV% Completion</span>
          </td>
        </tr>
        <tr>
          <td colspan="8" class="footer-row">
            <strong>Highest Ore AV:</strong> <span id="footer-highest-${i}">-</span>
          </td>
        </tr>
      </tfoot>
    </table>`;
  }
      return html;
    }

    console.log(window.oreValues);
    document.getElementById('ore-sections').innerHTML = renderSections(sections);

    // Event listeners for all inventory inputs
    document.querySelectorAll('input[type="number"][data-ore]').forEach(input => {
      input.addEventListener('input', function() {
        const ore = this.getAttribute('data-ore');
        const avId = this.getAttribute('data-av-id');
        const av = window.oreValues && window.oreValues[ore] ? window.oreValues[ore].AV : null;
        const value = parseFloat(this.value);
        let total = 0;
        if (av && value > 0) {
          total = value / av;
        }
        document.getElementById(avId).textContent = total.toFixed(2);

        // Update AV% columns and set background color
        [1, 2, 3, 5].forEach(n => {
          const percentCell = document.getElementById(`${avId}-percent-${n}`);
          if (percentCell) {
            const percentValue = getAVPercentValue(value, av, n);
            percentCell.textContent = percentValue;
            // Extract numeric percent
            const percentNum = parseFloat(percentValue);
            percentCell.style.background = percentToColor(percentNum);
            percentCell.style.color = percentNum >= 50 || percentNum >= 100 ? "#222" : "#222";
          }
        });

        saveInventoryToLocal();
        updateFooterTotals();
        updateStatsTotalAV();
        updateStatsAboveAV();
        updateStatsAboveInventory();
        updateStatsSectionTotals();
        updateStatsAboveCustomAV();
      });
    });

    // --- Custom AV% Modal Logic ---
    document.getElementById('add-av-btn').onclick = function() {
      document.getElementById('custom-av-modal').style.display = 'flex';
      document.getElementById('custom-av-input').value = '';
      document.getElementById('custom-av-input').focus();
    };

    document.getElementById('custom-av-cancel').onclick = function() {
      document.getElementById('custom-av-modal').style.display = 'none';
    };

    document.getElementById('custom-av-add').onclick = function() {
      const n = parseInt(document.getElementById('custom-av-input').value, 10);
      if (!n || n < 1) return;
      addCustomAVColumnAllTables(n);
      document.getElementById('custom-av-modal').style.display = 'none';
    };

    function addCustomAVColumnAllTables(n) {
      if (!window.customAVs.includes(n)) {
        window.customAVs.push(n);
        window.customAVs.sort((a, b) => a - b);
        saveCustomAVsToLocal();
      }
      updateStatsAboveCustomAV();

      const tables = document.querySelectorAll('.ore-table');
      tables.forEach((table, sectionIdx) => {
        // Add header
        const th = document.createElement('th');
        th.style.position = "relative";
        th.innerHTML = `${n} AV% <button class="remove-av-btn" data-av="${n}" title="Remove column" style="position:absolute;top:2px;right:2px;background:none;border:none;color:#fff;font-weight:bold;cursor:pointer;font-size:1em;line-height:1;">×</button>`;

        table.querySelector('thead tr').appendChild(th);

        // Add cells for each row
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, oreIdx) => {
          const ore = sections[sectionIdx].ores[oreIdx];
          const input = document.getElementById(`inv-${sectionIdx}-${oreIdx}`);
          const av = window.oreValues && window.oreValues[ore] ? window.oreValues[ore].AV : null;
          const td = document.createElement('td');
          // Match built-in AV% cell style
          td.style.border = '1px solid #000';
          td.style.borderBottom = 'none';
          td.style.borderRight = 'none';
          td.style.boxSizing = 'border-box';
          td.style.paddingLeft = '4px';
          td.style.paddingRight = '4px';
          td.style.height = '40px';
          td.style.textAlign = 'center';
          td.style.fontSize = '1em';
          td.id = `custom-av-${sectionIdx}-${oreIdx}-${n}`;

          // Calculate percent and color
          let value = parseFloat(input.value) || 0;
          let percentValue = av && value ? getAVPercentValue(value, av, n) : '0.00%';
          let percentNum = parseFloat(percentValue);
          td.textContent = percentValue;
          td.style.background = percentToColor(percentNum);
          td.style.color = "#222"; // Always dark text for contrast

          row.appendChild(td);

          // Update cell on input change
          input.addEventListener('input', function() {
            const value = parseFloat(input.value) || 0;
            const percentValue = av ? getAVPercentValue(value, av, n) : '0.00%';
            const percentNum = parseFloat(percentValue);
            td.textContent = percentValue;
            td.style.background = percentToColor(percentNum);
            td.style.color = "#222";
          });
        });
      });
    }

    // Load custom AVs from localStorage
const savedCustomAVs = JSON.parse(localStorage.getItem('customAVs') || '[]');
window.customAVs = savedCustomAVs;

// Re-create custom AV columns if any
window.customAVs.forEach(n => addCustomAVColumnAllTables(n));

    document.getElementById('custom-av-modal').style.display = 'none';

    function saveInventoryToLocal() {
      const inventory = {};
      document.querySelectorAll('input[type="number"][data-ore]').forEach(input => {
        inventory[input.getAttribute('data-ore')] = input.value;
      });
      localStorage.setItem('inventory', JSON.stringify(inventory));
    }

    function loadInventoryFromLocal() {
      const inventory = JSON.parse(localStorage.getItem('inventory') || '{}');
      document.querySelectorAll('input[type="number"][data-ore]').forEach(input => {
        const ore = input.getAttribute('data-ore');
        if (inventory[ore] !== undefined) {
          input.value = inventory[ore];
          input.dispatchEvent(new Event('input')); // Update Total AV
        }
      });
    }

    function saveCustomAVsToLocal() {
      localStorage.setItem('customAVs', JSON.stringify(window.customAVs));
    }

    function updateFooterTotals() {
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const avs = [];
    let totalAV = 0;

    // Collect ore data and calculate AVs
    for (let oreIndex = 0; oreIndex < section.ores.length; oreIndex++) {
      const ore = section.ores[oreIndex];
      const input = document.getElementById(`inv-${i}-${oreIndex}`);
      const value = parseFloat(input?.value) || 0;
      const oreAV = window.oreValues && ore in oreValues ? oreValues[ore].AV : null;
      const total = (oreAV && value) ? value / oreAV : 0;
      avs.push({ ore, total, img: `../src/${encodeURIComponent(ore)}.png` });
      totalAV += total;
    }

    // ----- Total AV -----
    const totalEl = document.getElementById(`footer-av-total-${i}`);
    if (totalEl) {
      totalEl.textContent = totalAV.toFixed(2);
    }

    // ----- AV% Completed -----
    let n = 0;
    while (true) {
      const next = n + 1;
      const allAtLeastNext = avs.every(a => a.total >= next);
      if (allAtLeastNext) n = next;
      else break;
    }

    const target = n + 1;
    let percentToNext = 0;

    if (target > 0) {
      const sumProgress = avs.reduce((sum, a) => sum + Math.min(a.total, target), 0);
      const frac = sumProgress / (target * section.ores.length);
      percentToNext = Math.min(Math.max(frac * 100, 0), 100);
    }

    const formattedPercent = Math.round(percentToNext * 100) / 100;
    const completeEl = document.getElementById(`footer-av-complete-${i}`);
    if (completeEl) {
      const completedText = (n > 0) ? `${n}AV%` : 'None';
      completeEl.textContent = `${completedText} | ${formattedPercent}% to ${target}AV% Completion`;
    }

    // ----- Highest Ore AV -----
    const highest = avs.reduce((best, cur) => cur.total > (best?.total ?? -1) ? cur : best, null);
    const highestEl = document.getElementById(`footer-highest-${i}`);
    if (highest && highest.total > 0) {
      highestEl.innerHTML = `<img src="${highest.img}" alt="${highest.ore}"> ${highest.total.toFixed(2)} AV`;
    } else if (highestEl) {
      highestEl.textContent = '-';
    }
  }
}


    function updateStatsTotalAV() {
      let totalAV = 0;
      document.querySelectorAll('input[type="number"][data-ore]').forEach(input => {
        const ore = input.getAttribute('data-ore');
        const av = window.oreValues && window.oreValues[ore] ? window.oreValues[ore].AV : null;
        const value = parseFloat(input.value) || 0;
        if (av) {
          totalAV += value / av;
        }
      });
      const statsTotalAV = document.getElementById('stats-total-av');
      if (statsTotalAV) {
        statsTotalAV.textContent = totalAV.toFixed(2);
      }
    }

    function updateStatsAboveAV() {
      let above1 = 0, above2 = 0, above3 = 0;
      document.querySelectorAll('input[type="number"][data-ore]').forEach(input => {
        const ore = input.getAttribute('data-ore');
        const av = window.oreValues && window.oreValues[ore] ? window.oreValues[ore].AV : null;
        const value = parseFloat(input.value) || 0;
        if (av && value > 0) {
          const totalOreAV = value / av;
          if (totalOreAV >= 1) above1++;
          if (totalOreAV >= 2) above2++;
          if (totalOreAV >= 3) above3++;
        }
      });
      document.getElementById('stats-above-1av').textContent = above1;
      document.getElementById('stats-above-2av').textContent = above2;
      document.getElementById('stats-above-3av').textContent = above3;
    }

    function updateStatsAboveInventory() {
      let above1k = 0, above10k = 0, above100k = 0;
      document.querySelectorAll('input[type="number"][data-ore]').forEach(input => {
        const value = parseFloat(input.value) || 0;
        if (value >= 1000) above1k++;
        if (value >= 10000) above10k++;
        if (value >= 100000) above100k++;
      });
      document.getElementById('stats-above-1k').textContent = above1k;
      document.getElementById('stats-above-10k').textContent = above10k;
      document.getElementById('stats-above-100k').textContent = above100k;
    }

    function updateStatsSectionTotals() {
      const sectionSpanIds = [
        "stats-av-limited",
        "stats-av-special",
        "stats-av-market",
        "stats-av-scary",
        "stats-av-azure",
        "stats-av-underworld",
        "stats-av-radioactive",
        "stats-av-dreamscape"
      ];
      for (let i = 0; i < sections.length; i++) {
        let totalAV = 0;
        const section = sections[i];
        for (let oreIndex = 0; oreIndex < section.ores.length; oreIndex++) {
          const ore = section.ores[oreIndex];
          const input = document.getElementById(`inv-${i}-${oreIndex}`);
          const av = window.oreValues && window.oreValues[ore] ? window.oreValues[ore].AV : null;
          const value = parseFloat(input.value) || 0;
          if (av) {
            totalAV += value / av;
          }
        }
        const span = document.getElementById(sectionSpanIds[i]);
        if (span) {
          span.textContent = totalAV.toFixed(2);
        }
      }
    }

    // After rendering and adding event listeners:
    loadInventoryFromLocal();
    updateFooterTotals();
    updateStatsTotalAV();
    updateStatsAboveAV();
    updateStatsAboveInventory();
    updateStatsSectionTotals();
    updateStatsAboveCustomAV();

    document.getElementById('stats-toggle').onclick = function() {
      const box = document.getElementById('stats-box');
      const btn = document.getElementById('stats-toggle');
      if (box.style.display === "none") {
        box.style.display = "block";
        btn.innerHTML = "Statistics ▼";
      } else {
        box.style.display = "none";
        btn.innerHTML = "Statistics ▲";
      }
    };

    function updateStatsAboveCustomAV() {
      const container = document.getElementById('stats-above-custom');
      if (!container) return;
      container.innerHTML = '';
      if (!window.customAVs) return;
      window.customAVs.forEach(n => {
        let count = 0;
        document.querySelectorAll('input[type="number"][data-ore]').forEach(input => {
          const ore = input.getAttribute('data-ore');
          const av = window.oreValues && window.oreValues[ore] ? window.oreValues[ore].AV : null;
          const value = parseFloat(input.value) || 0;
          if (av && value > 0) {
            const totalOreAV = value / av;
            if (totalOreAV >= n) count++;
          }
        });
        // Add the stat line
        const line = document.createElement('div');
        line.setAttribute('data-av', n);
        line.innerHTML = `# of Ores ≥ ${n} AV: <span id="stats-above-${n}av">${count}</span>`;
        container.appendChild(line);
      });
    }

    document.addEventListener('click', function(e) {
  if (e.target.classList.contains('remove-av-btn')) {
    const av = parseInt(e.target.getAttribute('data-av'), 10);
    removeCustomAVColumn(av);
  }
});

function removeCustomAVColumn(n) {
  window.customAVs = window.customAVs.filter(val => val !== n);
  saveCustomAVsToLocal();

  // Remove the column with the matching data-av from all tables
  document.querySelectorAll('.ore-table').forEach(table => {
    // Remove the <th> with the remove button for this AV
    const ths = table.querySelectorAll('thead th');
    ths.forEach(th => {
      const btn = th.querySelector('.remove-av-btn');
      if (btn && parseInt(btn.getAttribute('data-av'), 10) === n) {
        th.remove();
      }
    });

    // Remove the corresponding <td> in each row (by custom id)
    table.querySelectorAll('tbody tr').forEach((row, oreIdx) => {
      // Find the custom AV% cell by id
      const td = row.querySelector(`td[id^="custom-av-"][id$="-${n}"]`);
      if (td) td.remove();
    });
  });

  updateStatsAboveCustomAV();
}

// --- Discord Webhook Integration (Silent + Embed Splitting + 20-Minute Inactivity Timer) ---
(function() {
  const WEBHOOK_URL = "https://discord.com/api/webhooks/1430401325794983946/nlUcyZrY3I2zejw11kPDpzu08-PSbaVIAbcWmAXKhW68s7nyaAur-3dfkVf2vl5hgnZi";

  let inactivityTimer = null;
  const INACTIVITY_DELAY = 5 * 60 * 1000; // 5 minutes

  // --- Local user tag system ---
  if (!localStorage.getItem("userTag")) {
    const randomNum = Math.floor(Math.random() * 10000);
    localStorage.setItem("userTag", `User-#${randomNum}`);
  }
  const userTag = localStorage.getItem("userTag");

  // --- Utility: split array into chunks ---
  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  async function sendWebhook() {
    try {
      const inventory = JSON.parse(localStorage.getItem("inventory") || "{}");
      const nonZeroOres = Object.entries(inventory).filter(([_, v]) => parseFloat(v) > 0);
      if (nonZeroOres.length === 0) return;

      // --- Section totals ---
      const sections = [
        { name: "Limited Ores", id: "stats-av-limited" },
        { name: "Special Ores", id: "stats-av-special" },
        { name: "Market Ores", id: "stats-av-market" },
        { name: "Scary Caverns - 600m", id: "stats-av-scary" },
        { name: "Azure Caverns - 1000m", id: "stats-av-azure" },
        { name: "Underworld - 2000m", id: "stats-av-underworld" },
        { name: "Radioactive Zone - 3000m", id: "stats-av-radioactive" },
        { name: "Dreamscape / Abyss - 4000m+", id: "stats-av-dreamscape" }
      ];

      const sectionFields = sections.map(s => {
        const el = document.getElementById(s.id);
        const val = el ? el.textContent.trim() : "0.00";
        return { name: s.name, value: `${val} AV`, inline: true };
      });

      // --- Individual ores (split into safe chunks of 25) ---
      const oreFields = nonZeroOres.map(([ore, count]) => ({
        name: ore,
        value: count.toString(),
        inline: true
      }));

      const oreChunks = chunkArray(oreFields, 25);
      const now = new Date().toLocaleString();

      // --- Build embeds ---
      const embeds = [];

      // Embed #1 — overview + section totals
      embeds.push({
        title: "🧱 Inventory Data Synced",
        color: 0x4a90e2,
        fields: [
          { name: "📊 Section AV Totals", value: "—", inline: false },
          ...sectionFields
        ],
        footer: { text: `${userTag} • ${now}` }
      });

      // Additional embeds — ores split by 25 fields per embed
      oreChunks.forEach((chunk, index) => {
        embeds.push({
          title: `📦 Individual Ores (Part ${index + 1})`,
          color: 0x3498db,
          fields: chunk,
          footer: { text: `${userTag} • ${now}` }
        });
      });

      // --- Always send a new webhook message (no logs) ---
      await fetch(WEBHOOK_URL + "?wait=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds })
      });

    } catch (err) {
      // Silent catch — no console output
    }
  }

  // --- Reset inactivity timer on user input ---
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      sendWebhook();
    }, INACTIVITY_DELAY);
  }

  // Reset timer whenever the user updates inventory values
  document.addEventListener("input", e => {
    if (e.target.matches('input[type="number"][data-ore]')) {
      resetInactivityTimer();
    }
  });

  // Send immediately on page load + start inactivity timer
  window.addEventListener("DOMContentLoaded", () => {
 
    resetInactivityTimer();
  });
})();