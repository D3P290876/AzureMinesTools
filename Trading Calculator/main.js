// Use oreValues from OreValues.js
    const oreData = {};
    for (const [ore, data] of Object.entries(window.oreValues)) {
      oreData[ore] = data.AV;
    }

    const oreRowsContainer = document.getElementById('ore-rows');
    const outputOreSelect = document.getElementById('output-ore');
    const multiplierInput = document.getElementById('multiplier');

    // Populate dropdowns
    function createOreDropdown() {
      const select = document.createElement('select');
      const noneOption = document.createElement('option');
      noneOption.value = '';
      noneOption.textContent = 'None';
      select.appendChild(noneOption);

      for (let ore in oreData) {
        const option = document.createElement('option');
        option.value = ore;
        option.textContent = ore;
        select.appendChild(option);
      }

      return select;
    }

    // Store references to value displays for total calculation
    const valueDisplays = [];

    function formatValue(val) {
      if (val === 0) return '0';

      // Step 1: Round to 3 decimal places
      const rounded3 = Math.round(val * 1000) / 1000;

      // Step 2: Round that to a whole number
      const rounded0 = Math.round(rounded3);

      // If rounded value is less than 100, show 1 decimal from rounded3
      if (rounded0 < 100) {
    const oneDecimal = Math.round(rounded3 * 10) / 10;
    return oneDecimal.toString().replace(/\.0$/, '');
      }

      // If rounded value is 100 or greater, show the whole number
      return rounded0.toString();
    }

    // Modify createRow to push valueDisplay to valueDisplays
    function createRow(selectedOre) {
      const tr = document.createElement('tr');

      const oreCell = document.createElement('td');
      const amountCell = document.createElement('td');
      const valueCell = document.createElement('td');
      valueCell.classList.add('value-cell');

      // Show ore name and image, not a dropdown
      const oreDiv = document.createElement('div');
      oreDiv.style.display = 'flex';
      oreDiv.style.alignItems = 'center';

      const img = document.createElement('img');
      img.src = oreImages[selectedOre] || '';
      img.alt = selectedOre;
      img.className = 'ore-img';

      const label = document.createElement('span');
      label.textContent = selectedOre;

      oreDiv.appendChild(img);
      oreDiv.appendChild(label);

      oreCell.appendChild(oreDiv);

      const amountInput = document.createElement('input');
      amountInput.type = 'number';
      amountInput.min = 0;
      amountInput.step = 1;

      const valueDisplay = document.createElement('div');
      valueDisplay.textContent = '';

      amountCell.appendChild(amountInput);
      valueCell.appendChild(valueDisplay);

      tr.appendChild(oreCell);
      tr.appendChild(amountCell);
      tr.appendChild(valueCell);

      valueDisplays.push({ valueDisplay, getValue });

      function getValue() {
        const ore = selectedOre;
        const amount = parseFloat(amountInput.value) || 0;
        const outputOre = outputOreSelect.value;
        if (ore && outputOre && oreData[ore] && oreData[outputOre]) {
          const inputAV = oreData[ore];
          const outputAV = oreData[outputOre];
          return (amount / inputAV) * outputAV;
        }
        return 0;
      }

      function formatValue(val) {
        if (val === 0) return '0';

        // Step 1: Round to 3 decimal places
        const rounded3 = Math.round(val * 1000) / 1000;

        // Step 2: Round to 1 decimal
        const rounded1 = Math.round(rounded3 * 10) / 10;

        // If rounds to 0 but original wasn't zero, show the 3-decimal rounded value
        if (rounded1 === 0 && val !== 0) {
          return rounded3.toString().replace(/\.?0+$/, '');
        }

        return rounded1.toString().replace(/\.?0+$/, '');
      }

      function updateValue() {
        const value = getValue();
        const outputOre = outputOreSelect.value;
        if (value && outputOre) {
          valueDisplay.textContent = formatValue(value) + ' ' + outputOre;
        } else {
          valueDisplay.textContent = '';
        }
        updateTotal();
      }

      amountInput.addEventListener('input', updateValue);
      outputOreSelect.addEventListener('change', updateValue);
      multiplierInput.addEventListener('input', updateValue);

      return tr;
    }

    // Add a row for the total
    function createTotalRow() {
      const tr = document.createElement('tr');
      tr.id = 'total-row';
      const td = document.createElement('td');
      td.colSpan = 3;
      td.style.textAlign = 'right';
      td.style.fontWeight = 'bold';
      td.textContent = 'Total:';
      tr.appendChild(td);
      return tr;
    }

    // Function to update the total value
    function updateTotal() {
      const totalRow = document.getElementById('total-row');
      if (!totalRow) return;
      const outputOre = outputOreSelect.value;
      let total = 0;
      for (const { getValue } of valueDisplays) {
        total += Math.round(getValue() * 100) / 100;
      }
      const multiplier = parseFloat(multiplierInput.value) || 1;
      total *= multiplier;
    
      // Fill the total row with a single cell spanning all columns
      totalRow.innerHTML = '';
      const td = document.createElement('td');
      td.colSpan = 3;
      td.style.textAlign = 'right';
      td.style.fontWeight = 'bold';
      td.id = 'total-value-cell';
      if (outputOreSelect) {
        td.textContent = `Total: ${formatValue(total)} ${outputOre}`;
      } else {
        td.textContent = 'Total:';
      }
      totalRow.appendChild(td);
    }

    // Clear all rows and valueDisplays
    oreRowsContainer.innerHTML = '';
    valueDisplays.length = 0;

    // Add the total row
    oreRowsContainer.appendChild(createTotalRow());

    // Show popup with ore list
    function showOrePopup() {
      const popup = document.getElementById('ore-popup');
      const content = document.getElementById('ore-popup-content');
      content.innerHTML = '<h3 style="margin-top:0;">Select an Ore</h3>';

      // Create grid container
      const grid = document.createElement('div');
      grid.className = 'ore-popup-grid';

      Object.keys(oreData).sort().forEach(ore => {
        const row = document.createElement('div');
        row.className = 'ore-popup-row';

        const img = document.createElement('img');
        img.src = oreImages[ore] || '';
        img.alt = ore;

        const label = document.createElement('span');
        label.textContent = ore;

        row.appendChild(img);
        row.appendChild(label);

        row.onclick = () => {
          popup.style.display = 'none';
          addOreRow(ore);
        };

        grid.appendChild(row);
      });

      // Add the Cancel button as a grid item
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.className = 'ore-popup-cancel-btn';
      cancelBtn.onclick = () => { popup.style.display = 'none'; };

      grid.appendChild(cancelBtn);

      content.appendChild(grid);
      popup.style.display = 'flex';
    }

// Add a new ore input row for the selected ore
function addOreRow(selectedOre) {
  const tr = createRow(selectedOre);
  const totalRow = document.getElementById('total-row');
  oreRowsContainer.insertBefore(tr, totalRow); // Insert before the total row
  updateTotal();
}

    // Populate output ore dropdown
const outputDropdown = createOreDropdown();
while (outputDropdown.firstChild) {
  outputOreSelect.appendChild(outputDropdown.firstChild);
}

// Update total when output ore or multiplier changes
outputOreSelect.addEventListener('change', updateTotal);
multiplierInput.addEventListener('input', updateTotal);

// Initial setup: add the add button row and total row (no default ore rows)

document.getElementById('add-ore-btn').onclick = showOrePopup;
