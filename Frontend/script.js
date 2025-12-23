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
        
        // Kalkulátor
        if (amountInput) {
            amountInput.addEventListener('input', () => {
                // Opcionális: itt lehetne frissíteni a UI-t
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

// --- 3. DIREKT UTALÁS + AUTOMATA BOT NYITÁS ---
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
        
        // Tranzakció kérése a MetaMask-tól
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

        console.log("✅ Siker! Hash:", txHash);
        
        // --- ITT A KULCS: AZONNALI ÁTIRÁNYÍTÁS A BOTRA ---
        // Kicsit várunk, hogy a MetaMask ablak eltűnjön
        setTimeout(() => {
            // Ez a link közvetlenül a Bothoz visz és átadja a Hash-t
            const botLink = `https://t.me/SkyAI_PaymentBot?start=${txHash}`;

            // A böngészők blokkolják az automatikus ablaknyitást, ha nem felhasználói kattintás váltja ki.
            // Ezért kell a confirm ablak: amint a user rányom az OK-ra, megnyílik a Telegram.
            if(confirm("✅ SIKERES VÁSÁRLÁS!\n\nKattints az OK gombra a VIP JOGOSULTSÁG aktiválásához!")) {
                window.open(botLink, "_blank");
            }
        }, 1000);

    } catch (error) {
        console.error(error);
        alert("❌ Megszakítva: " + (error.message || "A tranzakció elutasítva."));
    }
}
