// DOM Elements
const tableBody = document.getElementById("trackingTable");
const searchInput = document.getElementById("searchInput");
const gpsModal = document.getElementById("gpsFormModal");
const editGPSModal = document.getElementById("editGPSModal");
const openGPSBtn = document.getElementById("openGPSFormBtn");
const saveGPSBtn = document.getElementById("saveGPSBtn");
const updateGPSBtn = document.getElementById("updateGPSBtn");
const cancelGPSBtn = document.getElementById("cancelGPSBtn");
const cancelEditGPSBtn = document.getElementById("cancelEditGPSBtn");

const inputAnimalId = document.getElementById("gps_animal_id");
const inputGpsLocation = document.getElementById("gps_location");
const inputMovement = document.getElementById("gps_movement");
const inputTime = document.getElementById("gps_time");
const editTrackingId = document.getElementById("edit_tracking_id");
const editGpsLocation = document.getElementById("edit_gps_location");
const editMovement = document.getElementById("edit_gps_movement");
const editTime = document.getElementById("edit_gps_time");

const BASE = "http://localhost/WILDTRACK_DB/backend/api/gps";
let currentData = [];

// Modal handlers
openGPSBtn && (openGPSBtn.onclick = () => {
    inputAnimalId.value = "";
    inputGpsLocation.value = "";
    inputMovement.value = "";
    inputTime.value = "";
    gpsModal.style.display = "flex";
});

cancelGPSBtn && (cancelGPSBtn.onclick = () => gpsModal.style.display = "none");
cancelEditGPSBtn && (cancelEditGPSBtn.onclick = () => editGPSModal.style.display = "none");

window.addEventListener("click", (e) => {
    if (e.target === gpsModal) gpsModal.style.display = "none";
    if (e.target === editGPSModal) editGPSModal.style.display = "none";
});

// Load data
async function loadTrackingData() {
    try {
        const resp = await fetch(`${BASE}/gps_list.php`);
        const json = await resp.json();
        
        if (json.status !== "success") {
            tableBody.innerHTML = `<tr><td colspan="5">Failed to load data</td></tr>`;
            return;
        }
        
        currentData = json.data || [];
        displayTrackingTable(currentData);
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="5">Connection error</td></tr>`;
    }
}

// Display table
function displayTrackingTable(data) {
    tableBody.innerHTML = "";
    
    if (!data || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5">No GPS records found</td></tr>`;
        return;
    }
    
    data.forEach((t) => {
        const name = t.animal_name || (t.animal_id ? `#${t.animal_id}` : "—");
        tableBody.innerHTML += `
            <tr>
                <td><b>${escapeHtml(name)}</b></td>
                <td>${escapeHtml(t.gps_location || "-")}</td>
                <td>${escapeHtml(t.time_stamp || "-")}</td>
                <td>${escapeHtml(t.movement_pattern || "-")}</td>
                <td class="actions">
                    <button class="edit-gps-btn" data-id="${t.tracking_id}">✏️</button>
                    <button class="delete-gps-btn" data-id="${t.tracking_id}">🗑️</button>
                </td>
            </tr>`;
    });
    
    attachHandlers();
}

// Attach edit/delete handlers
function attachHandlers() {
    document.querySelectorAll(".edit-gps-btn").forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            const record = currentData.find(r => r.tracking_id == id);
            if (!record) return;
            
            editTrackingId.value = record.tracking_id;
            editGpsLocation.value = record.gps_location || "";
            editMovement.value = record.movement_pattern || "";
            editTime.value = record.time_stamp ? record.time_stamp.replace(" ", "T").substring(0, 16) : "";
            editGPSModal.style.display = "flex";
        };
    });
    
    document.querySelectorAll(".delete-gps-btn").forEach(btn => {
        btn.onclick = async () => {
            if (!confirm("Delete this GPS record?")) return;
            
            try {
                const res = await fetch(`${BASE}/gps_delete.php`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tracking_id: btn.dataset.id })
                });
                
                const json = await res.json();
                if (json.status === "success") {
                    loadTrackingData();
                } else {
                    alert("Delete failed");
                }
            } catch (err) {
                alert("Connection error");
            }
        };
    });
}

// Add GPS
saveGPSBtn && (saveGPSBtn.onclick = async () => {
    const animalId = parseInt(inputAnimalId.value) || 0;
    const gpsLocation = inputGpsLocation.value.trim();
    
    if (animalId <= 0 || !gpsLocation) {
        alert("Animal ID and GPS location are required");
        return;
    }
    
    try {
        const res = await fetch(`${BASE}/gps_add.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                animal_id: animalId,
                gps_location: gpsLocation,
                movement_pattern: inputMovement.value.trim(),
                time_stamp: inputTime.value.trim()
            })
        });
        
        const json = await res.json();
        if (json.status === "success") {
            gpsModal.style.display = "none";
            inputAnimalId.value = "";
            inputGpsLocation.value = "";
            inputMovement.value = "";
            inputTime.value = "";
            loadTrackingData();
        } else {
            alert("Error: " + (json.message || "Failed to save"));
        }
    } catch (err) {
        alert("Connection error");
    }
});

// Update GPS
updateGPSBtn && (updateGPSBtn.onclick = async () => {
    const trackingId = parseInt(editTrackingId.value) || 0;
    const gpsLocation = editGpsLocation.value.trim();
    
    if (trackingId <= 0 || !gpsLocation) {
        alert("Tracking ID and GPS location are required");
        return;
    }
    
    try {
        const res = await fetch(`${BASE}/gps_update.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tracking_id: trackingId,
                gps_location: gpsLocation,
                movement_pattern: editMovement.value.trim(),
                time_stamp: editTime.value.trim()
            })
        });
        
        const json = await res.json();
        if (json.status === "success") {
            editGPSModal.style.display = "none";
            loadTrackingData();
        } else {
            alert("Error: " + (json.message || "Failed to update"));
        }
    } catch (err) {
        alert("Connection error");
    }
});

// Search filter
searchInput && searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    document.querySelectorAll("#trackingTable tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
});

// Helper function
function escapeHtml(text) {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Initialize
loadTrackingData();
