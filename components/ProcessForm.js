class ProcessForm {
    constructor(ui) {
        this.ui = ui;
    }

    loadFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.ui.scheduler.loadCSVData(e.target.result);
                this.ui.showNotification(`Archivo CSV cargado (${this.ui.scheduler.processes.length} procesos)`, 'success');
                this.ui.updateProcessCount();
            } catch (error) {
                this.ui.showNotification('Error al cargar el archivo CSV', 'error');
                console.error(error);
            }
        };
        reader.readAsText(file);
    }

    updateProcessCount(count) {
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

export default ProcessForm;