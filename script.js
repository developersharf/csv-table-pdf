document.getElementById('csvFileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                if (results && results.data && results.data.length > 0) {
                    generateTable(results.data);
                } else {
                    alert('No data found in CSV file.');
                }
            },
            error: function(error) {
                alert('Error parsing CSV file: ' + error.message);
            }
        });
    } else {
        alert('No file selected.');
    }
}

function generateTable(data) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';  // Clear previous content

    const table = document.createElement('table');
    
    // Create table headers
    const headers = Object.keys(data[0]);
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    // Add extra column for "Generate PDF" button
    const pdfHeader = document.createElement('th');
    pdfHeader.textContent = 'Generate PDF';
    headerRow.appendChild(pdfHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header] || '';  // Handle missing values
            tr.appendChild(td);
        });

        // Add "Generate PDF" button for each row
        const pdfButton = document.createElement('button');
        pdfButton.textContent = 'Download PDF';
        pdfButton.addEventListener('click', () => generatePDF(row, headers));

        const pdfTd = document.createElement('td');
        pdfTd.appendChild(pdfButton);
        tr.appendChild(pdfTd);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

function generatePDF(rowData, headers) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    headers.forEach((header, index) => {
        doc.text(`${header}: ${rowData[header] || 'N/A'}`, 10, 10 + (10 * index));
    });

    doc.save(`row-data-${Date.now()}.pdf`);
}
