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

        const tableWrapper = document.createElement('div');
        tableWrapper.classList.add('table-responsive');

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
        tableWrapper.appendChild(table);
        dataContainer.appendChild(tableWrapper);

        // Pagination UI
        const paginationWrapper = document.createElement('div');
        paginationWrapper.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mt-3');

        // Entries info text
        const entriesInfo = document.createElement('div');
        entriesInfo.id = 'entries-info';
        entriesInfo.textContent = 'Showing 1 to 10 of ' + data.length + ' entries';

        // Pagination controls
        const paginationControls = document.createElement('div');
        paginationControls.id = 'pagination-controls';
        paginationControls.classList.add('pagination');

        paginationWrapper.appendChild(entriesInfo);
        paginationWrapper.appendChild(paginationControls);
        dataContainer.appendChild(paginationWrapper);

        // Enable search and pagination
        setupSearch();
        setupPagination(data, headers);
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
    function setupPagination(data, headers) {
        const table = document.getElementById('dynamic-table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const dropdown = document.getElementById('dt-length-0');
        const paginationControls = document.getElementById('pagination-controls');
        const entriesInfo = document.getElementById('entries-info');

        let pageSize = parseInt(dropdown.value);
        let currentPage = 1;
        let totalPages = Math.ceil(rows.length / pageSize);

        function paginate() {
            pageSize = parseInt(dropdown.value);
            totalPages = Math.ceil(rows.length / pageSize);
            updatePagination();
        }

        function updatePagination() {
            tbody.innerHTML = '';

            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;

            rows.slice(start, end).forEach(row => tbody.appendChild(row));

            entriesInfo.textContent = `Showing ${start + 1} to ${Math.min(end, rows.length)} of ${rows.length} entries`;
            updatePaginationControls();
        }

        function updatePaginationControls() {
            paginationControls.innerHTML = '';

            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.classList.add('page-item', 'btn', 'btn-light');
                pageBtn.textContent = i;
                pageBtn.setAttribute('aria-label', `Go to page ${i}`);

                if (i === currentPage) {
                    pageBtn.classList.add('active');
                    pageBtn.setAttribute('aria-current', 'page');
                }

                pageBtn.addEventListener('click', () => {
                    currentPage = i;
                    updatePagination();
                });

                paginationControls.appendChild(pageBtn);
            }
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
