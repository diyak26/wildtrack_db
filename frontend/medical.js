let records = JSON.parse(localStorage.getItem("medicalRecords")) || [
    {
        animal: "Raja",
        type: "Vaccination",
        date: "2024-01-15",
        vet: "Dr. Sharma",
        notes: "Annual rabies vaccination"
    },
    {
        animal: "Lakshmi",
        type: "Health Checkup",
        date: "2024-01-10",
        vet: "Dr. Patel",
        notes: "Routine examination - healthy"
    }
];

const table = document.getElementById("medicalTableBody");

// Load table
function loadRecords() {
    table.innerHTML = "";

    records.forEach((r, i) => {
        table.innerHTML += `
            <tr>
                <td><b>${r.animal}</b></td>
                <td>${r.type}</td>
                <td>${r.date}</td>
                <td>${r.vet}</td>
                <td>${r.notes}</td>
                <td class="actions">
                    <span onclick="editRecord(${i})">✏️</span>
                    <span onclick="deleteRecord(${i})">🗑️</span>
                </td>
            </tr>
        `;
    });
}
loadRecords();

// Modal logic
const modal = document.getElementById("medicalModal");
const overlay = document.getElementById("modalOverlay");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveRecordBtn = document.getElementById("saveRecordBtn");

let editIndex = null;

openModalBtn.onclick = () => {
    modal.style.display = "block";
    overlay.style.display = "block";
    saveRecordBtn.textContent = "Add Record";
    document.getElementById("modalTitle").textContent = "Add Medical Record";
    editIndex = null;
};

closeModalBtn.onclick =
overlay.onclick = () => {
    modal.style.display = "none";
    overlay.style.display = "none";
};

// Save or edit record
saveRecordBtn.onclick = () => {
    const animal = document.getElementById("animalName").value;
    const type = document.getElementById("recordType").value;
    const date = document.getElementById("recordDate").value;
    const vet = document.getElementById("vetName").value;
    const notes = document.getElementById("recordNotes").value;

    const record = { animal, type, date, vet, notes };

    if (editIndex === null) {
        records.push(record);
    } else {
        records[editIndex] = record;
    }

    localStorage.setItem("medicalRecords", JSON.stringify(records));
    loadRecords();
    modal.style.display = "none";
    overlay.style.display = "none";
};

// Edit
function editRecord(index) {
    editIndex = index;

    let r = records[index];

    document.getElementById("animalName").value = r.animal;
    document.getElementById("recordType").value = r.type;
    document.getElementById("recordDate").value = r.date;
    document.getElementById("vetName").value = r.vet;
    document.getElementById("recordNotes").value = r.notes;

    document.getElementById("modalTitle").textContent = "Edit Medical Record";
    saveRecordBtn.textContent = "Save Changes";

    modal.style.display = "block";
    overlay.style.display = "block";
}

// Delete
function deleteRecord(i) {
    records.splice(i, 1);
    localStorage.setItem("medicalRecords", JSON.stringify(records));
    loadRecords();
}

// Search filter
document.getElementById("searchInput").onkeyup = () => {
    let filter = searchInput.value.toLowerCase();
    document.querySelectorAll("#medicalTableBody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
};
