document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('data-container');
    const jsonUrl = dataContainer.getAttribute('data-json-url');
    const headers = dataContainer.getAttribute('data-headers');

    if (!jsonUrl || !headers) {
        console.error('Missing required attributes for JSON URL or headers.');
        dataContainer.textContent = 'Error: Missing data configuration.';
        return;
    }

    const headerArray = headers.split(',').map(header => header.trim());

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            // Create the table structure
            const tableWrapper = document.createElement('div');
            tableWrapper.classList.add('table-responsive');
            
            const table = document.createElement('table');
            table.classList.add('table', 'table-striped', 'sortable');
            table.setAttribute('id', 'dynamic-table');

            // Table Head
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            headerArray.forEach(headerText => {
                const th = document.createElement('th');
                th.innerHTML = `<button>${headerText}<span aria-hidden="true"></span></button>`;
                th.setAttribute('scope', 'col');
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Table Body
            const tbody = document.createElement('tbody');
            data.forEach(item => {
                const row = document.createElement('tr');
                headerArray.forEach(headerKey => {
                    const td = document.createElement('td');
                    td.textContent = item[headerKey] || 'N/A';
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            tableWrapper.appendChild(table);
            dataContainer.appendChild(tableWrapper);

            // Search Functionality
            const searchInput = document.getElementById('dt-search-0');
            searchInput.addEventListener('keyup', function () {
                const filter = searchInput.value.toLowerCase();
                const rows = tbody.getElementsByTagName('tr');

                for (let row of rows) {
                    let textContent = row.textContent.toLowerCase();
                    row.style.display = textContent.includes(filter) ? '' : 'none';
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            dataContainer.textContent = 'Failed to load data.';
        });
});
