const OWNER_WALLET = "0xc98415672A80a26bEC29427b7284D65B73c5Ff7B"; 
const RATE = 1000000; 

let web3;
let userAccount;

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
        
        const connectBtn = document.getElementById('connect-btn');
        const buyBtn = document.getElementById('buy-btn');
        const bnbInput = document.getElementById('bnb-amount');

        if (connectBtn) connectBtn.addEventListener('click', connectWallet);
        if (buyBtn) buyBtn.addEventListener('click', buyTokens);
        
        if (bnbInput) {
            bnbInput.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                const skyInput = document.getElementById('sky-amount');
                if(val > 0 && skyInput) {
                    const sky = val * RATE;
                    skyInput.value = sky.toLocaleString();
                } else if (skyInput) {
                    skyInput.value = "0";
                }
            });
        }
    } else {
        log("⚠️ MetaMask not detected!");
    }
});

async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        
        const btn = document.getElementById("connect-btn");
        if (btn) {
            btn.innerHTML = `<span style="color:#0aff00">●</span> ${userAccount.substring(0,6)}...`;
            btn.style.borderColor = "#0aff00";
            btn.style.color = "#0aff00";
        }
        
        log(`Wallet Connected: ${userAccount}`);
        
        const chainId = await web3.eth.getChainId();
        if (chainId !== 56) {
            switchToBSC();
        }
        
    } catch (e) { log("Connection Error: " + e.message); }
}

async function switchToBSC() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }],
        });
    } catch (error) {
        log("Please switch to Binance Smart Chain in MetaMask.");
    }
}

async function buyTokens() {
    if (!userAccount) return alert("Please Connect Wallet First!");
    
    const bnbInput = document.getElementById('bnb-amount');
    const bnbAmt = bnbInput ? bnbInput.value : 0;
    
    if (bnbAmt < 0.0017) return alert("Minimum buy is 0.0017 BNB");

    const amountWei = web3.utils.toWei(bnbAmt, 'ether');
    const amountHex = web3.utils.toHex(amountWei);

    log(`Initiating Transfer: ${bnbAmt} BNB -> Core Wallet`);

    try {
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: userAccount,
                to: OWNER_WALLET,
                value: amountHex
            }]
        });

        log(`✅ SUCCESS! Hash: ${txHash}`);
        log(`⏳ Redirecting to Payment Bot...`);
        
        // --- JAVÍTVA: A HELYES LINK ---
        setTimeout(() => {
            if(confirm("Transaction Successful! Click OK to activate VIP Protocol.")) {
                // ITT VOLT A HIBA, MOST MÁR A JÓ LINK VAN:
                window.open(`https://t.me/SkyAI_PaymentBot?start=${txHash}`, "_blank");
            }
        }, 1000);

    } catch (error) {
        log("❌ Transaction Failed.");
        console.error(error);
    }
}
