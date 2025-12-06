// js/ui/ResultsManager.js
class ResultsManager {
    static displayResults(algorithm, results) {
        const tableBody = document.getElementById(`${algorithm}-body`);
        if (!tableBody) {
            console.error(`No se encontró tabla para ${algorithm}`);
            return false;
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
        
        ResultsManager.updateAverages(algorithm, results.averages);
        return true;
    }

    static updateAverages(algorithm, averages) {
        const avgT = document.getElementById(`${algorithm}-avg-T`);
        const avgE = document.getElementById(`${algorithm}-avg-E`);
        const avgI = document.getElementById(`${algorithm}-avg-I`);
        
        if (avgT) avgT.textContent = averages.T.toFixed(2);
        if (avgE) avgE.textContent = averages.E.toFixed(2);
        if (avgI) avgI.textContent = averages.I.toFixed(3);
    }

    static updateExecutionTimes(fifoResults, lifoResults, rrResults) {
        const fifoTime = document.getElementById('fifo-time');
        const lifoTime = document.getElementById('lifo-time');
        const rrTime = document.getElementById('rr-time');
        
        if (fifoTime) fifoTime.textContent = `Tiempo: ${fifoResults.executionTime.toFixed(2)} ms`;
        if (lifoTime) lifoTime.textContent = `Tiempo: ${lifoResults.executionTime.toFixed(2)} ms`;
        if (rrTime) rrTime.textContent = `Tiempo: ${rrResults.executionTime.toFixed(2)} ms`;
    }

    static displayComparison(comparison) {
        const bestT = document.getElementById('best-t-result');
        const bestE = document.getElementById('best-e-result');
        const bestI = document.getElementById('best-i-result');
        const overallBest = document.getElementById('overall-best-result');
        
        if (bestT) bestT.textContent = comparison.bestT;
        if (bestE) bestE.textContent = comparison.bestE;
        if (bestI) bestI.textContent = comparison.bestI;
        if (overallBest) overallBest.textContent = comparison.overall;
    }

    static highlightBestMethod(method) {
        document.querySelectorAll('.algorithm-section').forEach(section => {
            section.style.boxShadow = '0 10px 30px rgba(138, 107, 184, 0.15)';
            section.style.border = '2px solid #f0e6ff';
            
            const badge = section.querySelector('.best-badge');
            if (badge) badge.remove();
        });
        
        const bestSection = document.getElementById(`${method.toLowerCase()}-section`);
        if (bestSection) {
            bestSection.style.boxShadow = '0 15px 40px rgba(106, 17, 203, 0.3)';
            bestSection.style.border = '2px solid #6a11cb';
            
            const badge = document.createElement('div');
            badge.className = 'best-badge';
            badge.innerHTML = '<i class="fas fa-crown"></i> Mejor método';
            bestSection.appendChild(badge);
        }
    }

    static updateProcessCount(count) {
        const countElement = document.createElement('div');
        countElement.className = 'process-count';
        countElement.innerHTML = `<i class="fas fa-list-ol"></i> ${count} procesos`;
        
        let existingCount = document.querySelector('.process-count');
        if (existingCount) {
            existingCount.remove();
        }
        
        const configSection = document.querySelector('.config-section');
        if (configSection) {
            configSection.appendChild(countElement);
        }
    }
}