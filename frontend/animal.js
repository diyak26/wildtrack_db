// =========================
// SELECTORS
// =========================
const modal = document.getElementById("animalModal");
const overlay = document.getElementById("modalOverlay");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveBtn = document.getElementById("saveAnimalBtn");
const tbody = document.getElementById("animalTableBody");
const searchInput = document.getElementById("searchInput");


// =========================
// OPEN / CLOSE MODAL
// =========================
openModalBtn.onclick = () => {
    clearForm();
    modal.style.display = "block";
    overlay.style.display = "block";
};

closeModalBtn.onclick = () => {
    modal.style.display = "none";
    overlay.style.display = "none";
};

function clearForm() {
    document.getElementById("idInput").value="";
    document.getElementById("nameInput").value = "";
    document.getElementById("speciesInput").value = "";
    document.getElementById("ageInput").value = "";
    document.getElementById("genderInput").value = "";
    document.getElementById("zoneInput").value = "";
    document.getElementById("healthInput").value = "";
    document.getElementById("conservationInput").value = "";
}


// =========================
// LOAD ANIMALS FROM BACKEND
// =========================
async function displayAnimals() {
    const res = await fetch("http://localhost/WILDTRACK_DB/backend/api/animal_read.php");

    const result = await res.json();

    if (!result.success) {
        alert("Error loading animals");
        return;
    }

    const animals = result.data;
    tbody.innerHTML = "";

    animals.forEach(a => {
        tbody.innerHTML += `
            <tr>
                <td>${a.animal_id}</td>
                <td>${a.name}</td>
                <td>${a.species}</td>
                <td>${a.age || "-"}</td>
                <td>${a.gender}</td>
                <td>${a.zone_id}</td>
                <td>${a.health_status || "-"}</td>
                <td>${a.conservation_status || "-"}</td>
                <td class="actions">
                    <span class="edit-btn" onclick="loadAnimalForEdit(${a.animal_id})">✏️</span>
                    <span onclick="deleteAnimal(${a.animal_id})">🗑️</span>
                </td>
            </tr>
        `;
    });
}

displayAnimals(); // initial load


// =========================
// ADD NEW ANIMAL
// =========================
saveBtn.onclick = async () => {

    let newAnimal = {
        animal_id: document.getElementById("idInput").value, 
        name: document.getElementById("nameInput").value,
        species: document.getElementById("speciesInput").value,
        age: document.getElementById("ageInput").value,
        gender: document.getElementById("genderInput").value,
        zone_id: document.getElementById("zoneInput").value,
        health_status: document.getElementById("healthInput").value,
        conservation_status: document.getElementById("conservationInput").value,
        entry_date: new Date().toISOString().split("T")[0]
    };

    const res = await fetch("http://localhost/WILDTRACK_DB/backend/api/animal_create.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newAnimal)
    });

    const result = await res.json();

    if (result.success) {
        alert("Animal added successfully!");
        displayAnimals();
        modal.style.display = "none";
        overlay.style.display = "none";
    } else {
        alert("Error: " + result.error);
    }
};


// =========================
// DELETE ANIMAL
// =========================
async function deleteAnimal(id) {
    if (!confirm("Delete this animal?")) return;

    const res = await fetch("http://localhost/WILDTRACK_DB/backend/api/animal_delete.php?id=${id}");
    const result = await res.json();

    if (result.success) {
        alert("Animal deleted");
        displayAnimals();
    } else {
        alert("Delete failed: " + result.error);
    }
     
    displayAnimals();
}


// =========================
// SEARCH FILTER
// =========================
searchInput.onkeyup = () => {
    let value = searchInput.value.toLowerCase();

    document.querySelectorAll("tbody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
};


// =========================
// (OPTIONAL) LOAD ANIMAL FOR EDIT
// =========================
function loadAnimalForEdit(id) {
    alert("Edit feature coming next! Say: enable edit feature.");
}
