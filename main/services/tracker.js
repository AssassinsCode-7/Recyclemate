let co2Saved = 0;
let resourcesConserved = 0;
const goal = 100; // Example goal for recycling progress

function logScrap() {
    const scrapType = document.getElementById('scrap-type').value;
    const scrapWeight = parseFloat(document.getElementById('scrap-weight').value);
    const scrapVolume = parseFloat(document.getElementById('scrap-volume').value);

    if (!scrapType || isNaN(scrapWeight) || isNaN(scrapVolume)) {
        alert("Please fill in all fields with valid data.");
        return;
    }

    // Simple impact calculation (for example purposes)
    co2Saved += scrapWeight * 0.1; // CO₂ saved per kg (example value)
    resourcesConserved += scrapVolume * 0.05; // Resources saved per liter (example value)

    // Update display
    document.getElementById('co2-saved').innerText = co2Saved.toFixed(2);
    document.getElementById('resources-conserved').innerText = resourcesConserved.toFixed(2);

    // Update progress bar
    const progressPercent = Math.min((co2Saved / goal) * 100, 100); // Cap at 100%
    document.getElementById('progress-bar').style.width = progressPercent + '%';

    // Clear input fields
    document.getElementById('scrap-type').value = '';
    document.getElementById('scrap-weight').value = '';
    document.getElementById('scrap-volume').value = '';

    alert(`Scrap logged: ${scrapType} - ${scrapWeight} kg, ${scrapVolume} liters`);
}