class ResultsTable {
    displayResults(algorithm, results) {
        const tableBody = document.getElementById(`${algorithm}-body`);
        if (!tableBody) {
            console.error(`No se encontró la tabla para ${algorithm}`);
            return;
        }
        
        tableBody.innerHTML = '';
        
        results.processes.forEach(process => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${process.name}</strong></td>
                <td>${process.ti}</td>
                <td>${process.t}</td>
                <td class="result-value">${process.tf.toFixed(2)}</td>
                <td class="result-value">${process.T.toFixed(2)}</td>
                <td class="result-value">${process.E.toFixed(2)}</td>
                <td class="result-value">${process.I.toFixed(3)}</td>
            `;
            tableBody.appendChild(row);
        });
        
        this.updateAverages(algorithm, results.averages);
    }

    updateAverages(algorithm, averages) {
        const avgT = document.getElementById(`${algorithm}-avg-T`);
        const avgE = document.getElementById(`${algorithm}-avg-E`);
        const avgI = document.getElementById(`${algorithm}-avg-I`);
        
        if (avgT) avgT.textContent = averages.T.toFixed(2);
        if (avgE) avgE.textContent = averages.E.toFixed(2);
        if (avgI) avgI.textContent = averages.I.toFixed(3);
    }
}

export default ResultsTable;