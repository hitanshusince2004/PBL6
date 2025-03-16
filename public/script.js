document.addEventListener("DOMContentLoaded", async function () {
    var map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // ✅ Fetch Reforestation Projects from MongoDB
    async function loadProjects() {
        let response = await fetch("http://localhost:5000/api/projects");
        let projects = await response.json();
        displayProjects(projects);
    }

    // ✅ Fetch Reforestation Projects from `data.json`
    async function loadJsonProjects() {
        let response = await fetch("http://localhost:5000/api/json-projects");
        let jsonProjects = await response.json();
        displayProjects(jsonProjects);
    }

    // ✅ Function to Display Projects on Map & List
    function displayProjects(projects) {
        const projectList = document.getElementById("project-list");
        projectList.innerHTML = ""; // Clear List

        projects.forEach(data => {
            var marker = L.marker([data.lat, data.lng]).addTo(map)
                .bindPopup(`<b>${data.name}</b><br>${data.details}`);

            let listItem = document.createElement("li");
            listItem.textContent = data.name;
            listItem.onclick = function () {
                map.setView([data.lat, data.lng], 6);
                marker.openPopup();
                showProjectDetails(data);
            };
            projectList.appendChild(listItem);
        });
    }

    // ✅ Click on Map to Get Real-Time Data
    map.on('click', async function (event) {
        let lat = event.latlng.lat.toFixed(4);
        let lng = event.latlng.lng.toFixed(4);

        let response = await fetch(`http://localhost:5000/api/forest-data?lat=${lat}&lng=${lng}`);
        let data = await response.json();

        let message = `
            <b>Forest Data for (${lat}, ${lng})</b><br>
            🌲 Tree Cover Loss: ${data.treeCoverLoss}<br>
            🌱 Tree Cover Gain: ${data.treeCoverGain}<br>
            📉 Deforestation Rate: ${data.deforestationRate}%
        `;

        L.popup()
            .setLatLng(event.latlng)
            .setContent(message)
            .openOn(map);
    });

    // ✅ Function to Show Project Details
    function showProjectDetails(data) {
        const detailsDiv = document.getElementById("project-details");
        detailsDiv.innerHTML = `
            <b>${data.name}</b><br>
            📍 Location: (${data.lat}, ${data.lng})<br>
            📝 Details: ${data.details}
        `;
    }

    // ✅ Search Functionality
    function filterProjects() {
        let searchValue = document.getElementById("search-bar").value.toLowerCase();
        let items = document.querySelectorAll("#project-list li");

        items.forEach(item => {
            if (item.textContent.toLowerCase().includes(searchValue)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    }

    // ✅ Attach Search Event
    document.getElementById("search-bar").addEventListener("keyup", filterProjects);

    // ✅ Load Data from Both MongoDB and JSON
    loadProjects();
    loadJsonProjects();
});
