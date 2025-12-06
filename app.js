// app.js - TODO EL CÓDIGO EN UN SOLO ARCHIVO

// ========== CLASES ==========
class Process {
    constructor(name, ti, t) {
        this.name = name;
        this.ti = parseInt(ti);
        this.t = parseInt(t);
        this.tf = 0;
        this.T = 0;
        this.E = 0;
        this.I = 0;
        this.remainingTime = parseInt(t);
        this.startTime = null;
        this.originalOrder = 0;
    }
}

class ProcessScheduler {
    constructor() {
        this.processes = [];
        this.defaultData = [
            {name: "A", ti: 2, t: 17},
            {name: "B", ti: 9, t: 47},
            {name: "C", ti: 8, t: 14},
            {name: "D", ti: 7, t: 32},
            {name: "E", ti: 6, t: 48},
            {name: "F", ti: 5, t: 23},
            {name: "G", ti: 40, t: 13},
            {name: "H", ti: 4, t: 37},
            {name: "I", ti: 39, t: 24},
            {name: "J", ti: 38, t: 4},
            {name: "K", ti: 37, t: 25},
            {name: "L", ti: 36, t: 34},
            {name: "M", ti: 35, t: 26},
            {name: "N", ti: 34, t: 38},
            {name: "O", ti: 33, t: 15},
            {name: "P", ti: 32, t: 31},
            {name: "Q", ti: 31, t: 42},
            {name: "R", ti: 30, t: 21},
            {name: "S", ti: 3, t: 45},
            {name: "T", ti: 29, t: 43},
            {name: "U", ti: 28, t: 36},
            {name: "V", ti: 27, t: 22},
            {name: "W", ti: 26, t: 49},
            {name: "X", ti: 25, t: 18},
            {name: "Y", ti: 24, t: 39},
            {name: "Z", ti: 23, t: 27},
            {name: "A1", ti: 22, t: 46},
            {name: "B1", ti: 21, t: 16},
            {name: "C1", ti: 20, t: 30},
            {name: "D1", ti: 19, t: 44},
            {name: "E1", ti: 18, t: 35},
            {name: "F1", ti: 17, t: 20},
            {name: "G1", ti: 16, t: 50},
            {name: "H1", ti: 15, t: 19},
            {name: "I1", ti: 14, t: 33},
            {name: "J1", ti: 13, t: 41},
            {name: "K1", ti: 12, t: 28},
            {name: "L1", ti: 11, t: 40},
            {name: "M1", ti: 10, t: 29}
        ];
    }

    loadDefaultData() {
        this.processes = this.defaultData.map((p, index) => {
            const process = new Process(p.name, p.ti, p.t);
            process.originalOrder = index;
            return process;
        });
        return this.processes;
    }

    loadCSVData(csvText) {
        this.processes = [];
        const lines = csvText.split('\n');
        
        lines.forEach((line, index) => {
            if (line.trim() && index > 0) {
                const parts = line.split(',');
                if (parts.length >= 3) {
                    const name = parts[0].trim();
                    const ti = parseInt(parts[1].trim());
                    const t = parseInt(parts[2].trim());
                    if (name && !isNaN(ti) && !isNaN(t)) {
                        const process = new Process(name, ti, t);
                        process.originalOrder = this.processes.length;
                        this.processes.push(process);
                    }
                }
            }
        });
        
        if (this.processes.length === 0) {
            this.loadDefaultData();
        }
        
        return this.processes;
    }

    calculateFIFO() {
        const startTime = performance.now();
        
        const sortedProcesses = [...this.processes].sort((a, b) => a.ti - b.ti);
        
        let totalT = 0, totalE = 0, totalI = 0;
        
        sortedProcesses.forEach((process, index) => {
            if (index === 0) {
                process.tf = process.ti + process.t;
            } else {
                process.tf = Math.max(process.ti, sortedProcesses[index-1].tf) + process.t;
            }
            
            process.T = process.tf - process.ti;
            process.E = process.T - process.t;
            process.I = process.t / process.T;
            
            totalT += process.T;
            totalE += process.E;
            totalI += process.I;
        });
        
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        return {
            processes: sortedProcesses,
            averages: {
                T: totalT / sortedProcesses.length,
                E: totalE / sortedProcesses.length,
                I: totalI / sortedProcesses.length
            },
            executionTime: executionTime
        };
    }

    calculateLIFO() {
        const startTime = performance.now();
        
        const sortedProcesses = [...this.processes].sort((a, b) => b.ti - a.ti);
        
        let totalT = 0, totalE = 0, totalI = 0;
        
        sortedProcesses.forEach((process, index) => {
            if (index === 0) {
                process.tf = process.ti + process.t;
            } else {
                process.tf = Math.max(process.ti, sortedProcesses[index-1].tf) + process.t;
            }
            
            process.T = process.tf - process.ti;
            process.E = process.T - process.t;
            process.I = process.t / process.T;
            
            totalT += process.T;
            totalE += process.E;
            totalI += process.I;
        });
        
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        return {
            processes: sortedProcesses.reverse(),
            averages: {
                T: totalT / sortedProcesses.length,
                E: totalE / sortedProcesses.length,
                I: totalI / sortedProcesses.length
            },
            executionTime: executionTime
        };
    }

