// 🌌 SkyAI Empire v7.0 - Frontend Logic

// --- CONFIGURATION ---
// Csak az új V7-es címet használjuk vásárlásra a stabilitás miatt
const PRESALE_CONTRACT_ADDRESS = "0x1fD631d33c1973158fdae72eBCa9Ca8285cE978c"; 
const SKY_TOKEN_ADDRESS = "0xcBbaDC40Cde0F12679a6b0b74fB732E02E60fa83";      
const RATE = 1000000; 

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

// --- INITIALIZATION ---
window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) handleLogin(accounts[0]);
    } else {
        console.log("SkyAI: No wallet found.");
    }
});

// --- CONNECT ---
async function connectWallet() {
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
    }
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleLogin(accounts[0]);
    } catch (error) {
        console.error(error);
    }
}

function handleLogin(address) {
    userAccount = address;
    const connectBtn = document.getElementById("connect-btn");
    if (connectBtn) {
        connectBtn.innerText = address.substring(0, 6) + "..." + address.substring(38);
        connectBtn.classList.add("connected");
    }
}

// --- BUY FUNCTION ---
async function buyTokens() {
    if (!userAccount) {
        alert("Kérlek csatlakoztasd a pénztárcád!");
        connectWallet();
        return;
    }

    const amountInput = document.getElementById("bnb-amount");
    const bnbAmount = amountInput ? amountInput.value : "0.01"; 
    const amountInWei = web3.utils.toWei(bnbAmount.toString(), "ether");
    const contract = new web3.eth.Contract(PRESALE_ABI, PRESALE_CONTRACT_ADDRESS);

    try {
        // Vásárlás indítása
        const receipt = await contract.methods.buyTokens().send({
            from: userAccount,
            value: amountInWei,
            gas: 200000 
        });

        // Siker esetén Deep Link megnyitása
        console.log("Siker:", receipt);
        const txHash = receipt.transactionHash; 

        // Kis késleltetés a UX miatt
        setTimeout(() => {
            const confirmed = confirm("✅ SIKERES VÁSÁRLÁS!\n\nKattints az OK gombra a VIP aktiválásához a Telegramon!");
            if (confirmed) {
                // Helyes Bot név (SkyAI_PaymentBot) + Hash paraméter
                window.open(`https://t.me/SkyAI_PaymentBot?start=${txHash}`, "_blank");
            }
        }, 500);
        
    } catch (error) {
        console.error(error);
        alert("❌ Hiba: " + (error.message || "Ismeretlen hiba"));
    }
}

// --- EVENTS ---
document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.getElementById("connect-btn");
    const buyBtn = document.getElementById("buy-btn");
    if (connectBtn) connectBtn.addEventListener("click", connectWallet);
    if (buyBtn) buyBtn.addEventListener("click", buyTokens);
});
