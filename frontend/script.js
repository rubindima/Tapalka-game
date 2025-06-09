let totalCoins = 0; // Initialize total coins

function animateButton() {
    const button = document.querySelector('.circle-button');
    button.classList.add('clicked');
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 200); 
}

function addCoins() {
    totalCoins += 5; // Add 5 coins
    document.getElementById('coinCount').innerText = totalCoins; // Update displayed total
}
