const PRESALE_ABI = [
    { "inputs": [], "name": "totalBnBRaised", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

async function updateDashboardStats() {
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(PRESALE_ABI, "0x1fD631d33c1973158fdae72eBCa9Ca8285cE978c");

        try {
            // Valós BNB bevétel lekérése a szerződésből
            const raisedWei = await contract.methods.totalBnBRaised().call();
            const raisedBNB = web3.utils.fromWei(raisedWei, 'ether');
            
            // UI frissítése (ha léteznek az ID-k)
            document.querySelector(".stats-grid .card:nth-child(2) .value").innerText = raisedBNB + " BNB";
            console.log("Dashboard frissítve a blokkláncról.");
        } catch (e) {
            console.error("Hiba a statisztikák lekérésekor:", e);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateDashboardStats();
    // 5 percenként frissít
    setInterval(updateDashboardStats, 300000);
});
