document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('data-container');
    const jsonUrl = dataContainer.getAttribute('data-json-url');
    const headers = dataContainer.getAttribute('data-headers');
    const headerNamesAttr = dataContainer.getAttribute('data-header-names');

    if (!jsonUrl || !headers) {
        console.error('Missing JSON URL or headers in data-container attributes.');
        dataContainer.textContent = 'Error: Data source missing.';
        return;
    }

    // Define headerArray and headerDisplayNames
    const headerArray = headers.split(',').map(header => header.trim());
    let headerDisplayNames = {};
    
    try {
        if (headerNamesAttr) {
            headerDisplayNames = JSON.parse(headerNamesAttr);
        }
    } catch (error) {
        console.error('Error parsing data-header-names:', error);
    }

    let originalData = []; // Store original unfiltered data
    let filteredData = []; // Store search-filtered data
    let currentPage = 1;
    let pageSize = 10;

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            originalData = data;
            filteredData = [...originalData]; // Start with full data
            renderTable(filteredData, headerArray);
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
            
            // Use custom header name if available, otherwise use original header
            const displayName = headerDisplayNames[headerText] || headerText;
            button.textContent = displayName;
            button.setAttribute('aria-label', `Sort by ${displayName}`);
            button.addEventListener('click', () => sortTable(headers.indexOf(headerText)));

            th.appendChild(button);
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Table Body
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        dataContainer.appendChild(tableWrapper);

        // Pagination UI
        const paginationWrapper = document.createElement('div');
        paginationWrapper.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mt-3');

        // Entries info text
        const entriesInfo = document.createElement('div');
        entriesInfo.id = 'entries-info';

        // Pagination controls
        const paginationControls = document.createElement('div');
        paginationControls.id = 'pagination-controls';
        paginationControls.classList.add('pagination');

        paginationWrapper.appendChild(entriesInfo);
        paginationWrapper.appendChild(paginationControls);
        dataContainer.appendChild(paginationWrapper);

        setupSearch();
        setupPagination();
        updateTable();
    }

    // 🔹 Search Functionality
    function setupSearch() {
        const searchInput = document.getElementById('dt-search-0');

        searchInput.addEventListener('input', function () {
            const filter = searchInput.value.toLowerCase();

            // Filter data based on search
            filteredData = originalData.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(filter)
                )
            );

            // Reset to page 1 after filtering
            currentPage = 1;
            updateTable();
        });
    }

    // 🔹 Pagination Functionality
    function setupPagination() {
        const dropdown = document.getElementById('dt-length-0');
        dropdown.addEventListener('change', function () {
            pageSize = parseInt(dropdown.value);
            currentPage = 1; // Reset to first page
            updateTable();
        });
    }

    function updateTable() {
        const table = document.getElementById('dynamic-table');
        const tbody = table.querySelector('tbody');
        const paginationControls = document.getElementById('pagination-controls');
        const entriesInfo = document.getElementById('entries-info');

        tbody.innerHTML = '';

        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const paginatedData = filteredData.slice(start, end);

        paginatedData.forEach(item => {
            const row = document.createElement('tr');
            headerArray.forEach(headerKey => {
                const td = document.createElement('td');
                td.textContent = item[headerKey] || 'N/A';
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });

        entriesInfo.textContent = `Showing ${start + 1} to ${Math.min(end, filteredData.length)} of ${filteredData.length} entries`;
        updatePaginationControls();
    }

    function updatePaginationControls() {
        const paginationControls = document.getElementById('pagination-controls');
        paginationControls.innerHTML = '';

        const totalPages = Math.ceil(filteredData.length / pageSize);

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
                updateTable();
            });

            paginationControls.appendChild(pageBtn);
        }
    }

    // 🔹 Sorting Functionality
    function sortTable(columnIndex) {
        const isAscending = dataContainer.dataset.sortOrder !== 'asc';
        dataContainer.dataset.sortOrder = isAscending ? 'asc' : 'desc';

        filteredData.sort((a, b) => {
            const cellA = a[headerArray[columnIndex]] || "";
            const cellB = b[headerArray[columnIndex]] || "";

            return isAscending
                ? cellA.toString().localeCompare(cellB.toString())
                : cellB.toString().localeCompare(cellA.toString());
        });

        updateTable();
    }
});