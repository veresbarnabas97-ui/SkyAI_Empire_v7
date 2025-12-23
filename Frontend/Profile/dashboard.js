// ⚜️ Founder's Sanctum v7.2

// AZ ÚJ TOKEN CÍME (Ezt kérdezzük le)
const TOKEN_ADDRESS = "0x4B30d92243e88907751E016d33A23D3A1A560026";
// A Tulajdonos címe (Aki a Dashboardot nézi - a Te címed)
const FOUNDER_ADDRESS = "0xc98415672A80a26bEC29427b7284D65B73c5Ff7B";

// Egyszerű ABI a balance lekérdezéshez
const MIN_ABI = [
    {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"}
];

// Dátum frissítés
function updateDate() {
    const now = new Date();
    const el = document.getElementById('current-date');
    if(el) el.innerText = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' }).toUpperCase();
}

async function initDashboard() {
    updateDate();
    
    // Web3 Adatok betöltése
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
            const contract = new web3.eth.Contract(MIN_ABI, TOKEN_ADDRESS);
            
            // Lekérdezzük, mennyi token van még az Ownernél (Készlet)
            const balance = await contract.methods.balanceOf(FOUNDER_ADDRESS).call();
            const formatted = Math.floor(web3.utils.fromWei(balance, 'ether'));
            
            // Kijelzés az első kártyán (Token Supply helyett Készlet)
            const valDiv = document.querySelector('.stats-grid .card:nth-child(1) .value');
            const subDiv = document.querySelector('.stats-grid .card:nth-child(1) .subtext');
            
            if(valDiv) {
                valDiv.innerText = parseInt(formatted).toLocaleString() + " SKY";
                valDiv.style.color = "#d4af37"; // Gold color
            }
            if(subDiv) subDiv.innerText = "Elérhető Készlet (V7)";
            
        } catch (e) {
            console.log("Dashboard Error (Web3):", e);
        }
    }
}

// Navigáció
function showSection(id) {
    document.querySelectorAll('.content-section').forEach(d => d.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    document.querySelectorAll('.menu li').forEach(l => l.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

document.addEventListener("DOMContentLoaded", initDashboard);
setInterval(updateDate, 60000);
