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
    try {
        const res = await fetch("http://localhost/WILDTRACK_DB/backend/api/animal_read.php");

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();

        if (!result.success) {
            alert("Error loading animals: " + (result.error || "Unknown error"));
            return;
        }

        const animals = result.data || [];
        animalsCache = animals;
        tbody.innerHTML = "";

        if (animals.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 20px;">No animals found. Click "+ Add Animal" to add one.</td></tr>`;
            return;
        }

        animals.forEach(a => {
            tbody.innerHTML += `
                <tr>
                    <td>${a.animal_id}</td>
                    <td>${a.name || "-"}</td>
                    <td>${a.species || "-"}</td>
                    <td>${a.age || "-"}</td>
                    <td>${a.gender || "-"}</td>
                    <td>${a.zone_id || "-"}</td>
                    <td>${a.health_status || "-"}</td>
                    <td>${a.conservation_status || "-"}</td>
                    <td class="actions">
                        <span class="edit-btn" onclick="loadAnimalForEdit(${a.animal_id})">✏️</span>
                        <span onclick="deleteAnimal(${a.animal_id})">🗑️</span>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading animals:", error);
        alert("Error loading animals: " + error.message);
    }
}

displayAnimals(); // initial load


// =========================
// ADD NEW ANIMAL
// =========================
saveBtn.onclick = async () => {
    const animalId = document.getElementById("idInput").value.trim();
    const name = document.getElementById("nameInput").value.trim();
    const species = document.getElementById("speciesInput").value.trim();

    // Validation
    if (!animalId) {
        alert("Please enter an Animal ID");
        return;
    }

    if (!name) {
        alert("Please enter an Animal Name");
        return;
    }

    if (!species) {
        alert("Please enter a Species");
        return;
    }

    const payload = {
        animal_id: parseInt(animalId) || animalId,
        name: name,
        species: species,
        age: document.getElementById("ageInput").value.trim() || null,
        gender: document.getElementById("genderInput").value || null,
        zone_id: document.getElementById("zoneInput").value.trim() || null,
        health_status: document.getElementById("healthInput").value.trim() || null,
        conservation_status: document.getElementById("conservationInput").value.trim() || null,
        entry_date: editingAnimal?.entry_date || new Date().toISOString().split("T")[0]
    };

    // Convert empty strings to null for optional fields
    if (payload.age === "") payload.age = null;
    if (payload.zone_id === "") payload.zone_id = null;
    if (payload.zone_id) payload.zone_id = parseInt(payload.zone_id);

    const isEditing = Boolean(editingAnimal);
    const url = isEditing
        ? "http://localhost/WILDTRACK_DB/backend/api/animal_update.php"
        : "http://localhost/WILDTRACK_DB/backend/api/animal_create.php";

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();

        if (result.success) {
            alert(isEditing ? "Animal updated successfully!" : "Animal added successfully!");
            displayAnimals();
            modal.style.display = "none";
            overlay.style.display = "none";
        } else {
            alert("Error: " + (result.error || "Unknown error"));
        }
    } catch (error) {
        console.error("Error saving animal:", error);
        alert("Error saving animal: " + error.message);
    }
};


// =========================
// DELETE ANIMAL
// =========================
async function deleteAnimal(id) {
    if (!confirm("Are you sure you want to delete this animal?")) return;

    try {
        const res = await fetch(
            `http://localhost/WILDTRACK_DB/backend/api/animal_delete.php?animal_id=${id}`
        );

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();

        if (result.success) {
            alert("Animal deleted successfully");
            displayAnimals();
        } else {
            alert("Delete failed: " + (result.error || "Unknown error"));
        }
    } catch (error) {
        console.error("Error deleting animal:", error);
        alert("Error deleting animal: " + error.message);
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
