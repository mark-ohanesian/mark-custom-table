document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('data-container');
    const jsonUrl = dataContainer.getAttribute('data-json-url');
    const headers = dataContainer.getAttribute('data-headers');

    if (!jsonUrl || !headers) {
        console.error('Missing JSON URL or headers in data-container attributes.');
        dataContainer.textContent = 'Error: Data source missing.';
        return;
    }

    const headerArray = headers.split(',').map(header => header.trim());

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            renderTable(data, headerArray);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            dataContainer.textContent = 'Failed to load data.';
        });

    function renderTable(data, headers) {
        dataContainer.innerHTML = '';

        const table = document.createElement('table');
        table.classList.add('table', 'table-striped', 'sortable');
        table.setAttribute('id', 'dynamic-table');

        // Table Head
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        headers.forEach(headerText => {
            const th = document.createElement('th');
            const button = document.createElement('button');

            button.textContent = headerText;
            button.setAttribute('aria-label', `Sort by ${headerText}`);
            button.addEventListener('click', () => sortTable(headers.indexOf(headerText)));

            th.appendChild(button);
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Table Body
        const tbody = document.createElement('tbody');
        data.forEach(item => {
            const row = document.createElement('tr');
            headers.forEach(headerKey => {
                const td = document.createElement('td');
                td.textContent = item[headerKey] || 'N/A';
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        dataContainer.appendChild(table);

        // Enable search and pagination
        setupSearch();
        setupPagination();
    }

    // 🔹 Search Functionality
    function setupSearch() {
        const searchInput = document.getElementById('dt-search-0');
        searchInput.addEventListener('input', function () {
            const filter = searchInput.value.toLowerCase();
            const rows = document.querySelectorAll('#dynamic-table tbody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(filter) ? '' : 'none';
            });
        });
    }

    // 🔹 Pagination Functionality
    function setupPagination() {
        const table = document.getElementById('dynamic-table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const dropdown = document.getElementById('dt-length-0');

        function paginate() {
            const pageSize = parseInt(dropdown.value);
            rows.forEach((row, index) => {
                row.style.display = index < pageSize ? '' : 'none';
            });
        }

        dropdown.addEventListener('change', paginate);
        paginate(); // Initial pagination
    }

    // 🔹 Sorting Functionality
    function sortTable(columnIndex) {
        const table = document.getElementById('dynamic-table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        const isAscending = table.dataset.sortOrder !== 'asc';
        table.dataset.sortOrder = isAscending ? 'asc' : 'desc';

        rows.sort((rowA, rowB) => {
            const cellA = rowA.cells[columnIndex].textContent.trim().toLowerCase();
            const cellB = rowB.cells[columnIndex].textContent.trim().toLowerCase();

            return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        });

        rows.forEach(row => tbody.appendChild(row));
    }
});
