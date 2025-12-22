// 🌌 SkyAI Empire v7.0 - Frontend Logic
// Connects the website to the BSC Blockchain and your PreSale Contract

// --- CONFIGURATION ---
const PRESALE_CONTRACT_ADDRESS = "0x1fD631d33c1973158fdae72eBCa9Ca8285cE978c"; // AZ ÚJ, JÓ CÍM
const SKY_TOKEN_ADDRESS = "0xcBbaDC40Cde0F12679a6b0b74fB732E02E60fa83";      // A TE SKY TOKENED
const RATE = 1000000; // 1 BNB = 1,000,000 SKY

// Minimal ABI (Only what we need to talk to the contract)
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
        
        // Check if already connected
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
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleLogin(accounts[0]);
    } catch (error) {
        console.error("Connection failed", error);
    }
}

function handleLogin(address) {
    userAccount = address;
    console.log("Logged in as:", userAccount);
    
    // Update UI (Change button text)
    const connectBtn = document.getElementById("connect-btn");
    if (connectBtn) {
        connectBtn.innerText = address.substring(0, 6) + "..." + address.substring(38);
        connectBtn.classList.add("connected");
    }
}

// --- 3. BUY FUNCTION (JAVÍTVA!) ---
async function buyTokens() {
    if (!userAccount) {
        alert("Please connect your wallet first!");
        connectWallet();
        return;
    }

    // Get input value (BNB amount)
    const amountInput = document.getElementById("bnb-amount");
    const bnbAmount = amountInput ? amountInput.value : "0.01"; 

    // Convert BNB to Wei
    const amountInWei = web3.utils.toWei(bnbAmount.toString(), "ether");

    // Initialize Contract
    const contract = new web3.eth.Contract(PRESALE_ABI, PRESALE_CONTRACT_ADDRESS);

    try {
        console.log(`Processing buy for ${bnbAmount} BNB...`);
        
        // Send Transaction and WAIT for receipt
        const receipt = await contract.methods.buyTokens().send({
            from: userAccount,
            value: amountInWei,
            gas: 200000 // Gas limit
        });

        // --- SIKERES VÁSÁRLÁS KEZELÉSE ---
        console.log("Transaction Receipt:", receipt);
        const txHash = receipt.transactionHash; // Kinyerjük a Hash-t

        alert("✅ SIKER! Átirányítás a Telegram Bot-hoz a VIP aktiváláshoz...");
        
        // JAVÍTÁS: Helyes Bot név (nincs aláhúzás) + Automata Hash beillesztés
        // Ez megnyitja a Telegramot úgy, hogy a felhasználónak csak a START-ot kell nyomnia
        window.open(`https://t.me/SkyAI_PaymentBot?start=${txHash}`, "_blank");
        
    } catch (error) {
        console.error("Purchase failed:", error);
        alert("❌ Transaction failed. Reason: " + (error.message || "Unknown error"));
    }
}

// --- 4. EVENT LISTENERS ---
// Bind buttons when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.getElementById("connect-btn");
    const buyBtn = document.getElementById("buy-btn");

    if (connectBtn) connectBtn.addEventListener("click", connectWallet);
    if (buyBtn) buyBtn.addEventListener("click", buyTokens);
});
