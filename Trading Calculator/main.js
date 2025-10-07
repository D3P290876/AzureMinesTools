/**************************
     * Trade Calculator Script
     **************************/
    let ores = [];
    let paymentMultiplier = 1;
    let outputOre = "";
    let currentPopupMode = "add";

    const oreRows = document.getElementById("oreRows");
    const totalDisplay = document.getElementById("totalDisplay");
    const paymentMultDisplay = document.getElementById("paymentMultDisplay");
    const outputOreDisplay = document.getElementById("outputOreDisplay");

    /* ========= LOCAL STORAGE ========== */
    window.onload = () => {
      const saved = JSON.parse(localStorage.getItem("tradeData"));
      if (saved) {
        ores = saved.ores || [];
        paymentMultiplier = saved.paymentMultiplier || 1;
        outputOre = saved.outputOre || "";
      }
      renderTable();
      updateDisplays();
    };

    function saveData() {
      localStorage.setItem(
        "tradeData",
        JSON.stringify({ ores, paymentMultiplier, outputOre })
      );
    }

    /* ========= POPUP HANDLER ========== */
    function showOrePopup() {
      const popup = document.getElementById("ore-popup");
      const content = document.getElementById("ore-popup-content");
      const title =
        currentPopupMode === "output"
        ? "Select Output Ore"
        : "Select Input Ore";
    content.innerHTML = `<h3 style="margin-top:0;">${title}</h3>`;

      const grid = document.createElement("div");
      grid.className = "ore-popup-grid";

      Object.keys(window.oreValues)
        .sort()
        .forEach((ore) => {
          const row = document.createElement("div");
          row.className = "ore-popup-row";

          const img = document.createElement("img");
          img.src = window.oreImages[ore] || "";
          img.alt = ore;

          const label = document.createElement("span");
          label.textContent = ore;

          row.appendChild(img);
          row.appendChild(label);

          row.onclick = () => {
            popup.style.display = "none";
            if (currentPopupMode === "add") addOreRow(ore);
            else if (currentPopupMode === "output") {
              outputOre = ore;
              recalc();
              saveData();
            }
          };

          grid.appendChild(row);
        });

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.className = "ore-popup-cancel-btn";
      cancelBtn.onclick = () => (popup.style.display = "none");
      grid.appendChild(cancelBtn);

      content.appendChild(grid);
      popup.style.display = "flex";
    }

    /* ========= DISPLAY FORMATTING ========== */
    function formatWithCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatValue(val) {
  if (val === 0 || isNaN(val)) return "0";

  let rounded;
  if (Math.abs(val) < 1) {
    rounded = Math.round(val * 1000) / 1000; // 3 decimals
  } else if (val < 10) {
    rounded = Math.round(val * 100) / 100; // 2 decimals
  } else if (val < 100) {
    rounded = Math.round(val * 10) / 10; // 1 decimal
  } else {
    rounded = Math.round(val); // Whole number for 100+
  }

  return formatWithCommas(rounded.toString());
}

function formatTotal(val) {
  if (val === 0 || isNaN(val)) return "0";

  let rounded;
  if (val < 10) {
    rounded = Math.round(val * 1000) / 1000; // 3 decimals
  } else if (val < 100) {
    rounded = Math.round(val * 10) / 10; // 1 decimal
  } else {
    rounded = Math.round(val); // Whole number
  }

  return formatWithCommas(rounded.toString());
}

    /* ========= CORE FUNCTIONS ========== */
    function renderTable() {
      oreRows.innerHTML = "";
      ores.forEach((ore, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><img src="${window.oreImages[ore.name]}" class="ore-icon"> ${ore.name}</td>
          <td><input type="number" min="0" value="${ore.amount}" data-index="${i}" class="amountInput"></td>
          <td>${ore.valueDisplay || "—"}</td>
        `;
        oreRows.appendChild(row);
      });

      document.querySelectorAll(".amountInput").forEach((input) => {
        input.addEventListener("input", (e) => {
          const idx = e.target.dataset.index;
          ores[idx].amount = parseFloat(e.target.value) || 0;
          recalc();
          saveData();
        });
      });

      recalc();
    }

    function addOreRow(oreName) {
      const oreBaseValue = window.oreValues[oreName].AV;
      ores.push({
        name: oreName,
        amount: 0,
        valueBase: oreBaseValue,
        valueDisplay: "—",
      });
      renderTable();
      saveData();
    }

    function recalc() {
      if (!outputOre || !window.oreValues[outputOre]) {
        totalDisplay.textContent = "—";
        ores.forEach((ore) => (ore.valueDisplay = "—"));
        renderTableValuesOnly();
        return;
      }

      let total = 0;
      ores.forEach((ore) => {
        const conversion =
  (ore.amount * window.oreValues[outputOre].AV) / ore.valueBase;
        ore.valueDisplay = `${formatValue(conversion)} ${outputOre}`;
        total += conversion;
      });
      total *= paymentMultiplier;

      totalDisplay.innerHTML = `
        ${formatWithCommas(formatTotal(total))} 
        <img src="${window.oreImages[outputOre] || ''}" 
          alt="${outputOre}" 
          class="ore-icon" 
       style="margin-left:6px; vertical-align:middle;">
    `;
      paymentMultDisplay.textContent = paymentMultiplier + "x";
      outputOreDisplay.textContent = outputOre;
      saveData();
      renderTableValuesOnly();
    }

    function renderTableValuesOnly() {
      oreRows.querySelectorAll("tr").forEach((tr, i) => {
        const tds = tr.querySelectorAll("td");
        if (tds[2]) tds[2].innerHTML = ores[i].valueDisplay;
      });
    }

    function updateDisplays() {
      paymentMultDisplay.textContent = paymentMultiplier + "x";
      outputOreDisplay.textContent = outputOre || "—";
      totalDisplay.textContent = "—";
    }

    /* ========= BUTTONS ========== */
    document.getElementById("addOreBtn").addEventListener("click", () => {
      currentPopupMode = "add";
      showOrePopup();
    });

    document.getElementById("setOutputBtn").addEventListener("click", () => {
      currentPopupMode = "output";
      showOrePopup();
    });

    document.getElementById("paymentMultBtn").addEventListener("click", () => {
      const newMult = parseFloat(prompt("Enter payment multiplier:", paymentMultiplier));
      if (!isNaN(newMult) && newMult > 0) {
        paymentMultiplier = newMult;
        recalc();
        saveData();
      }
    });

    document.getElementById("clearDataBtn").addEventListener("click", () => {
      if (confirm("Clear all trade data?")) {
        localStorage.removeItem("tradeData");
        ores = [];
        paymentMultiplier = 1;
        outputOre = "";
        renderTable();
        updateDisplays();
      }
    });