    calculateRR(quantum) {
        const startTime = performance.now();
        
        const processesCopy = this.processes.map(p => ({
            ...p,
            remainingTime: p.t,
            startTime: null,
            originalOrder: p.originalOrder
        }));
        
        const processesByArrival = [...processesCopy].sort((a, b) => a.ti - b.ti);
        
        let time = 0;
        let queue = [];
        let completed = [];
        let currentIndex = 0;
        
        while (completed.length < processesCopy.length) {
            while (currentIndex < processesByArrival.length && 
                   processesByArrival[currentIndex].ti <= time) {
                const process = processesByArrival[currentIndex];
                if (!queue.includes(process) && !completed.includes(process)) {
                    queue.push(process);
                }
                currentIndex++;
            }
            
            if (queue.length === 0) {
                if (currentIndex < processesByArrival.length) {
                    time = processesByArrival[currentIndex].ti;
                    continue;
                }
                break;
            }
            
            const currentProcess = queue.shift();
            
            if (currentProcess.startTime === null) {
                currentProcess.startTime = time;
            }
            
            const execTime = Math.min(quantum, currentProcess.remainingTime);
            time += execTime;
            currentProcess.remainingTime -= execTime;
            
            while (currentIndex < processesByArrival.length && 
                   processesByArrival[currentIndex].ti <= time) {
                const process = processesByArrival[currentIndex];
                if (!queue.includes(process) && !completed.includes(process) && 
                    process !== currentProcess) {
                    queue.push(process);
                }
                currentIndex++;
            }
            
            if (currentProcess.remainingTime === 0) {
                currentProcess.tf = time;
                currentProcess.T = currentProcess.tf - currentProcess.ti;
                currentProcess.E = currentProcess.T - currentProcess.t;
                currentProcess.I = currentProcess.t / currentProcess.T;
                completed.push(currentProcess);
            } else {
                queue.push(currentProcess);
            }
        }
        
        completed.sort((a, b) => a.originalOrder - b.originalOrder);
        
        let totalT = 0, totalE = 0, totalI = 0;
        completed.forEach(process => {
            totalT += process.T;
            totalE += process.E;
            totalI += process.I;
        });
        
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        return {
            processes: completed,
            averages: {
                T: totalT / completed.length,
                E: totalE / completed.length,
                I: totalI / completed.length
            },
            executionTime: executionTime
        };
    }

    compareMethods(fifoResults, lifoResults, rrResults) {
        const comparison = {
            bestT: '',
            bestE: '',
            bestI: '',
            overall: ''
        };
        
        const tValues = [
            {method: 'FIFO', value: fifoResults.averages.T},
            {method: 'LIFO', value: lifoResults.averages.T},
            {method: 'RR', value: rrResults.averages.T}
        ];
        comparison.bestT = tValues.reduce((min, curr) => curr.value < min.value ? curr : min).method;
        
        const eValues = [
            {method: 'FIFO', value: fifoResults.averages.E},
            {method: 'LIFO', value: lifoResults.averages.E},
            {method: 'RR', value: rrResults.averages.E}
        ];
        comparison.bestE = eValues.reduce((min, curr) => curr.value < min.value ? curr : min).method;
        
        const iValues = [
            {method: 'FIFO', value: fifoResults.averages.I},
            {method: 'LIFO', value: lifoResults.averages.I},
            {method: 'RR', value: rrResults.averages.I}
        ];
        comparison.bestI = iValues.reduce((max, curr) => curr.value > max.value ? curr : max).method;
        
        const scores = {
            FIFO: 0,
            LIFO: 0,
            RR: 0
        };
        
        if (comparison.bestT === 'FIFO') scores.FIFO++;
        if (comparison.bestE === 'FIFO') scores.FIFO++;
        if (comparison.bestI === 'FIFO') scores.FIFO++;
        
        if (comparison.bestT === 'LIFO') scores.LIFO++;
        if (comparison.bestE === 'LIFO') scores.LIFO++;
        if (comparison.bestI === 'LIFO') scores.LIFO++;
        
        if (comparison.bestT === 'RR') scores.RR++;
        if (comparison.bestE === 'RR') scores.RR++;
        if (comparison.bestI === 'RR') scores.RR++;
        
        comparison.overall = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
        
        return comparison;
    }
}

// ========== UI CONTROLLER ==========
class UIController {
    constructor() {
        this.scheduler = new ProcessScheduler();
        this.initializeEventListeners();
        this.loadDefaultData();
    }

