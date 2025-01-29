document.addEventListener("DOMContentLoaded", () => {
    const dataContainer = document.getElementById("data-container");

    if (!dataContainer) {
        console.error("Error: #data-container not found.");
        return;
    }

    // Get JSON URL & Headers
    const jsonUrl = dataContainer.getAttribute("data-json-url");
    const headers = dataContainer.getAttribute("data-headers");

    if (!jsonUrl || !headers) {
        console.error("Missing required data attributes.");
        dataContainer.textContent = "Error: No data URL or headers specified.";
        return;
    }

    const headerArray = headers.split(",").map(header => header.trim());

    // Create the table structure
    const table = document.createElement("table");
    table.classList.add("table", "table-striped", "table-bordered", "table-hover", "w-100"); // Bootstrap table styles

    // Create table caption for accessibility
    const caption = document.createElement("caption");
    caption.innerHTML = `Sortable Table <span class="sr-only"> (Use headings to sort columns) </span>`;
    table.appendChild(caption);

    // Create table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    headerArray.forEach((headerText, index) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.classList.add("text-start", "fw-bold"); // Bootstrap text alignment & bold header

        // Create button for sorting
        const button = document.createElement("button");
        button.textContent = headerText;
        button.setAttribute("data-column-index", index);
        button.setAttribute("aria-sort", "none");
        button.setAttribute("aria-label", `Sort by ${headerText}`);
        button.classList.add("sort-btn");

        th.appendChild(button);
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    // Fetch JSON data
    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            // Populate rows from JSON data
            data.forEach(item => {
                const row = document.createElement("tr");

                headerArray.forEach(headerKey => {
                    const td = document.createElement("td");
                    td.textContent = item[headerKey] || "N/A";
                    row.appendChild(td);
                });

                tbody.appendChild(row);
            });

            // Append the table to the container
            dataContainer.appendChild(table);

            // Initialize sorting functionality
            initializeSorting();
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            dataContainer.textContent = "Failed to load data.";
        });

    function initializeSorting() {
        document.querySelectorAll(".sort-btn").forEach(button => {
            button.addEventListener("click", function () {
                const columnIndex = this.dataset.columnIndex;
                const currentSort = this.getAttribute("aria-sort");
                let newSort = "ascending";

                if (currentSort === "ascending") {
                    newSort = "descending";
                } else if (currentSort === "descending") {
                    newSort = "none";
                }

                this.setAttribute("aria-sort", newSort);
                sortTable(columnIndex, newSort);
            });

            button.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    this.click();
                }
            });
        });
    }

    function sortTable(columnIndex, order) {
        const rows = Array.from(tbody.rows);
        let sortedRows;

        if (order === "ascending") {
            sortedRows = rows.sort((a, b) =>
                a.cells[columnIndex].textContent.localeCompare(b.cells[columnIndex].textContent, undefined, { numeric: true })
            );
        } else if (order === "descending") {
            sortedRows = rows.sort((a, b) =>
                b.cells[columnIndex].textContent.localeCompare(a.cells[columnIndex].textContent, undefined, { numeric: true })
            );
        } else {
            return;
        }

        tbody.innerHTML = "";
        sortedRows.forEach(row => tbody.appendChild(row));
    }
});
