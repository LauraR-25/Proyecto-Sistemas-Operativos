// js/core/Process.js
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