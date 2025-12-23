// ⚜️ Founder's Sanctum Logic v7.1

// AZ ÚJ TOKEN CÍME
const TOKEN_ADDRESS = "0x4B30d92243e88907751E016d33A23D3A1A560026";
// Token ABI (Csak a balance lekérdezéshez kell)
const TOKEN_ABI = [
    {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"}
];

async function initDashboard() {
    updateDate();
    
    // Web3 Csatlakozás (Read-Only ha nincs wallet, de jobb ha van)
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                const user = accounts[0];
                document.querySelector('.user-badge span:last-child').innerText = "FOUNDER / " + user.substring(0,6) + "..";
                
                // Token Egyenleg lekérése
                const contract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
                const balance = await contract.methods.balanceOf(user).call();
                const skyBalance = web3.utils.fromWei(balance, 'ether'); // Feltételezve 18 tizedesjegyet
                
                // Frissítés a kártyán
                const balanceCard = document.querySelectorAll('.card .value')[0]; // Első kártya
                balanceCard.innerText = parseFloat(skyBalance).toLocaleString() + " SKY";
                balanceCard.style.color = "var(--gold)";
            }
        } catch (e) {
            console.log("Dashboard Web3 Error:", e);
        }
    }
}

// ... (A többi navigációs kód marad a régiben: showSection, updateDate)

document.addEventListener("DOMContentLoaded", initDashboard);
setInterval(updateDate, 60000);
