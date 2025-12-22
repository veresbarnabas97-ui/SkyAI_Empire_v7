// 🌌 SkyAI Empire v7.0 - Frontend Logic
// Connects the website to the BSC Blockchain and your PreSale Contract

// --- CONFIGURATION ---
// FIGYELEM: Ez az új, V7-es PreSale szerződés címe!
const PRESALE_CONTRACT_ADDRESS = "0x1fD631d33c1973158fdae72eBCa9Ca8285cE978c"; 
const SKY_TOKEN_ADDRESS = "0xcBbaDC40Cde0F12679a6b0b74fB732E02E60fa83";      
const RATE = 1000000; // 1 BNB = 1,000,000 SKY

// Minimal ABI
const PRESALE_ABI = [
    {
        "inputs": [],
        "name": "buyTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minBuyBNB",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

let userAccount = null;
let web3 = null;

// --- 1. INITIALIZATION ---
window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        console.log("🌌 SkyAI: Web3 initialized.");
        
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            handleLogin(accounts[0]);
        }
    } else {
        console.log("🌌 SkyAI: No wallet found. Please install MetaMask.");
    }
});

// --- 2. WALLET CONNECTION ---
async function connectWallet() {
    if (!window.ethereum) {
        alert("Please install MetaMask or TrustWallet!");
        return;
    }
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleLogin(accounts[0]);
    } catch (error) {
        console.error("Connection failed", error);
    }
}

function handleLogin(address) {
    userAccount = address;
    console.log("Logged in as:", userAccount);
    
    const connectBtn = document.getElementById("connect-btn");
    if (connectBtn) {
        connectBtn.innerText = address.substring(0, 6) + "..." + address.substring(38);
        connectBtn.classList.add("connected");
    }
}

// --- 3. BUY FUNCTION (AUTOMATA TELEGRAM LINKELÉSSEL) ---
async function buyTokens() {
    if (!userAccount) {
        alert("Kérlek, csatlakoztasd a pénztárcád!");
        connectWallet();
        return;
    }

    const amountInput = document.getElementById("bnb-amount");
    const bnbAmount = amountInput ? amountInput.value : "0.01"; 
    const amountInWei = web3.utils.toWei(bnbAmount.toString(), "ether");
    const contract = new web3.eth.Contract(PRESALE_ABI, PRESALE_CONTRACT_ADDRESS);

    try {
        console.log(`Processing buy for ${bnbAmount} BNB...`);
        
        // Tranzakció küldése
        const receipt = await contract.methods.buyTokens().send({
            from: userAccount,
            value: amountInWei,
            gas: 200000 
        });

        // SIKERES VÁSÁRLÁS LOGIKA
        console.log("Transaction Receipt:", receipt);
        const txHash = receipt.transactionHash; 

        // Biztonsági késleltetés, hogy a felhasználó biztosan lássa
        setTimeout(() => {
            const confirmed = confirm("✅ SIKERES VÁSÁRLÁS!\n\nKattints az OK gombra a VIP aktiválásához a Telegramon!");
            if (confirmed) {
                // Ez a link megnyitja a botot és beilleszti a kódot (Deep Link)
                window.open(`https://t.me/SkyAI_PaymentBot?start=${txHash}`, "_blank");
            }
        }, 500);
        
    } catch (error) {
        console.error("Purchase failed:", error);
        alert("❌ Tranzakció sikertelen: " + (error.message || "Ismeretlen hiba"));
    }
}

// --- 4. EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.getElementById("connect-btn");
    const buyBtn = document.getElementById("buy-btn");

    if (connectBtn) connectBtn.addEventListener("click", connectWallet);
    if (buyBtn) buyBtn.addEventListener("click", buyTokens);
});
