document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('data-container');

    // Get the JSON URL from the `data-json-url` attribute
    const jsonUrl = dataContainer.getAttribute('data-json-url');
    const headers = dataContainer.getAttribute('data-headers');

    if (!jsonUrl) {
        console.error('No JSON URL specified in data-json-url attribute.');
        dataContainer.textContent = 'No data URL specified.';
        return;
    }

    if (!headers) {
        console.error('No headers specified in data-headers attribute.');
        dataContainer.textContent = 'No headers specified.';
        return;
    }

    // Parse the headers from the data-headers attribute
    const headerArray = headers.split(',').map(header => header.trim());

    // Clear the container in case of old content
    dataContainer.innerHTML = '';

    // Fetch the JSON data
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Create the table element
            const table = document.createElement('table');
            table.classList.add('table', 'table-striped'); // Add state template classes

            // Create table headers dynamically
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');

            headerArray.forEach(headerText => {
                const th = document.createElement('th');
                th.setAttribute('scope', 'col');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Create the table body
            const tbody = document.createElement('tbody');

            // Populate rows from JSON data
            data.forEach(item => {
                const row = document.createElement('tr');

                // Add cells based on the specified headers
                headerArray.forEach(headerKey => {
                    const td = document.createElement('td');
                    td.textContent = item[headerKey] || 'N/A'; // Match key from JSON, or use 'N/A' if missing
                    row.appendChild(td);
                });

                tbody.appendChild(row);
            });

            table.appendChild(tbody);

            // Append the table to the container
            dataContainer.appendChild(table);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            dataContainer.textContent = 'Failed to load data.';
        });
});
