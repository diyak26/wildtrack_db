let actions = JSON.parse(localStorage.getItem("conservationActions")) || [
    {
        title: "Habitat Restoration",
        zone: "Zone A",
        status: "ongoing",
        date: "2024-01-01",
        team: "Team Alpha",
        desc: "Restore degraded forest area"
    },
    {
        title: "Anti-Poaching Patrol",
        zone: "Zone B",
        status: "planned",
        date: "2024-02-01",
        team: "Team Beta",
        desc: "Enhanced surveillance"
    }
];

const table = document.getElementById("actionTableBody");

// Display table
function loadActions() {
    table.innerHTML = "";

    actions.forEach((a, i) => {
        table.innerHTML += `
            <tr>
                <td><b>${a.title}</b></td>
                <td>${a.zone}</td>
                <td><span class="status-badge ${a.status}">${a.status}</span></td>
                <td>${a.date}</td>
                <td>${a.team}</td>
                <td>${a.desc}</td>
                <td class="actions">
                    <span onclick="editAction(${i})">✏️</span>
                    <span onclick="deleteAction(${i})">🗑️</span>
                </td>
            </tr>
        `;
    });
}
loadActions();

// Modal logic
const modal = document.getElementById("actionModal");
const overlay = document.getElementById("modalOverlay");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveActionBtn = document.getElementById("saveActionBtn");

let editIndex = null;

openModalBtn.onclick = () => {
    modal.style.display = "block";
    overlay.style.display = "block";
    saveActionBtn.textContent = "Add Action";
    document.getElementById("modalTitle").textContent = "Add Action";
    editIndex = null;
};

closeModalBtn.onclick =
overlay.onclick = () => {
    modal.style.display = "none";
    overlay.style.display = "none";
};

// Save or Edit Action
saveActionBtn.onclick = () => {
    const newAction = {
        title: actionTitle.value,
        zone: actionZone.value,
        status: actionStatus.value,
        date: actionDate.value,
        team: actionTeam.value,
        desc: actionDesc.value
    };

    if (editIndex === null) {
        actions.push(newAction);
    } else {
        actions[editIndex] = newAction;
    }

    localStorage.setItem("conservationActions", JSON.stringify(actions));
    loadActions();
    modal.style.display = "none";
    overlay.style.display = "none";
};

// Edit
function editAction(i) {
    let a = actions[i];

    actionTitle.value = a.title;
    actionZone.value = a.zone;
    actionStatus.value = a.status;
    actionDate.value = a.date;
    actionTeam.value = a.team;
    actionDesc.value = a.desc;

    document.getElementById("modalTitle").textContent = "Edit Action";
    saveActionBtn.textContent = "Save Changes";

    editIndex = i;

    modal.style.display = "block";
    overlay.style.display = "block";
}

// Delete
function deleteAction(i) {
    actions.splice(i, 1);
    localStorage.setItem("conservationActions", JSON.stringify(actions));
    loadActions();
}

// Search
document.getElementById("searchInput").onkeyup = () => {
    let filter = searchInput.value.toLowerCase();
    document.querySelectorAll("#actionTableBody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
};
