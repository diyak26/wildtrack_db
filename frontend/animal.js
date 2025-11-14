// ---------- SELECTORS ----------
const modal = document.getElementById("animalModal");
const overlay = document.getElementById("modalOverlay");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveBtn = document.getElementById("saveAnimalBtn");
const tbody = document.getElementById("animalTableBody");
const searchInput = document.getElementById("searchInput");

// ---------- LOAD DEFAULT DATA ----------
let animals = JSON.parse(localStorage.getItem("animals")) || [
    { name: "Raja", species: "Bengal Tiger", age: "5 years", gender: "Male", zone: "Zone A" },
    { name: "Lakshmi", species: "Asian Elephant", age: "12 years", gender: "Female", zone: "Zone B" },
];

// ---------- DISPLAY TABLE ----------
function displayAnimals() {
    tbody.innerHTML = "";

    animals.forEach((a, index) => {
        tbody.innerHTML += `
        <tr>
            <td><b>${a.name}</b></td>
            <td>${a.species}</td>
            <td>${a.age}</td>
            <td>${a.gender}</td>
            <td>${a.zone}</td>
            <td class="actions">
                <span onclick="deleteAnimal(${index})">🗑️</span>
            </td>
        </tr>`;
    });
}

displayAnimals();

// ---------- ADD ANIMAL ----------
openModalBtn.onclick = () => {
    modal.style.display = "block";
    overlay.style.display = "block";
};

closeModalBtn.onclick = () => {
    modal.style.display = "none";
    overlay.style.display = "none";
};

// Save new animal
saveBtn.onclick = () => {
    let newAnimal = {
        name: document.getElementById("nameInput").value,
        species: document.getElementById("speciesInput").value,
        age: document.getElementById("ageInput").value + " years",
        gender: document.getElementById("genderInput").value,
        zone: document.getElementById("zoneInput").value
    };

    animals.push(newAnimal);
    localStorage.setItem("animals", JSON.stringify(animals));

    displayAnimals();
    modal.style.display = "none";
    overlay.style.display = "none";
};

// ---------- DELETE ----------
function deleteAnimal(index) {
    animals.splice(index, 1);
    localStorage.setItem("animals", JSON.stringify(animals));
    displayAnimals();
}

// ---------- SEARCH ----------
searchInput.onkeyup = () => {
    let value = searchInput.value.toLowerCase();

    document.querySelectorAll("tbody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
};
