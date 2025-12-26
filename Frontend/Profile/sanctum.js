// ⚜️ SANCTUM VIP LOGIC
const VIP_WALLET = "0xc98415672A80a26bEC29427b7284D65B73c5Ff7B"; 
let web3, userAccount;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        document.getElementById('vip-connect-btn').addEventListener('click', connectVip);
        document.getElementById('vip-buy-btn').addEventListener('click', buyVip);
    }
});

async function connectVip() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAccount = accounts[0];
    document.getElementById("vip-connect-btn").innerText = "⚜️ ID VERIFIED: " + userAccount.substring(0,6);
}

async function buyVip() {
    if (!userAccount) return alert("Verify Identity First!");
    const amt = document.getElementById('vip-bnb').value;
    const wei = web3.utils.toWei(amt, 'ether');
    
    try {
        await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{ from: userAccount, to: VIP_WALLET, value: web3.utils.toHex(wei) }]
        });
        alert("⚜️ VIP ACCESS GRANTED. Welcome to the Inner Circle.");
    } catch (e) { alert("Access Denied."); }
}

function showTab(id) {
    document.querySelectorAll('.content-tab').forEach(el => el.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}
