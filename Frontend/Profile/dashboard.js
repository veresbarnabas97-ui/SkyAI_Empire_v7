// ⚜️ FOUNDER'S SANCTUM DASHBOARD LOGIC
// Figyeli a VIP és a MAIN tárcák egyenlegét a blokkláncon.

const VIP_WALLET = "0x4018cb790d84ED4b7213848A4C6121aC36AEBbeF";
const MAIN_WALLET = "0xc98415672A80a26bEC29427b7284D65B73c5Ff7B";
const VERIFIED_TOKEN = "0x4B30d92243e88907751E016d33A23D3A1A560026";

// Csak a Balance lekéréséhez szükséges ABI
const MIN_ABI = [
    {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"}
];

let web3;

window.addEventListener('load', async () => {
    updateDate();
    
    // Web3 Init (Read-Only módhoz BSC Node-ot használunk)
    if (typeof Web3 !== 'undefined') {
        web3 = new Web3("https://bsc-dataseed.binance.org/"); // Public RPC
        fetchChainData();
    } else {
        console.log("Web3 not found.");
        document.getElementById('vip-balance').innerText = "OFFLINE";
    }
});

function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    
    // Show selected
    document.getElementById(tabId).classList.add('active');
    
    // Highlight menu
    // (Egyszerűsített megoldás, a gomb onclick-ben lehetne szebb is)
    event.target.classList.add('active');
    
    document.getElementById('page-title').innerText = tabId.toUpperCase().replace('-', ' ');
}

function updateDate() {
    const now = new Date();
    document.getElementById('current-date').innerText = now.toUTCString().toUpperCase();
}

async function fetchChainData() {
    try {
        addLog("Querying VIP Treasury Wallet...");
        // 1. VIP TÁRCA (BNB EGYENLEG)
        const vipBalanceWei = await web3.eth.getBalance(VIP_WALLET);
        const vipBalanceBNB = web3.utils.fromWei(vipBalanceWei, 'ether');
        document.getElementById('vip-balance').innerText = parseFloat(vipBalanceBNB).toFixed(3) + " BNB";
        
        addLog(`> VIP Wallet Balance: ${vipBalanceBNB} BNB`);

        // 2. MAIN TÁRCA (BNB EGYENLEG)
        addLog("Querying Main Presale Wallet...");
        const mainBalanceWei = await web3.eth.getBalance(MAIN_WALLET);
        const mainBalanceBNB = web3.utils.fromWei(mainBalanceWei, 'ether');
        document.getElementById('main-balance').innerText = parseFloat(mainBalanceBNB).toFixed(3) + " BNB";
        
        addLog(`> Main Wallet Balance: ${mainBalanceBNB} BNB`);
        
        addLog("System Synchronization Complete. All Systems Stable.");

    } catch (e) {
        console.error(e);
        addLog("ERROR: Connection to BSC Node failed.");
        document.getElementById('vip-balance').innerText = "ERR";
    }
}

function addLog(msg) {
    const list = document.getElementById('chain-logs');
    const li = document.createElement('li');
    li.innerText = msg;
    list.appendChild(li);
}
