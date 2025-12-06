import ProcessScheduler from './ProcessScheduler.js';
import ResultsTable from './ResultsTable.js';
import ProcessForm from './ProcessForm.js';
import ComparisonSection from './ComparisonSection.js';

class UI {
    constructor() {
        this.scheduler = new ProcessScheduler();
        this.resultsTable = new ResultsTable();
        this.processForm = new ProcessForm(this);
        this.comparisonSection = new ComparisonSection();
        
        this.initializeEventListeners();
        this.loadDefaultData();
    }

    initializeEventListeners() {
        document.getElementById('calculateBtn').addEventListener('click', () => this.calculateAll());
        document.getElementById('loadDefaultBtn').addEventListener('click', () => this.loadDefaultData());
        document.getElementById('fileInput').addEventListener('change', (e) => this.processForm.loadFile(e));
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
        
        const quantumInput = document.getElementById('quantum');
        if (quantumInput) {
            quantumInput.addEventListener('input', (e) => {
                const quantumValue = document.getElementById('quantum-value');
                if (quantumValue) {
                    quantumValue.textContent = e.target.value;
                }
            });
        }
    }

    loadDefaultData() {
        this.scheduler.loadDefaultData();
        this.showNotification('Datos por defecto cargados correctamente', 'success');
        this.updateProcessCount();
    }

    updateProcessCount() {
        const count = this.scheduler.processes.length;
        this.processForm.updateProcessCount(count);
    }

    calculateAll() {
        const quantum = parseInt(document.getElementById('quantum').value) || 10;
        
        if (isNaN(quantum) || quantum <= 0) {
            this.showNotification('Ingresa un quantum válido', 'error');
            return;
        }
        
        if (this.scheduler.processes.length === 0) {
            this.showNotification('No hay procesos para calcular', 'error');
            return;
        }
        
        this.showNotification('Calculando...', 'info');
        
        const fifoResults = this.scheduler.calculateFIFO();
        const lifoResults = this.scheduler.calculateLIFO();
        const rrResults = this.scheduler.calculateRR(quantum);
        
        this.resultsTable.displayResults('fifo', fifoResults);
        this.resultsTable.displayResults('lifo', lifoResults);
        this.resultsTable.displayResults('rr', rrResults);
        
        this.updateExecutionTimes(fifoResults, lifoResults, rrResults);
        
        const comparison = this.scheduler.compareMethods(fifoResults, lifoResults, rrResults);
        this.comparisonSection.displayComparison(comparison);
        
        this.highlightBestMethod(comparison.overall);
        
        this.showNotification('Cálculos completados', 'success');
    }

    updateExecutionTimes(fifoResults, lifoResults, rrResults) {
        const fifoTime = document.getElementById('fifo-time');
        const lifoTime = document.getElementById('lifo-time');
        const rrTime = document.getElementById('rr-time');
        
        if (fifoTime) fifoTime.textContent = `Tiempo: ${fifoResults.executionTime.toFixed(2)} ms`;
        if (lifoTime) lifoTime.textContent = `Tiempo: ${lifoResults.executionTime.toFixed(2)} ms`;
        if (rrTime) rrTime.textContent = `Tiempo: ${rrResults.executionTime.toFixed(2)} ms`;
    }

    highlightBestMethod(method) {
        this.comparisonSection.highlightBestMethod(method);
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

export default UI;