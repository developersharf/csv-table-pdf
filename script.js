document.getElementById('csvFileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        Papa.parse(file, {
            header: true,
            complete: function(results) {
                generateTable(results.data);
            }
        });
    }
}

function generateTable(data) {
    const tableContainer = document.getElementById('tableContainer');
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
            td.textContent = row[header];
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
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}

function generatePDF(rowData, headers) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    headers.forEach((header, index) => {
        doc.text(`${header}: ${rowData[header]}`, 10, 10 + (10 * index));
    });

    doc.save('row-data.pdf');
}
