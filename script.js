let globalMatrix = null; // This will store the matrix data from the Excel file
let globalLabels = null; // This will store the labels (first row/column)
let qInput, rInput, maxValueInput, statsTableBody; // Define input variables and statsTableBody

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('input-excel').addEventListener('change', readFile);
    document.getElementById('calculate-button').addEventListener('click', generateNetwork);
    document.getElementById('toggle-labels').addEventListener('change', drawNetwork);

    // Assign input elements to variables
    qInput = document.getElementById('input-q');
    rInput = document.getElementById('input-r');
    maxValueInput = document.getElementById('input-max-value');
    const pathfinderNetworkRadio = document.getElementById('pathfinder-network');
    const nearestNeighborNetworkRadio = document.getElementById('nearest-neighbor-network');
    statsTableBody = document.getElementById('stats-table-body'); // Assign statsTableBody

    const statsTableHeaders = document.querySelectorAll('#stats-table th'); // Table headers

    // Initial toggle based on the default selected radio button
    toggleInputs(document.querySelector('input[name="network-type"]:checked').value);

    // Listen for changes in the selected radio button
    const networkTypeRadios = document.querySelectorAll('input[name="network-type"]');
    networkTypeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            toggleInputs(this.value);
        });
    });

    // Add event listeners to table headers for sorting
    statsTableHeaders.forEach((header, index) => {
        header.addEventListener('click', () => {
            const ascending = !header.classList.contains('sorted-ascending');
            statsTableHeaders.forEach(header => header.classList.remove('sorted-ascending', 'sorted-descending'));
            header.classList.add(ascending ? 'sorted-ascending' : 'sorted-descending');
            sortTable(index, ascending);
        });
    });

});
