// ⚜️ Founder's Sanctum v7.3

// YOUR DATA
const OWNER_WALLET = "0xc98415672A80a26bEC29427b7284D65B73c5Ff7B";
// The NEW Token Address (to check your supply)
const TOKEN_ADDRESS = "0x4B30d92243e88907751E016d33A23D3A1A560026"; 

const MIN_ABI = [
    {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"}
];

async function initDashboard() {
    updateDate();
    
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
            // 1. Get Token Supply (Your Holdings)
            const tokenContract = new web3.eth.Contract(MIN_ABI, TOKEN_ADDRESS);
            const tokenBal = await tokenContract.methods.balanceOf(OWNER_WALLET).call();
            const tokenFormatted = Math.floor(web3.utils.fromWei(tokenBal, 'ether'));
            
            // 2. Get BNB Balance (Revenue)
            const bnbBal = await web3.eth.getBalance(OWNER_WALLET);
            const bnbFormatted = parseFloat(web3.utils.fromWei(bnbBal, 'ether')).toFixed(4);

            // UPDATE UI
            // Card 1: Revenue
            document.querySelector('.stats-grid .card:nth-child(1) .value').innerText = bnbFormatted + " BNB";
            document.querySelector('.stats-grid .card:nth-child(1) .subtext').innerText = "Total Revenue";

            // Card 2: Supply
            document.querySelector('.stats-grid .card:nth-child(2) .value').innerText = tokenFormatted.toLocaleString() + " SKY";
            document.querySelector('.stats-grid .card:nth-child(2) .subtext').innerText = "Remaining Inventory";

        } catch (e) { console.log("Dashboard Error:", e); }
    }
}

function updateDate() {
    document.getElementById('current-date').innerText = new Date().toLocaleString('en-US').toUpperCase();
}

document.addEventListener("DOMContentLoaded", initDashboard);
