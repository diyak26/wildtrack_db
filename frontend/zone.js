// =========================
// SELECTORS
// =========================
const zoneModal = document.getElementById("zoneModal");
const zoneOverlay = document.getElementById("overlay");
const openZoneModalBtn = document.getElementById("openModal");
const closeZoneModalBtn = document.getElementById("closeModal");
const saveZoneBtn = document.getElementById("saveZone");
const zoneTable = document.getElementById("zoneTable");
const zoneSearchInput = document.getElementById("searchInput");

let zonesCache = [];
let editingZone = null;


// =========================
// OPEN / CLOSE MODAL
// =========================
openZoneModalBtn.onclick = () => {
    clearZoneForm();
    zoneModal.style.display = "block";
    zoneOverlay.style.display = "block";
};

closeZoneModalBtn.onclick = () => {
    zoneModal.style.display = "none";
    zoneOverlay.style.display = "none";
};

function clearZoneForm() {
    document.getElementById("zoneId").value = "";
    document.getElementById("zoneId").readOnly = false;
    document.getElementById("zoneName").value = "";
    document.getElementById("zoneDesc").value = "";
    document.getElementById("zoneArea").value = "";
    editingZone = null;
    saveZoneBtn.textContent = "Add Zone";
}


// =========================
// LOAD ZONES FROM BACKEND
// =========================
async function displayZones() {
    const res = await fetch("http://localhost/WILDTRACK_DB/backend/api/zone_read.php");
    const result = await res.json();

    if (!result.success) {
        alert("Error loading zones");
        return;
    }

    zonesCache = result.data;
    zoneTable.innerHTML = "";

    zonesCache.forEach(z => {
        zoneTable.innerHTML += `
            <tr>
                <td>${z.zone_id}</td>
                <td>${z.zone_name}</td>
                <td>${z.description || "-"}</td>
                <td>${z.area}</td>
                <td>${z.animals_cnt ?? "-"}</td>
                <td class="actions">
                    <span class="edit-btn" onclick="loadZoneForEdit(${z.zone_id})">✏️</span>
                    <span onclick="deleteZone(${z.zone_id})">🗑️</span>
                </td>
            </tr>
        `;
    });
}

displayZones(); // initial load


// =========================
// ADD / UPDATE ZONE
// =========================
saveZoneBtn.onclick = async () => {
    const payload = {
        zone_id: document.getElementById("zoneId").value,
        zone_name: document.getElementById("zoneName").value,
        description: document.getElementById("zoneDesc").value,
        area: document.getElementById("zoneArea").value
    };

    if (!payload.zone_id || !payload.zone_name || !payload.description || !payload.area) {
        alert("Please fill in all required fields");
        return;
    }

    const isEditing = Boolean(editingZone);
    const url = isEditing
        ? "http://localhost/WILDTRACK_DB/backend/api/zone_update.php"
        : "http://localhost/WILDTRACK_DB/backend/api/zone_create.php";

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
        alert(isEditing ? "Zone updated successfully!" : "Zone added successfully!");
        displayZones();
        clearZoneForm();
        zoneModal.style.display = "none";
        zoneOverlay.style.display = "none";
    } else {
        alert("Error: " + result.error);
    }
};


// =========================
// DELETE ZONE
// =========================
async function deleteZone(id) {
    if (!confirm("Delete this zone?")) return;

    const res = await fetch(`http://localhost/WILDTRACK_DB/backend/api/zone_delete.php?zone_id=${id}`);
    const result = await res.json();

    if (result.success) {
        alert("Zone deleted");
        displayZones();
    } else {
        alert("Delete failed: " + result.error);
    }
}


// =========================
// SEARCH FILTER
// =========================
zoneSearchInput.onkeyup = () => {
    let value = zoneSearchInput.value.toLowerCase();

    document.querySelectorAll("#zoneTable tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
};


// =========================
// LOAD ZONE FOR EDIT
// =========================
function loadZoneForEdit(id) {
    const zone = zonesCache.find(z => Number(z.zone_id) === Number(id));

    if (!zone) {
        alert("Could not find that zone. Try refreshing.");
        return;
    }

    editingZone = zone;
    document.getElementById("zoneId").value = zone.zone_id;
    document.getElementById("zoneId").readOnly = true;
    document.getElementById("zoneName").value = zone.zone_name || "";
    document.getElementById("zoneDesc").value = zone.description || "";
    document.getElementById("zoneArea").value = zone.area || "";

    saveZoneBtn.textContent = "Update Zone";
    zoneModal.style.display = "block";
    zoneOverlay.style.display = "block";
}
