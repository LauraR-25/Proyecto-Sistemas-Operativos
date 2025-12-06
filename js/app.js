// js/app.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Planificador de Procesos - Inicializando...');
    
    // Verificar que los elementos esenciales existen
    const requiredElements = [
        'calculateBtn',
        'quantum',
        'fifo-body',
        'lifo-body',
        'rr-body'
    ];
    
    let allElementsExist = true;
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Elemento con id "${id}" no encontrado`);
            allElementsExist = false;
        }
    });
    
    if (!allElementsExist) {
        NotificationManager.showNotification('Error: Faltan elementos HTML requeridos', 'error');
        return;
    }
    
    // Inicializar la aplicación
    try {
        window.app = new UIController();
        console.log('Aplicación inicializada correctamente');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        NotificationManager.showNotification('Error al inicializar la aplicación', 'error');
    }
});