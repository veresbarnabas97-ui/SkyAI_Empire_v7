// --- 3. BUY FUNCTION (DIRECT TRANSFER MODE) ---
async function buyTokens() {
    if (!userAccount) {
        alert("⚠️ Kérlek, csatlakoztasd a tárcádat!");
        connectWallet();
        return;
    }

    const amountInput = document.getElementById("bnb-amount");
    const bnbAmount = amountInput ? amountInput.value : "0.01"; 
    
    // Ellenőrzés
    if (parseFloat(bnbAmount) < 0.0017) {
        alert("⚠️ Minimum vásárlás: 0.0017 BNB");
        return;
    }

    // Wei konverzió
    const amountInWei = web3.utils.toWei(bnbAmount.toString(), "ether");
    
    // A Célpont most a Te Wallet Címed (Ezt figyeli a Python)
    // A config-ból vagy manuálisan beégetve:
    const TARGET_WALLET = "0xC424c3119e5D1fA6dD91eF72aF25e1F4A260f69C"; 

    try {
        console.log(`Initiating transfer to Founder: ${bnbAmount} BNB...`);
        
        // Sima tranzakció küldése
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: userAccount,
                    to: TARGET_WALLET,
                    value: web3.utils.toHex(amountInWei),
                    gas: '0x5208' // 21000 GWEI (Standard transfer gas)
                },
            ],
        });

        console.log("Tx Hash:", txHash);

        // UX + Átirányítás
        setTimeout(() => {
            if (confirm("✅ SIKER! A SkyAI Rendszer észlelte a befizetést.\n\nKattints az OK-ra a VIP Aktiváláshoz!")) {
                window.open(`https://t.me/SkyAI_PaymentBot?start=${txHash}`, "_blank");
            }
        }, 1000);
        
    } catch (error) {
        console.error("Transaction failed:", error);
        alert("❌ Megszakítva vagy Hiba: " + error.message);
    }
}
