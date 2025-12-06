// js/ui/UIController.js
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
            NotificationManager.showNotification('Datos por defecto cargados correctamente', 'success');
            ResultsManager.updateProcessCount(this.scheduler.processes.length);
        } catch (error) {
            NotificationManager.showNotification('Error al cargar datos por defecto', 'error');
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
                NotificationManager.showNotification(
                    `Archivo CSV cargado (${this.scheduler.processes.length} procesos)`, 
                    'success'
                );
                ResultsManager.updateProcessCount(this.scheduler.processes.length);
            } catch (error) {
                NotificationManager.showNotification('Error al cargar el archivo CSV', 'error');
                console.error(error);
            }
        };
        reader.readAsText(file);
    }

    calculateAll() {
        console.log('Botón calcular clickeado');
        
        const quantumInput = document.getElementById('quantum');
        if (!quantumInput) {
            NotificationManager.showNotification('No se encontró el input de quantum', 'error');
            return;
        }
        
        const quantum = parseInt(quantumInput.value) || 10;
        
        if (isNaN(quantum) || quantum <= 0) {
            NotificationManager.showNotification('Ingresa un quantum válido', 'error');
            return;
        }
        
        if (this.scheduler.processes.length === 0) {
            NotificationManager.showNotification('No hay procesos para calcular', 'error');
            return;
        }
        
        NotificationManager.showNotification('Calculando...', 'info');
        
        try {
            const fifoResults = this.scheduler.calculateFIFO();
            const lifoResults = this.scheduler.calculateLIFO();
            const rrResults = this.scheduler.calculateRR(quantum);
            
            console.log('Resultados calculados exitosamente');
            
            ResultsManager.displayResults('fifo', fifoResults);
            ResultsManager.displayResults('lifo', lifoResults);
            ResultsManager.displayResults('rr', rrResults);
            
            ResultsManager.updateExecutionTimes(fifoResults, lifoResults, rrResults);
            
            const comparison = this.scheduler.compareMethods(fifoResults, lifoResults, rrResults);
            ResultsManager.displayComparison(comparison);
            
            ResultsManager.highlightBestMethod(comparison.overall);
            
            NotificationManager.showNotification('Cálculos completados', 'success');
        } catch (error) {
            console.error('Error en cálculo:', error);
            NotificationManager.showNotification('Error en los cálculos: ' + error.message, 'error');
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
}