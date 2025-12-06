// js/ui/NotificationManager.js
class NotificationManager {
    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        const bgColor = type === 'success' ? '#8a6bb8' : 
                       type === 'error' ? '#f44336' : 
                       type === 'warning' ? '#ff9800' : '#6a11cb';
        
        notification.style.background = `linear-gradient(135deg, ${bgColor} 0%, ${
            type === 'success' ? '#6a11cb' : 
            type === 'error' ? '#d32f2f' : 
            type === 'warning' ? '#f57c00' : '#2575fc'
        } 100%)`;
        
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