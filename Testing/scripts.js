document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('rebarTable').addEventListener('click', function(event) {
        if (event.target.className === 'deleteButton') {
            deleteRow(event.target);
        }
    });
});

function addRow() {
    const table = document.getElementById('rebarTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td><input type="number" name="diameter[]" min="1"></td>
        <td><input type="number" name="length[]" min="0.1" step="0.1"></td>
        <td><input type="number" name="number[]" min="1"></td>
        <td class="totalWeight">-</td>
        <td><button class="deleteButton">Delete</button></td>
    `;
}

function deleteRow(button) {
    button.parentElement.parentElement.remove();
}

function calculateTotalWeight() {
    const rows = document.querySelectorAll('#rebarTable tbody tr');
    let totalWeight = 0;
    rows.forEach(row => {
        const diameter = parseFloat(row.cells[0].getElementsByTagName('input')[0].value);
        const length = parseFloat(row.cells[1].getElementsByTagName('input')[0].value);
        const number = parseFloat(row.cells[2].getElementsByTagName('input')[0].value);
        const weightPerMeter = calculateWeightPerMeter(diameter);
        const weight = weightPerMeter * length * number;
        row.cells[3].textContent = weight.toFixed(2);
        totalWeight += weight;
    });
    document.getElementById('totalWeight').textContent = totalWeight.toFixed(2);
}

function calculateWeightPerMeter(diameter) {
    const radius = diameter / 2;
    const area = Math.PI * radius * radius / (1000 * 1000); // Convert mm^2 to m^2
    return area * 7850; // Density of steel: 7850 kg/m^3
}
