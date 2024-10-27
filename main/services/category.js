let co2Saved = 0;
let resourcesConserved = 0;
const goal = 100; // Example goal for recycling progress

function toggleItems(categoryId) {
    const itemList = document.getElementById(categoryId);
    itemList.style.display = itemList.style.display === 'block' ? 'none' : 'block';
}

// Function to log scrap details and update impact
function logScrap() {
    const scrapType = document.getElementById('scrap-type').value;
    const scrapWeight = parseFloat(document.getElementById('scrap-weight').value);
    const scrapVolume = parseFloat(document.getElementById('scrap-volume').value);

    if (isNaN(scrapWeight) || isNaN(scrapVolume)) {
        alert("Please enter valid numbers for weight and volume.");
        return;
    }

    co2Saved += scrapWeight * 0.1; // Example CO₂ savings per kg
    resourcesConserved += scrapVolume * 0.05; // Example resources savings per liter

    document.getElementById('co2-saved').innerText = co2Saved.toFixed(2);
    document.getElementById('resources-conserved').innerText = resourcesConserved.toFixed(2);

    const progressPercent = Math.min((co2Saved / goal) * 100, 100);
    document.getElementById('progress-bar').style.width = progressPercent + '%';

    document.getElementById('scrap-type').value = '';
    document.getElementById('scrap-weight').value = '';
    document.getElementById('scrap-volume').value = '';

    alert(`Scrap logged: ${scrapType} - ${scrapWeight} kg, ${scrapVolume} liters`);
}

// Function to confirm order with delay and redirect
document.getElementById("order-pickup-btn").addEventListener("click", confirmOrder);
function confirmOrder() {
    alert("Order confirmed! You have selected items to be recycled.");
    
    // Redirect to the home page after 3 seconds
    setTimeout(() => {
        window.location.href = "/main/index.html";
    }, 2000);
}