    initializeEventListeners() {
        const calculateBtn = document.getElementById('calculateBtn');
        const loadDefaultBtn = document.getElementById('loadDefaultBtn');
        const fileInput = document.getElementById('fileInput');
        const quantumInput = document.getElementById('quantum');
        
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculateAll());
        } else {
            console.error('Botón calculateBtn no encontrado');
        }
        
        if (loadDefaultBtn) {
            loadDefaultBtn.addEventListener('click', () => this.loadDefaultData());
        }
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.loadFile(e));
        }
        
        if (quantumInput) {
            quantumInput.addEventListener('input', (e) => {
                const quantumValue = document.getElementById('quantum-value');
                if (quantumValue) {
                    quantumValue.textContent = e.target.value;
                }
            });
        }
        
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    loadDefaultData() {
        try {
            this.scheduler.loadDefaultData();
            this.showNotification('Datos por defecto cargados correctamente', 'success');
            this.updateProcessCount();
        } catch (error) {
            this.showNotification('Error al cargar datos por defecto', 'error');
            console.error(error);
        }
    }

    loadFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.scheduler.loadCSVData(e.target.result);
                this.showNotification(`Archivo CSV cargado (${this.scheduler.processes.length} procesos)`, 'success');
                this.updateProcessCount();
            } catch (error) {
                this.showNotification('Error al cargar el archivo CSV', 'error');
                console.error(error);
            }
        };
        reader.readAsText(file);
    }

    updateProcessCount() {
        const count = this.scheduler.processes.length;
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

    calculateAll() {
        console.log('Botón calcular clickeado');
        
        const quantumInput = document.getElementById('quantum');
        if (!quantumInput) {
            this.showNotification('No se encontró el input de quantum', 'error');
            return;
        }
        
        const quantum = parseInt(quantumInput.value) || 10;
        
        if (isNaN(quantum) || quantum <= 0) {
            this.showNotification('Ingresa un quantum válido', 'error');
            return;
        }
        
        if (this.scheduler.processes.length === 0) {
            this.showNotification('No hay procesos para calcular', 'error');
            return;
        }
        
        this.showNotification('Calculando...', 'info');
        
        try {
            const fifoResults = this.scheduler.calculateFIFO();
            const lifoResults = this.scheduler.calculateLIFO();
            const rrResults = this.scheduler.calculateRR(quantum);
            
            console.log('Resultados FIFO:', fifoResults);
            console.log('Resultados LIFO:', lifoResults);
            console.log('Resultados RR:', rrResults);
            
            this.displayResults('fifo', fifoResults);
            this.displayResults('lifo', lifoResults);
            this.displayResults('rr', rrResults);
            
            this.updateExecutionTimes(fifoResults, lifoResults, rrResults);
            
            const comparison = this.scheduler.compareMethods(fifoResults, lifoResults, rrResults);
            this.displayComparison(comparison);
            
            this.highlightBestMethod(comparison.overall);
            
            this.showNotification('Cálculos completados', 'success');
        } catch (error) {
            console.error('Error en cálculo:', error);
            this.showNotification('Error en los cálculos: ' + error.message, 'error');
        }
    }

    displayResults(algorithm, results) {
        const tableBody = document.getElementById(`${algorithm}-body`);
        if (!tableBody) {
            console.error(`No se encontró tabla para ${algorithm}`);
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

    updateExecutionTimes(fifoResults, lifoResults, rrResults) {
        const fifoTime = document.getElementById('fifo-time');
        const lifoTime = document.getElementById('lifo-time');
        const rrTime = document.getElementById('rr-time');
        
        if (fifoTime) fifoTime.textContent = `Tiempo: ${fifoResults.executionTime.toFixed(2)} ms`;
        if (lifoTime) lifoTime.textContent = `Tiempo: ${lifoResults.executionTime.toFixed(2)} ms`;
        if (rrTime) rrTime.textContent = `Tiempo: ${rrResults.executionTime.toFixed(2)} ms`;
    }

    displayComparison(comparison) {
        const bestT = document.getElementById('best-t-result');
        const bestE = document.getElementById('best-e-result');
        const bestI = document.getElementById('best-i-result');
        const overallBest = document.getElementById('overall-best-result');
        
        if (bestT) bestT.textContent = comparison.bestT;
        if (bestE) bestE.textContent = comparison.bestE;
        if (bestI) bestI.textContent = comparison.bestI;
        if (overallBest) overallBest.textContent = comparison.overall;
    }

    highlightBestMethod(method) {
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

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(tabName);
        
        if (activeBtn) activeBtn.classList.add('active');
        if (activeContent) activeContent.classList.add('active');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        const bgColor = type === 'success' ? '#8a6bb8' : type === 'error' ? '#f44336' : '#6a11cb';
        notification.style.background = `linear-gradient(135deg, ${bgColor} 0%, ${type === 'success' ? '#6a11cb' : '#d32f2f'} 100%)`;
        notification.style.color = 'white';
        notification.style.boxShadow = '0 5px 15px rgba(138, 107, 184, 0.3)';
        
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        document.body.appendChild(notification);
        
        notification.style.animation = 'slideIn 0.3s ease-out';
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ========== INICIALIZAR APLICACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, iniciando aplicación...');
    new UIController();
});