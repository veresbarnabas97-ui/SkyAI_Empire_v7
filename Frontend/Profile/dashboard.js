// ⚜️ Founder's Sanctum v7.2

// AZ ÚJ TOKEN CÍME (Ezt kérdezzük le)
const TOKEN_ADDRESS = "0x4B30d92243e88907751E016d33A23D3A1A560026";
// A Tulajdonos címe (Aki a Dashboardot nézi)
const OWNER_ADDRESS = "0xc98415672A80a26bEC29427b7284D65B73c5Ff7B";

// Egyszerű ABI a balance lekérdezéshez
const MIN_ABI = [
    {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"}
];

async function initDashboard() {
    updateDate();
    
    // Web3 Adatok betöltése
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
            const contract = new web3.eth.Contract(MIN_ABI, TOKEN_ADDRESS);
            
            // Lekérdezzük, mennyi token van még az Ownernél (Eladható készlet)
            const balance = await contract.methods.balanceOf(OWNER_ADDRESS).call();
            const formatted = Math.floor(web3.utils.fromWei(balance, 'ether'));
            
            // Kijelzés az első kártyán
            document.querySelector('.stats-grid .card:nth-child(1) .value').innerText = formatted.toLocaleString() + " SKY";
            document.querySelector('.stats-grid .card:nth-child(1) .subtext').innerText = "V7 Készlet (Owner)";
            
        } catch (e) {
            console.log("Dashboard Error:", e);
        }
    }
}

function updateDate() {
    document.getElementById('current-date').innerText = new Date().toLocaleString('en-US');
}

// ... showSection logika marad a régiben ...

document.addEventListener("DOMContentLoaded", initDashboard);
