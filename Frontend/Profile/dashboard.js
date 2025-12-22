// ⚜️ Founder's Sanctum Logic

// --- DATE DISPLAY ---
function updateDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    document.getElementById('current-date').innerText = now.toLocaleDateString('en-US', options).toUpperCase();
}

// --- NAVIGATION LOGIC ---
function showSection(sectionId) {
    // 1. Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => sec.style.display = 'none');

    // 2. Show the selected section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = 'block';
    }

    // 3. Update Menu Active State
    const menuItems = document.querySelectorAll('.menu li');
    menuItems.forEach(item => item.classList.remove('active'));
    
    // Find the clicked item (based on onclick matching) and add active class
    // (This is a simple loop match)
    event.target.classList.add('active');
}

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    updateDate();
    setInterval(updateDate, 60000); // Update time every minute
});
