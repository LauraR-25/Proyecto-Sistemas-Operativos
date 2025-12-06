// js/core/ProcessScheduler.js
class ProcessScheduler {
    constructor() {
        this.processes = [];
    }

    loadDefaultData() {
        this.processes = DEFAULT_PROCESSES.map((p, index) => {
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