// 🌌 SkyAI Empire v7.2 - Frontend Logic

// --- KONFIGURÁCIÓ ---
// IDE utal a vevő (A BSC Owner tárca):
const TARGET_WALLET = "0xc98415672A80a26bEC29427b7284D65B73c5Ff7B"; 
// Csak a kalkulációhoz:
const RATE = 1000000; // 1 BNB = 1M SKY

let web3;
let userAccount;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        
        // Gombok
        document.getElementById('connect-btn').addEventListener('click', connectWallet);
        document.getElementById('buy-btn').addEventListener('click', sendBNB);
        
        // Kalkulátor
        const input = document.getElementById('bnb-amount');
        if(input) input.addEventListener('input', updateCalc);
    }
});

async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        document.getElementById("connect-btn").innerText = "🟢 " + userAccount.substring(0,6) + "...";
    } catch (e) { console.error(e); }
}

function updateCalc() {
    const val = document.getElementById('bnb-amount').value;
    const sky = val * RATE;
    // Ha van kijelző elem, frissítsd itt
    // document.getElementById('sky-calc').innerText = sky + " SKY";
}

// --- DIREKT UTALÁS FUNKCIÓ ---
async function sendBNB() {
    if (!userAccount) return alert("⚠️ Csatlakoztasd a tárcád!");
    
    const amountBNB = document.getElementById("bnb-amount").value;
    if (amountBNB < 0.0017) return alert("⚠️ Minimum: 0.0017 BNB");
    
    // Átváltás Wei-re
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
                    gas: '0x5208' // 21000 Gas (Standard Transfer)
                },
            ],
        });

        console.log("Siker! Hash:", txHash);
        
        // Visszajelzés és Bot indítás
        if(confirm("✅ SIKERES VÁSÁRLÁS!\n\nKattints az OK-ra a VIP aktiválásához a Botban!")) {
            window.open(`https://t.me/SkyAI_PaymentBot?start=${txHash}`, "_blank");
        }

    } catch (error) {
        console.error(error);
        alert("❌ Megszakítva: " + error.message);
    }
}
