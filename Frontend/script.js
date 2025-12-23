const OWNER_WALLET = "0xc98415672A80a26bEC29427b7284D65B73c5Ff7B"; // IDE RAKD AZ ÚJ BIZTONSÁGOS TÁRCÁD CÍMÉT!
const RATE = 1000000; 

let web3;
let userAccount;

// Console log helper
function log(msg) {
    const el = document.getElementById('console-log');
    const time = new Date().toLocaleTimeString();
    el.innerHTML += `> [${time}] ${msg}<br>`;
    el.scrollTop = el.scrollHeight;
}

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        
        document.getElementById('connect-btn').addEventListener('click', connectWallet);
        document.getElementById('buy-btn').addEventListener('click', buyTokens);
        
        // Dynamic Calculator
        document.getElementById('bnb-amount').addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            if(val > 0) {
                const sky = val * RATE;
                document.getElementById('sky-amount').value = sky.toLocaleString();
            } else {
                document.getElementById('sky-amount').value = "0";
            }
        });
    } else {
        log("⚠️ MetaMask not detected!");
    }
});

async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        
        // UI Update
        const btn = document.getElementById("connect-btn");
        btn.innerHTML = `<span style="color:#0aff00">●</span> ${userAccount.substring(0,6)}...${userAccount.substring(38)}`;
        btn.style.borderColor = "#0aff00";
        
        log(`Wallet Connected: ${userAccount}`);
        
        // Check Network (Switch to BSC)
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
            params: [{ chainId: '0x38' }], // 56 in hex
        });
    } catch (error) {
        log("Please switch to Binance Smart Chain manually.");
    }
}

async function buyTokens() {
    if (!userAccount) return alert("Please Connect Wallet First!");
    
    const bnbAmt = document.getElementById('bnb-amount').value;
    if (bnbAmt < 0.0017) return alert("Minimum buy is 0.0017 BNB");

    const amountWei = web3.utils.toWei(bnbAmt, 'ether');
    const amountHex = web3.utils.toHex(amountWei);

    log(`Initiating Transaction: ${bnbAmt} BNB...`);

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
        
        // Átirányítás a Telegram Botra a hash-el
        setTimeout(() => {
            if(confirm("Transaction Successful! Click OK to activate VIP Protocol.")) {
                window.open(`https://t.me/SkyAI_PaymentBot?start=${txHash}`, "_blank");
            }
        }, 1000);

    } catch (error) {
        log("❌ Transaction Failed.");
        console.error(error);
    }
}
