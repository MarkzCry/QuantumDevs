function toggleMenu() {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('showMenu');
}

async function fetchWebsites() {
    try {
        const response = await fetch('https://c7977217-93fd-4e50-a889-efe7ce226967-00-28yatvlhgsnr2.picard.replit.dev/websites');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const container = document.querySelector('.website-list');

        data.forEach(website => {
            const item = document.createElement('div');
            item.classList.add('website-item');
            item.innerHTML = `
                <a style="text-decoration: none;" href="${website.url}" target="_blank">
                    <h2>${website.title}</h2>
                    <img src="${website.image}" alt="${website.title}">
                    <p>${website.description}</p>
                </a>
            `;
            container.appendChild(item);
        });
    } catch (error) {
        console.error('Error fetching websites:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchWebsites);
