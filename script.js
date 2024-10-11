document.getElementById('csvFileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        console.log('File selected:', file); // Debugging line
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,  // Skips empty lines to avoid rendering issues
            complete: function(results) {
                console.log('Parsing complete:', results); // Debugging line to check results
                if (results && results.data && results.data.length > 0) {
                    generateTable(results.data);
                } else {
                    alert('No data found in CSV file');
                    console.log('No data found in CSV file'); // Debugging line
                }
            },
            error: function(error) {
                alert('Error parsing CSV file: ' + error.message);
                console.log('Error parsing CSV file:', error); // Debugging line
            }
        });
    } else {
        console.log('No file selected'); // Debugging line
    }
}

function generateTable(data) {
    console.log('Generating table with data:', data); // Debugging line to verify data

    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';  // Clear previous content

    const table = document.createElement('table');
    
    // Create the table headers
    const headers = Object.keys(data[0]);
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    // Add an extra column for PDF button
    const pdfColumn = document.createElement('th');
    pdfColumn.textContent = 'Generate PDF';
    headerRow.appendChild(pdfColumn);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    data.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header] || '';  // Handle missing/undefined values
            tr.appendChild(td);
        });

        // Add PDF generation button for each row
        const pdfBtn = document.createElement('button');
        pdfBtn.textContent = 'Download PDF';
        pdfBtn.addEventListener('click', () => generatePDF(row, headers));
        const pdfTd = document.createElement('td');
        pdfTd.appendChild(pdfBtn);
        tr.appendChild(pdfTd);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

function generatePDF(rowData, headers) {
    console.log('Generating PDF for row:', rowData); // Debugging line

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    headers.forEach((header, index) => {
        doc.text(`${header}: ${rowData[header] || 'N/A'}`, 10, 10 + (10 * index));
    });

    doc.save(`row-data-${Date.now()}.pdf`);
}
