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
      table.classList.add("table", "table-striped", "sortable-table"); // Bootstrap + Custom Class

      // Create Table Header
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");

      headerArray.forEach((headerText, index) => {
        const th = document.createElement("th");
        th.textContent = headerText;
        th.setAttribute("scope", "col");
        th.classList.add("sortable");

        // Add Click Event for Sorting
        th.addEventListener("click", () => sortTable(index));

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

      // Add Filter Input
      const filterInput = document.createElement("input");
      filterInput.setAttribute("type", "text");
      filterInput.setAttribute("placeholder", "Filter results...");
      filterInput.classList.add("table-filter");
      filterInput.addEventListener("keyup", () => filterTable());

      dataContainer.insertBefore(filterInput, table);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      dataContainer.textContent = "Failed to load data.";
    });

  // Sorting Function
  function sortTable(columnIndex) {
    const table = document.querySelector(".sortable-table tbody");
    const rows = Array.from(table.querySelectorAll("tr"));

    const isAscending = table.dataset.order === "asc";
    table.dataset.order = isAscending ? "desc" : "asc";

    rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[columnIndex].textContent.trim();
      const cellB = rowB.cells[columnIndex].textContent.trim();

      return isAscending
        ? cellA.localeCompare(cellB, undefined, { numeric: true })
        : cellB.localeCompare(cellA, undefined, { numeric: true });
    });

    rows.forEach(row => table.appendChild(row));
  }

  // Filtering Function
  function filterTable() {
    const input = document.querySelector(".table-filter");
    const filter = input.value.toLowerCase();
    const rows = document.querySelectorAll(".sortable-table tbody tr");

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(filter) ? "" : "none";
    });
  }
});
