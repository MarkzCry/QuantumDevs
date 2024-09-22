function toggleMenu() {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('showMenu');
}

document.addEventListener("DOMContentLoaded", () => {
    let currentSectionId = 'basicInfo';

    // Function to toggle menu visibility
    function toggleMenu() {
        const menu = document.querySelector('.menu');
        menu.classList.toggle('showMenu');
    }

    // Function to update the progress bar based on the current section
    function updateProgressBar(sections) {
        const progress = (sections.indexOf(currentSectionId) + 1) / sections.length * 100;
        const progressBar = document.querySelector('#progressBar');
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `${Math.round(progress)}%`;
    }

    // Function to show a specific section
    function showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
        document.querySelector(`#${sectionId}`).style.display = 'block';
        currentSectionId = sectionId;
        const sections = ['basicInfo', 'projectDetails', 'designPreferences', 'content', 'functionality', 'timelineBudget', 'additionalInfo'];
        updateProgressBar(sections);
    }

    // Function to validate the current section
    function validateSection(sectionId) {
        const section = document.querySelector(`#${sectionId}`);
        const inputs = section.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (input.value.trim() === '') {
                input.style.borderColor = 'red'; // Optional: highlight the invalid input
                isValid = false;
            } else {
                input.style.borderColor = ''; // Reset border color
            }
        });

        if (!isValid) {
            section.style.display = 'block'; // Ensure the section is visible
            alert("Please fill out all required fields.");
        }

        return isValid;
    }

    // Function to handle moving to the next section
    function nextSection(nextId) {
        if (validateSection(currentSectionId)) {
            showSection(nextId);
        }
    }

    // Function to handle moving to the previous section
    function prevSection(prevId) {
        showSection(prevId);
    }

    // Function to submit the form
    async function submitForm(form) {
        if (validateSection(currentSectionId)) {
            const formData = new FormData(form);
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });
    
            try {
                const response = await fetch('https://server.quantumdevs.co/submit-quote-form', {
                    method: 'POST',
                    body: formData
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const result = await response.json();
                alert(result.message || 'Form submitted successfully!');
                form.reset();
                showSection('basicInfo'); // Reset to the first section
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was an error submitting the form. Please try again.');
            }
        }
    }
    
    // Event listener for form submission
    document.querySelector('#quoteForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitForm(e.target);
    });

    // Fetch websites and populate the list
    async function fetchWebsites() {
        try {
            const response = await fetch('https://server.quantumdevs.co/websites');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const container = document.querySelector('.website-list');
            container.innerHTML = data.map(website => `
                <div class="website-item">
                    <a href="${website.url}" target="_blank" style="text-decoration: none;">
                        <h2>${website.title}</h2>
                        <img src="${website.image}" alt="${website.title}" style="max-width: 100%; height: auto;">
                        <p>${website.description}</p>
                    </a>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching websites:', error);
        }
    }

    fetchWebsites();

    // Expose functions to the global scope for use in HTML
    window.nextSection = nextSection;
    window.prevSection = prevSection;
    window.toggleMenu = toggleMenu;
});
