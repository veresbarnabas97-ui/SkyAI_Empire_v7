// 🌌 SkyAI Empire v7.3 - Revenue Engine

// --- CONFIGURATION ---
// 💰 YOUR WALLET (Where the BNB goes):
const OWNER_WALLET = "0xc98415672A80a26bEC29427b7284D65B73c5Ff7B"; 
// 💎 RATE (Display only):
const RATE = 1000000; // 1 BNB = 1M SKY

let web3;
let userAccount;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        
        // Event Listeners
        document.getElementById('connect-btn').addEventListener('click', connectWallet);
        document.getElementById('buy-btn').addEventListener('click', sendPayment);
        
        // Calculator Logic
        document.getElementById('bnb-amount').addEventListener('input', (e) => {
            const val = e.target.value;
            const sky = val * RATE;
            // You can add a span in HTML with id="calc-display" to show this
            // document.getElementById('calc-display').innerText = sky.toLocaleString() + " SKY";
        });
    }
});

// --- 1. CONNECT ---
async function connectWallet() {
    if (!window.ethereum) return alert("⚠️ Please install MetaMask!");
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        document.getElementById("connect-btn").innerText = "🟢 " + userAccount.substring(0,6) + "...";
        document.getElementById("connect-btn").classList.add("connected");
    } catch (e) { console.error(e); }
}

// --- 2. PAY (DIRECT TRANSFER) ---
async function sendPayment() {
    if (!userAccount) {
        alert("⚠️ Please Connect Wallet First!");
        connectWallet();
        return;
    }
    
    const amountInput = document.getElementById("bnb-amount");
    const bnbValue = amountInput.value;
    
    if (bnbValue < 0.0017) {
        alert("⚠️ Minimum Investment: 0.0017 BNB");
        return;
    }

    const amountWei = web3.utils.toWei(bnbValue, 'ether');
    const amountHex = web3.utils.toHex(amountWei);

    try {
        console.log(`Initiating Transfer: ${bnbValue} BNB -> ${OWNER_WALLET}`);
        
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: userAccount,
                to: OWNER_WALLET,
                value: amountHex,
                gas: '0x5208' // Standard Gas
            }]
        });

        console.log("✅ Success! Hash:", txHash);
        
        // --- UX MAGIC: AUTO-REDIRECT ---
        setTimeout(() => {
            const confirmed = confirm(
                "🎉 PAYMENT SUCCESSFUL!\n\n" +
                "Welcome to the Empire.\n" +
                "Click OK to activate your VIP Access now!"
            );
            
            if (confirmed) {
                // Direct link to the bot with the hash
                window.open(`https://t.me/SkyAI_PaymentBot?start=${txHash}`, "_blank");
            }
        }, 1000);

    } catch (error) {
        console.error(error);
        alert("❌ Transaction Cancelled.");
    }
}
