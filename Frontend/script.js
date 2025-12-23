// 🌌 SkyAI Empire v7.2 - Frontend Logic

// --- KONFIGURÁCIÓ ---
// IDE utal a vevő (A BSC Owner tárca):
const TARGET_WALLET = "0xc98415672A80a26bEC29427b7284D65B73c5Ff7B"; 
// Csak a kalkulációhoz:
const RATE = 1000000; // 1 BNB = 1M SKY

let web3;
let userAccount;

// --- 1. INITIALIZATION ---
window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        console.log("🌌 SkyAI: Web3 Uplink Established.");
        
        // Gomb figyelők
        const connectBtn = document.getElementById("connect-btn");
        const buyBtn = document.getElementById("buy-btn");
        const amountInput = document.getElementById("bnb-amount");

        if (connectBtn) connectBtn.addEventListener("click", connectWallet);
        if (buyBtn) buyBtn.addEventListener("click", sendBNB);
        
        // Ha van kalkulátor kijelző, itt frissítheted
        if (amountInput) {
            amountInput.addEventListener('input', () => {
                console.log("Kalkulált SKY:", amountInput.value * RATE);
            });
        }
    } else {
        console.log("⚠️ No Wallet found.");
    }
});

// --- 2. WALLET CONNECT ---
async function connectWallet() {
    if (!window.ethereum) return alert("⚠️ Telepíts MetaMask-ot!");
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        
        const btn = document.getElementById("connect-btn");
        if(btn) {
            btn.innerText = "🟢 " + userAccount.substring(0, 6) + "...";
            btn.classList.add("connected");
        }
    } catch (e) { console.error(e); }
}

// --- 3. DIREKT UTALÁS (CONTRACT NÉLKÜL) ---
async function sendBNB() {
    if (!userAccount) {
        alert("⚠️ Kérlek csatlakoztasd a tárcádat!");
        connectWallet();
        return;
    }
    
    const amountInput = document.getElementById("bnb-amount");
    const amountBNB = amountInput ? amountInput.value : "0.01";
    
    if (parseFloat(amountBNB) < 0.0017) {
        alert("⚠️ Minimum vásárlás: 0.0017 BNB");
        return;
    }
    
    // Átváltás Wei-re és Hex-re a tranzakcióhoz
    const amountWei = web3.utils.toWei(amountBNB.toString(), 'ether');
    const amountHex = web3.utils.toHex(amountWei);

    try {
        console.log(`Utalás indítása: ${amountBNB} BNB -> ${TARGET_WALLET}`);
        
        // Tranzakció kérése a MetaMask-tól (eth_sendTransaction)
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: userAccount,
                    to: TARGET_WALLET,
                    value: amountHex,
                    gas: '0x5208' // 21000 Gas (Standard simple transfer)
                },
            ],
        });

        console.log("Siker! Hash:", txHash);
        
        // Késleltetés a UX miatt, majd átirányítás
        setTimeout(() => {
            const go = confirm(
                "✅ SIKERES VÁSÁRLÁS!\n\n" +
                "A rendszer érzékelte a tranzakciót.\n" +
                "Kattints az OK-ra a VIP aktiválásához!"
            );
            
            if (go) {
                // Deep Link a Bot-hoz (Start paraméterrel)
                window.open(`https://t.me/SkyAI_PaymentBot?start=${txHash}`, "_blank");
            }
        }, 1000);

    } catch (error) {
        console.error(error);
        alert("❌ Megszakítva: " + (error.message || "A felhasználó elutasította."));
    }
}
