(function () {
    'use strict';

    function initResumeDownload() {
        const resumeBtn = document.getElementById('resumeBtn');
        if (!resumeBtn) return;

        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const resumeContent = `ABHINAV - Portfolio Resume\nGenerated on: ${new Date().toLocaleDateString()}\nPortfolio: Nether-themed 3D Interactive Experience`;

            try {
                const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Abhinav_Resume_Nether_Portfolio.txt';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                window.showNotification('Resume downloaded successfully!', 'success');
            } catch (err) {
                console.error('Download error:', err);
                window.showNotification('Download feature unavailable in this environment', 'error');
            }
        });
    }

    window.initResumeDownload = initResumeDownload;
    console.log('resume.js loaded');
})();