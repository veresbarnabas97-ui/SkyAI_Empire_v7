// 🌌 SkyAI Empire v7.0 - Frontend Logic
// Connects the website to the BSC Blockchain and your PreSale Contract

// --- CONFIGURATION ---
const PRESALE_CONTRACT_ADDRESS = "0x1fD631d33c1973158fdae72eBCa9Ca8285cE978c"; // Empire v7 Contract
const SKY_TOKEN_ADDRESS = "0xcBbaDC40Cde0F12679a6b0b74fB732E02E60fa83";      // SKY Token
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
        console.log("🌌 SkyAI: Web3 Uplink Established.");
        
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            handleLogin(accounts[0]);
        }
    } else {
        console.log("🌌 SkyAI: No wallet found.");
    }
});

// --- 2. WALLET CONNECTION ---
async function connectWallet() {
    if (!window.ethereum) {
        alert("⚠️ Wallet Not Detected!\n\nPlease install MetaMask or TrustWallet to access the Terminal.");
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
    
    // UI Update
    const connectBtn = document.getElementById("connect-btn");
    if (connectBtn) {
        connectBtn.innerText = "🟢 " + address.substring(0, 6) + "..." + address.substring(38);
        connectBtn.classList.add("connected");
        connectBtn.style.borderColor = "#0aff00"; // Green border on connect
    }
}

// --- 3. BUY FUNCTION (ENGLISH & DEEP LINK) ---
async function buyTokens() {
    if (!userAccount) {
        alert("⚠️ Access Denied.\n\nPlease CONNECT WALLET first to initiate a transfer.");
        connectWallet();
        return;
    }

    const amountInput = document.getElementById("bnb-amount");
    const bnbAmount = amountInput ? amountInput.value : "0.01"; 
    const amountInWei = web3.utils.toWei(bnbAmount.toString(), "ether");
    const contract = new web3.eth.Contract(PRESALE_ABI, PRESALE_CONTRACT_ADDRESS);

    try {
        console.log(`Initiating secure transfer: ${bnbAmount} BNB...`);
        
        // Send Transaction
        const receipt = await contract.methods.buyTokens().send({
            from: userAccount,
            value: amountInWei,
            gas: 200000 
        });

        // SUCCESS LOGIC
        console.log("Transaction Confirmed:", receipt);
        const txHash = receipt.transactionHash; 

        // UX Delay for stability
        setTimeout(() => {
            // ENGLISH CONFIRMATION MESSAGE
            const confirmed = confirm(
                "✅ TRANSACTION SUCCESSFUL!\n\n" +
                "Welcome to the SkyAI Empire.\n" +
                "Click OK to activate your VIP Status via our AI Bot."
            );
            
            if (confirmed) {
                // Deep Link to Bot (With correct PaymentBot Link)
                window.open(`https://t.me/SkyAI_PaymentBot?start=${txHash}`, "_blank");
            }
        }, 500);
        
    } catch (error) {
        console.error("Transaction failed:", error);
        alert("❌ Transaction Failed.\n\nReason: " + (error.message || "Network Error or Rejected by User."));
    }
}

// --- 4. EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.getElementById("connect-btn");
    const buyBtn = document.getElementById("buy-btn");

    if (connectBtn) connectBtn.addEventListener("click", connectWallet);
    if (buyBtn) buyBtn.addEventListener("click", buyTokens);
});
