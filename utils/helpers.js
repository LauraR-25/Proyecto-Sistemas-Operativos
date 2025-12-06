// utils/helpers.js

// Formatear números con separadores de miles
export function formatNumber(num, decimals = 2) {
    return parseFloat(num.toFixed(decimals)).toLocaleString('es-ES');
}

// Validar si un valor es numérico
export function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

// Generar un color aleatorio en tonos morados
export function getRandomPurpleColor() {
    const hues = [270, 280, 290, 300]; // Tonos morados
    const hue = hues[Math.floor(Math.random() * hues.length)];
    return `hsl(${hue}, 70%, 60%)`;
}

// Crear un delay (para simulaciones)
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Exportar datos a CSV
export function exportToCSV(data, filename = 'procesos.csv') {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Encabezados
    csvContent += "Proceso,ti,t\n";
    
    // Datos
    data.forEach(process => {
        csvContent += `${process.name},${process.ti},${process.t}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export default {
    formatNumber,
    isNumeric,
    getRandomPurpleColor,
    delay,
    exportToCSV
};