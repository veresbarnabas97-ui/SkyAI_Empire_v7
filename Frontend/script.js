// 🌌 SkyAI Neural Interface v8.2
// Connected to: MAIN DISTRIBUTOR (Voucher Mode)

// 🛑 EZ A FŐ (RÉGI) TÁRCA CÍME!
const MAIN_WALLET = "0xc98415672A80a26bEC29427b7284D65B73c5Ff7B"; 

const RATE = 1000000; 

let web3;
let userAccount;

// Console Logger (A képernyőre ír)
function log(msg) {
    const el = document.getElementById('console-log');
    if (el) {
        const time = new Date().toLocaleTimeString();
        el.innerHTML += `> [${time}] ${msg}<br>`;
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
            if(val > 0) {
                document.getElementById('sky-amount').value = (val * RATE).toLocaleString();
            } else {
                document.getElementById('sky-amount').value = "";
            }
        });
    } else {
        log("⚠️ ERROR: Neural Link (MetaMask) Not Detected.");
    }
});

async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        
        const btn = document.getElementById("connect-btn");
        btn.innerText = "LINKED: " + userAccount.substring(0,6) + "...";
        btn.style.background = "#00f3ff";
        btn.style.color = "#000";
        
        log(`Wallet Identity Verified: ${userAccount}`);
        
        const chainId = await web3.eth.getChainId();
        if (chainId !== 56) {
            log("⚠️ WARNING: Network Mismatch. Switch to BSC.");
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x38' }],
                });
            } catch(e) { console.error(e); }
        } else {
            log("Network Status: BSC MAINNET [STABLE]");
        }
        
    } catch (e) { log("Connection Failed."); }
}

async function buyTokens() {
    if (!userAccount) return alert("Please Connect Wallet First!");
    
    const bnbAmt = document.getElementById('bnb-amount').value;
    if (bnbAmt < 0.0017) return alert("Minimum protocol: 0.0017 BNB");

    const amountWei = web3.utils.toWei(bnbAmt, 'ether');
    const amountHex = web3.utils.toHex(amountWei);

    log(`Initiating Transfer Sequence: ${bnbAmt} BNB...`);

    try {
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: userAccount,
                to: MAIN_WALLET, // Fő tárca
                value: amountHex
            }]
        });

        log(`✅ UPLINK SUCCESSFUL! Hash: ${txHash.substring(0,10)}...`);
        log(`⏳ Processing Voucher Token...`);
        
        setTimeout(() => {
            if(confirm("ACCESS GRANTED. Initialize VIP Protocol on Telegram?")) {
                window.open(`https://t.me/SkyAI_PaymentBot?start=${txHash}`, "_blank");
            }
        }, 1000);

    } catch (error) {
        log("❌ TRANSACTION ABORTED.");
    }
}
