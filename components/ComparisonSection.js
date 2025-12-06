class ComparisonSection {
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
}

export default ComparisonSection;