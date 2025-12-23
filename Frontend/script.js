// 🌌 SkyAI Empire v7.1 - Frontend Logic

// --- CONFIGURATION ---
// 1. A PRESALE CONTRACT (Ahol a BNB landol)
const PRESALE_ADDRESS = "0x1fD631d33c1973158fdae72eBCa9Ca8285cE978c"; 
// 2. AZ ÚJ TISZTA TOKEN CÍME (Ezt kapják a vevők)
const SKY_TOKEN_ADDRESS = "0x4B30d92243e88907751E016d33A23D3A1A560026"; 

const RATE = 1000000; // 1 BNB = 1,000,000 SKY

// Minimal ABI a vásárláshoz
const PRESALE_ABI = [
    {
        "inputs": [],
        "name": "buyTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

let web3;
let userAccount;

// --- INIT & WALLET ---
window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        document.getElementById('connect-btn').addEventListener('click', connectWallet);
        document.getElementById('buy-btn').addEventListener('click', buyTokens);
        
        // Input változás figyelése a kalkulátorhoz
        document.getElementById('bnb-amount').addEventListener('input', updateCalculator);
    }
});

async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        const btn = document.getElementById("connect-btn");
        btn.innerText = "🟢 " + userAccount.substring(0, 6) + "...";
        btn.classList.add("connected");
    } catch (err) {
        console.error(err);
    }
}

// --- CALCULATOR ---
function updateCalculator() {
    const bnbInput = document.getElementById('bnb-amount').value;
    const skyOutput = bnbInput * RATE;
    // Megjelenítés a felületen (Ha van erre dedikált hely, vagy a gomb szövegében)
    const display = document.querySelector('.conversion-rate');
    if(display) {
        display.innerHTML = `💎 KAPSZ: <strong>${skyOutput.toLocaleString()} SKY</strong> (ÚJ V7)`;
    }
}

// --- BUY FUNCTION ---
async function buyTokens() {
    if (!userAccount) return alert("⚠️ Csatlakoztasd a Walleted!");
    
    const amountBNB = document.getElementById("bnb-amount").value;
    if (amountBNB < 0.0017) return alert("⚠️ Minimum: 0.0017 BNB");

    const amountWei = web3.utils.toWei(amountBNB.toString(), "ether");
    const contract = new web3.eth.Contract(PRESALE_ABI, PRESALE_ADDRESS);

    try {
        // Tranzakció küldése
        const receipt = await contract.methods.buyTokens().send({
            from: userAccount,
            value: amountWei,
            gas: 200000
        });
        
        const txHash = receipt.transactionHash;
        
        // Átirányítás a Payment Botra ellenőrzésre
        if(confirm("✅ SIKER! Kattints az OK-ra a VIP aktiválásához!")) {
            window.open(`https://t.me/SkyAI_PaymentBot?start=${txHash}`, "_blank");
        }
        
    } catch (error) {
        alert("❌ Hiba: " + error.message);
    }
}
