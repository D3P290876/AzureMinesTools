let ambrosiaCount = parseInt(localStorage.getItem("ambrosiaCount")) || 50;
    let nihiliumCount1 = parseInt(localStorage.getItem("nihiliumCount1")) || 50;
    let nihiliumCount2 = parseInt(localStorage.getItem("nihiliumCount2")) || 50;

    const ambrosiaTable = document.getElementById('ambrosia-table');
    const nihiliumTable1 = document.getElementById('nihilium-table');
    const nihiliumTable2 = document.getElementById('nihilium-table-2');


    function addRow(type, tableNum = 1) {
      if (type === 'ambrosia') {
        ambrosiaCount++;
        localStorage.setItem("ambrosiaCount", ambrosiaCount);
        renderRow(ambrosiaTable, 'Ambrosia', ambrosiaCount);
      } else if (type === 'nihilium' && tableNum === 1) {
        nihiliumCount1++;
        localStorage.setItem("nihiliumCount1", nihiliumCount1);
        renderRow(nihiliumTable1, 'Nihilium', nihiliumCount1, 1);
      } else if (type === 'nihilium' && tableNum === 2) {
        nihiliumCount2++;
        localStorage.setItem("nihiliumCount2", nihiliumCount2);
        renderRow(nihiliumTable2, 'Nihilium', nihiliumCount2, 2);
      }
    }


    function renderRow(table, label, index, tableNum = 1) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td style="padding-left: 8px;">${label} #${index}</td>
        <td><input type="text" name="${label.toLowerCase()}-date-${tableNum}-${index}" /></td>
        <td><input type="text" name="${label.toLowerCase()}-depth-${tableNum}-${index}" /></td>
      `;
      table.appendChild(row);


      // Restore saved values if any
      setTimeout(() => {
        const dateInput = document.getElementsByName(`${label.toLowerCase()}-date-${tableNum}-${index}`)[0];
        const depthInput = document.getElementsByName(`${label.toLowerCase()}-depth-${tableNum}-${index}`)[0];
        dateInput.value = localStorage.getItem(dateInput.name) || "";
        depthInput.value = localStorage.getItem(depthInput.name) || "";


        dateInput.addEventListener("input", () => {
          localStorage.setItem(dateInput.name, dateInput.value);
        });
        depthInput.addEventListener("input", () => {
          localStorage.setItem(depthInput.name, depthInput.value);
        });
      }, 0);
    }


    function removeRow(type, tableNum = 1) {
      if (type === 'ambrosia' && ambrosiaCount > 0) {
        if (ambrosiaTable.rows.length > 1) {
          ambrosiaTable.deleteRow(ambrosiaTable.rows.length - 1);
          // Remove saved values for the last row
          localStorage.removeItem(`ambrosia-date-1-${ambrosiaCount}`);
          localStorage.removeItem(`ambrosia-depth-1-${ambrosiaCount}`);
          ambrosiaCount--;
          localStorage.setItem("ambrosiaCount", ambrosiaCount);
        }
      } else if (type === 'nihilium' && tableNum === 1 && nihiliumCount1 > 0) {
        if (nihiliumTable1.rows.length > 1) {
          nihiliumTable1.deleteRow(nihiliumTable1.rows.length - 1);
          localStorage.removeItem(`nihilium-date-1-${nihiliumCount1}`);
          localStorage.removeItem(`nihilium-depth-1-${nihiliumCount1}`);
          nihiliumCount1--;
          localStorage.setItem("nihiliumCount1", nihiliumCount1);
        }
      } else if (type === 'nihilium' && tableNum === 2 && nihiliumCount2 > 0) {
        if (nihiliumTable2.rows.length > 1) {
          nihiliumTable2.deleteRow(nihiliumTable2.rows.length - 1);
          localStorage.removeItem(`nihilium-date-2-${nihiliumCount2}`);
          localStorage.removeItem(`nihilium-depth-2-${nihiliumCount2}`);
          nihiliumCount2--;
          localStorage.setItem("nihiliumCount2", nihiliumCount2);
        }
      }
    }


    // Initial Load
    for (let i = 1; i <= ambrosiaCount; i++) {
      renderRow(ambrosiaTable, 'Ambrosia', i);
    }
    for (let i = 1; i <= nihiliumCount1; i++) {
      renderRow(nihiliumTable1, 'Nihilium', i, 1);
    }
    for (let i = 1; i <= nihiliumCount2; i++) {
      renderRow(nihiliumTable2, 'Nihilium', i, 2);
    }


    function showResetModal() {
      document.getElementById('reset-modal').style.display = 'flex';
    }
    function hideResetModal() {
      document.getElementById('reset-modal').style.display = 'none';
    }
    function doReset() {
      // Clear localStorage
      localStorage.clear();

      // Remove all rows except headers
      [ambrosiaTable, nihiliumTable1, nihiliumTable2].forEach(table => {
        while (table.rows.length > 1) {
          table.deleteRow(1);
        }
      });

      // Reset counts and re-render initial rows
      ambrosiaCount = 50;
      nihiliumCount1 = 50;
      nihiliumCount2 = 50;
      for (let i = 1; i <= ambrosiaCount; i++) {
        renderRow(ambrosiaTable, 'Ambrosia', i);
      }
      for (let i = 1; i <= nihiliumCount1; i++) {
        renderRow(nihiliumTable1, 'Nihilium', i, 1);
      }
      for (let i = 1; i <= nihiliumCount2; i++) {
        renderRow(nihiliumTable2, 'Nihilium', i, 2);
      }
      hideResetModal();
    }