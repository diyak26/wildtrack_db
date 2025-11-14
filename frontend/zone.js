// Default Zone Data
let zones = JSON.parse(localStorage.getItem("zones")) || [
    { name: "Zone A", area: "150 km²", desc: "Primary tiger habitat", animals: 12 },
    { name: "Zone B", area: "200 km²", desc: "Elephant corridor", animals: 8 }
];

const tableBody = document.getElementById("zoneTable");
const modal = document.getElementById("zoneModal");
const overlay = document.getElementById("overlay");

// Display Table
function loadZones() {
    tableBody.innerHTML = "";

    zones.forEach((z, index) => {
        tableBody.innerHTML += `
        <tr>
            <td><b>${z.name}</b></td>
            <td>${z.area}</td>
            <td>${z.desc}</td>
            <td>${z.animals}</td>
            <td class="actions">
                <span onclick="editZone(${index})">✏️</span>
                <span onclick="deleteZone(${index})">🗑️</span>
            </td>
        </tr>`;
    });
}

loadZones();

// Open Modal
document.getElementById("openModal").onclick = () => {
    modal.style.display = "block";
    overlay.style.display = "block";
};

// Close Modal
document.getElementById("closeModal").onclick = () => {
    modal.style.display = "none";
    overlay.style.display = "none";
};

// Save New Zone
document.getElementById("saveZone").onclick = () => {
    let newZone = {
        name: document.getElementById("zoneName").value,
        area: document.getElementById("zoneArea").value,
        desc: document.getElementById("zoneDesc").value,
        animals: document.getElementById("zoneAnimals").value
    };

    zones.push(newZone);
    localStorage.setItem("zones", JSON.stringify(zones));
    loadZones();

    modal.style.display = "none";
    overlay.style.display = "none";
};

// Delete Zone
function deleteZone(i) {
    zones.splice(i, 1);
    localStorage.setItem("zones", JSON.stringify(zones));
    loadZones();
}

// Search Filter
document.getElementById("searchInput").onkeyup = () => {
    let value = searchInput.value.toLowerCase();
    document.querySelectorAll("#zoneTable tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
};
