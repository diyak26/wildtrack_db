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

let animalsCache = [];
let editingAnimal = null;


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
    document.getElementById("idInput").readOnly = false;
    document.getElementById("nameInput").value = "";
    document.getElementById("speciesInput").value = "";
    document.getElementById("ageInput").value = "";
    document.getElementById("genderInput").value = "";
    document.getElementById("zoneInput").value = "";
    document.getElementById("healthInput").value = "";
    document.getElementById("conservationInput").value = "";
    editingAnimal = null;
    saveBtn.textContent = "Save Animal";
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
    animalsCache = animals;
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

    const payload = {
        animal_id: document.getElementById("idInput").value, 
        name: document.getElementById("nameInput").value,
        species: document.getElementById("speciesInput").value,
        age: document.getElementById("ageInput").value,
        gender: document.getElementById("genderInput").value,
        zone_id: document.getElementById("zoneInput").value,
        health_status: document.getElementById("healthInput").value,
        conservation_status: document.getElementById("conservationInput").value,
        entry_date: editingAnimal?.entry_date || new Date().toISOString().split("T")[0]
    };

    const isEditing = Boolean(editingAnimal);
    const url = isEditing
        ? "http://localhost/WILDTRACK_DB/backend/api/animal_update.php"
        : "http://localhost/WILDTRACK_DB/backend/api/animal_create.php";

    const res = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
        alert(isEditing ? "Animal updated successfully!" : "Animal added successfully!");
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

    const res = await fetch(
        `http://localhost/WILDTRACK_DB/backend/api/animal_delete.php?animal_id=${id}`
    );

    const result = await res.json();

    if (result.success) {
        alert("Animal deleted");
        displayAnimals();
    } else {
        alert("Delete failed: " + result.error);
    }
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
    const animal = animalsCache.find(a => Number(a.animal_id) === Number(id));

    if (!animal) {
        alert("Could not find that animal. Try refreshing.");
        return;
    }

    editingAnimal = animal;
    document.getElementById("idInput").value = animal.animal_id;
    document.getElementById("idInput").readOnly = true; // prevent primary key changes
    document.getElementById("nameInput").value = animal.name || "";
    document.getElementById("speciesInput").value = animal.species || "";
    document.getElementById("ageInput").value = animal.age || "";
    document.getElementById("genderInput").value = animal.gender || "";
    document.getElementById("zoneInput").value = animal.zone_id || "";
    document.getElementById("healthInput").value = animal.health_status || "";
    document.getElementById("conservationInput").value = animal.conservation_status || "";

    saveBtn.textContent = "Update Animal";
    modal.style.display = "block";
    overlay.style.display = "block";
}
