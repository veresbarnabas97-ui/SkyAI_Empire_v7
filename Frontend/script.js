// 🌌 SkyAI v9.0 GATEWAY LOGIC
const MAIN_WALLET = "0xc98415672A80a26bEC29427b7284D65B73c5Ff7B"; 
const RATE = 1000000; 
let web3, userAccount;

function log(msg) {
    const el = document.getElementById('console-log');
    if(el) {
        el.innerHTML += `> ${msg}<br>`;
        el.scrollTop = el.scrollHeight;
    }
}

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        
        document.getElementById('connect-btn').addEventListener('click', connectWallet);
        document.getElementById('buy-btn').addEventListener('click', buyTokens);
        
        document.getElementById('bnb-amount').addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            if(val > 0) document.getElementById('sky-amount').value = (val * RATE).toLocaleString();
            else document.getElementById('sky-amount').value = "";
        });
    } else {
        log("⚠️ MetaMask Not Detected.");
    }
});

async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        document.getElementById("connect-btn").innerText = "LINKED: " + userAccount.substring(0,6);
        log(`Identity Verified: ${userAccount}`);
    } catch (e) { log("Connection Failed."); }
}

async function buyTokens() {
    if (!userAccount) return alert("Connect Wallet First!");
    const bnbAmt = document.getElementById('bnb-amount').value;
    const amountWei = web3.utils.toWei(bnbAmt, 'ether');

    try {
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{ from: userAccount, to: MAIN_WALLET, value: web3.utils.toHex(amountWei) }]
        });
        log(`✅ TX SENT: ${txHash.substring(0,10)}...`);
        alert("Transaction Sent! Check Telegram Payment Bot.");
    } catch (error) { log("❌ Transaction Failed."); }
}
