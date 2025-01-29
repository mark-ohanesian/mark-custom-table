document.addEventListener("DOMContentLoaded", () => {
  const dataContainer = document.getElementById("data-container");

  const jsonUrl = dataContainer.getAttribute("data-json-url");
  const headers = dataContainer.getAttribute("data-headers");

  if (!jsonUrl || !headers) {
    console.error("Missing data-json-url or data-headers attribute.");
    dataContainer.textContent = "No data available.";
    return;
  }

  const headerArray = headers.split(",").map(header => header.trim());

  fetch(jsonUrl)
    .then(response => response.json())
    .then(data => {
      // Create Table
      const table = document.createElement("table");
      table.classList.add("table", "table-striped", "sortable-table");

      // Create Table Header
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");

      headerArray.forEach((headerText, index) => {
        const th = document.createElement("th");
        th.setAttribute("scope", "col");

        // Create a button inside the <th> for keyboard and screen reader support
        const button = document.createElement("button");
        button.classList.add("sort-btn");
        button.setAttribute("type", "button");
        button.setAttribute("tabindex", "0");
        button.setAttribute("aria-label", `Sort by ${headerText}`);
        button.setAttribute("data-column-index", index);
        button.innerHTML = `${headerText} <span class="sort-indicator" aria-hidden="true">⬍</span>`;

        // Add Click & Keydown Event for Sorting
        button.addEventListener("click", () => sortTable(index, button));
        button.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            sortTable(index, button);
          }
        });

        th.appendChild(button);
        headerRow.appendChild(th);
      });

      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Create Table Body
      const tbody = document.createElement("tbody");

      data.forEach(item => {
        const row = document.createElement("tr");

        headerArray.forEach(headerKey => {
          const td = document.createElement("td");
          td.textContent = item[headerKey] || "N/A";
          row.appendChild(td);
        });

        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      dataContainer.appendChild(table);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      dataContainer.textContent = "Failed to load data.";
    });

  // Sorting Function
  function sortTable(columnIndex, button) {
    const table = document.querySelector(".sortable-table tbody");
    const rows = Array.from(table.querySelectorAll("tr"));

    const isAscending = table.dataset.order === "asc";
    table.dataset.order = isAscending ? "desc" : "asc";

    // Update ARIA attributes & indicator
    button.setAttribute("aria-sort", isAscending ? "ascending" : "descending");
    button.querySelector(".sort-indicator").textContent = isAscending ? "⬆" : "⬇";

    rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[columnIndex].textContent.trim();
      const cellB = rowB.cells[columnIndex].textContent.trim();

      return isAscending
        ? cellA.localeCompare(cellB, undefined, { numeric: true })
        : cellB.localeCompare(cellA, undefined, { numeric: true });
    });

    rows.forEach(row => table.appendChild(row));
  }
});
