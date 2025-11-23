// =========================
// SELECTORS
// =========================
const modal = document.getElementById("threatModal");
const overlay = document.getElementById("modalOverlay");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveBtn = document.getElementById("saveThreatBtn");
const tbody = document.getElementById("threatTableBody");
const searchInput = document.getElementById("searchThreat");
const viewActiveAlertsBtn = document.getElementById("viewActiveAlertsBtn");

// Form inputs
const animalNameInput = document.getElementById("animalNameInput");
const animalIdInput = document.getElementById("animalIdInput");
const zoneNameInput = document.getElementById("zoneNameInput");
const zoneIdInput = document.getElementById("zoneIdInput");
const threatTypeInput = document.getElementById("threatTypeInput");
const severityInput = document.getElementById("severityInput");
const reportedDateInput = document.getElementById("reportedDateInput");
const statusInput = document.getElementById("statusInput");
const actionInput = document.getElementById("actionInput");
const modalTitle = document.getElementById("modalTitle");

let threatsCache = [];
let animalsCache = [];
let zonesCache = [];
let editingThreat = null;
let showingActiveOnly = false;

// =========================
// OPEN / CLOSE MODAL
// =========================
openModalBtn.onclick = () => {
    clearForm();
    modal.style.display = "block";
    overlay.style.display = "block";
    loadAnimalAndZoneOptions();
};

closeModalBtn.onclick = () => {
    modal.style.display = "none";
    overlay.style.display = "none";
};

overlay.onclick = () => {
    modal.style.display = "none";
    overlay.style.display = "none";
};

function clearForm() {
    animalNameInput.value = "";
    animalIdInput.value = "";
    zoneNameInput.value = "";
    zoneIdInput.value = "";
    threatTypeInput.value = "";
    severityInput.value = "";
    reportedDateInput.value = new Date().toISOString().split("T")[0];
    statusInput.value = "active";
    actionInput.value = "";
    editingThreat = null;
    modalTitle.textContent = "Add New Threat";
    saveBtn.textContent = "Add Threat";
}

// =========================
// LOAD ANIMALS AND ZONES FOR DROPDOWN
// =========================
async function loadAnimalAndZoneOptions() {
    try {
        // Load animals
        const animalsRes = await fetch("http://localhost/WILDTRACK_DB/backend/api/animal_read.php");
        const animalsResult = await animalsRes.json();
        
        if (animalsResult.success) {
            animalsCache = animalsResult.data || [];
            const animalNamesList = document.getElementById("animalNamesList");
            animalNamesList.innerHTML = "";
            animalsCache.forEach(animal => {
                const option = document.createElement("option");
                option.value = animal.name;
                option.setAttribute("data-animal-id", animal.animal_id);
                option.setAttribute("data-zone-id", animal.zone_id || "");
                animalNamesList.appendChild(option);
            });
        }

        // Load zones
        const zonesRes = await fetch("http://localhost/WILDTRACK_DB/backend/api/zone_read.php");
        const zonesResult = await zonesRes.json();
        
        if (zonesResult.success) {
            zonesCache = zonesResult.data || [];
            const zoneNamesList = document.getElementById("zoneNamesList");
            zoneNamesList.innerHTML = "";
            zonesCache.forEach(zone => {
                const option = document.createElement("option");
                option.value = zone.zone_name;
                option.setAttribute("data-zone-id", zone.zone_id);
                zoneNamesList.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error loading options:", error);
    }
}

// Auto-fill animal_id when animal name is selected
animalNameInput.addEventListener("input", () => {
    const selectedAnimal = animalsCache.find(a => a.name.toLowerCase() === animalNameInput.value.toLowerCase());
    if (selectedAnimal) {
        animalIdInput.value = selectedAnimal.animal_id;
        // Auto-fill zone if animal has a zone
        if (selectedAnimal.zone_id) {
            const animalZone = zonesCache.find(z => z.zone_id === selectedAnimal.zone_id);
            if (animalZone) {
                zoneNameInput.value = animalZone.zone_name;
                zoneIdInput.value = animalZone.zone_id;
            }
        }
    }
});

// Auto-fill zone_id when zone name is selected
zoneNameInput.addEventListener("input", () => {
    const selectedZone = zonesCache.find(z => z.zone_name.toLowerCase() === zoneNameInput.value.toLowerCase());
    if (selectedZone) {
        zoneIdInput.value = selectedZone.zone_id;
    }
});

// =========================
// LOAD THREATS FROM BACKEND
// =========================
async function displayThreats(statusFilter = null) {
    try {
        let url = "http://localhost/WILDTRACK_DB/backend/api/threat_read.php";
        if (statusFilter) {
            url += "?status=" + statusFilter;
        }

        const res = await fetch(url);

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Server error response:", errorText);
            try {
                const errorJson = JSON.parse(errorText);
                alert("Error loading threats: " + (errorJson.error || `HTTP ${res.status} error`));
            } catch {
                alert(`Error loading threats: HTTP ${res.status} error. Check console for details.`);
            }
            return;
        }

        const result = await res.json();

        if (!result.success) {
            alert("Error loading threats: " + (result.error || "Unknown error"));
            return;
        }

        const threats = result.data || [];
        threatsCache = threats;
        tbody.innerHTML = "";

        if (threats.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 20px;">No threats found. Click "+ Add Threat" to add one.</td></tr>`;
            return;
        }

        threats.forEach(t => {
            const date = t.reported_date ? new Date(t.reported_date).toLocaleDateString() : "-";
            tbody.innerHTML += `
                <tr>
                    <td><b>${t.animal_name || "-"}</b></td>
                    <td>${t.animal_id || "-"}</td>
                    <td>${t.threat_type || "-"}</td>
                    <td><span class="badge ${t.severity || "medium"}">${t.severity || "medium"}</span></td>
                    <td>${t.zone_name || "-"}</td>
                    <td>${t.zone_id || "-"}</td>
                    <td>${date}</td>
                    <td><span class="badge ${t.status || "active"}">${t.status || "active"}</span></td>
                    <td class="actions">
                        <span class="edit-btn" onclick="loadThreatForEdit(${t.alert_id})">✏️</span>
                        <span onclick="deleteThreat(${t.alert_id})">🗑️</span>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading threats:", error);
        alert("Error loading threats: " + error.message);
    }
}

displayThreats(); // initial load

// =========================
// VIEW ACTIVE ALERTS
// =========================
viewActiveAlertsBtn.onclick = () => {
    showingActiveOnly = !showingActiveOnly;
    if (showingActiveOnly) {
        displayThreats("active");
        viewActiveAlertsBtn.textContent = "📋 View All Threats";
    } else {
        displayThreats();
        viewActiveAlertsBtn.textContent = "⚠️ View Active Alerts";
    }
};

// =========================
// ADD/UPDATE THREAT
// =========================
saveBtn.onclick = async () => {
    // Validation
    if (!animalNameInput.value.trim()) {
        alert("Please enter an Animal Name");
        return;
    }

    if (!animalIdInput.value) {
        alert("Please select a valid Animal Name from the list");
        return;
    }

    if (!zoneNameInput.value.trim()) {
        alert("Please enter a Zone Name");
        return;
    }

    if (!zoneIdInput.value) {
        alert("Please select a valid Zone Name from the list");
        return;
    }

    const payload = {
        animal_id: parseInt(animalIdInput.value),
        type: threatTypeInput.value.trim() || null,
        severity: severityInput.value || null,
        reported_date: reportedDateInput.value || new Date().toISOString().split("T")[0],
        action: actionInput.value.trim() || null,
        status: statusInput.value || "active"
    };

    const isEditing = Boolean(editingThreat);
    const url = isEditing
        ? "http://localhost/WILDTRACK_DB/backend/api/threat_update.php"
        : "http://localhost/WILDTRACK_DB/backend/api/threat_create.php";

    if (isEditing) {
        payload.alert_id = editingThreat.alert_id;
    }

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
            alert(isEditing ? "Threat updated successfully!" : "Threat added successfully!");
            displayThreats(showingActiveOnly ? "active" : null);
            modal.style.display = "none";
            overlay.style.display = "none";
        } else {
            alert("Error: " + (result.error || "Unknown error"));
        }
    } catch (error) {
        console.error("Error saving threat:", error);
        alert("Error saving threat: " + error.message);
    }
};

// =========================
// DELETE THREAT
// =========================
async function deleteThreat(id) {
    if (!confirm("Are you sure you want to delete this threat alert?")) return;

    try {
        const res = await fetch(
            `http://localhost/WILDTRACK_DB/backend/api/threat_delete.php?alert_id=${id}`
        );

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Delete error response:", errorText);
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();

        if (result.success) {
            alert("Threat deleted successfully");
            displayThreats(showingActiveOnly ? "active" : null);
        } else {
            alert("Delete failed: " + (result.error || "Unknown error"));
        }
    } catch (error) {
        console.error("Error deleting threat:", error);
        alert("Error deleting threat: " + error.message);
    }
}

// =========================
// LOAD THREAT FOR EDIT
// =========================
async function loadThreatForEdit(id) {
    const threat = threatsCache.find(t => Number(t.alert_id) === Number(id));

    if (!threat) {
        alert("Could not find that threat. Try refreshing.");
        return;
    }

    editingThreat = threat;
    
    // Load animal and zone options first
    await loadAnimalAndZoneOptions();
    
    // Find animal and zone names
    const animal = animalsCache.find(a => Number(a.animal_id) === Number(threat.animal_id));
    const zone = zonesCache.find(z => Number(z.zone_id) === Number(threat.zone_id));

    animalNameInput.value = animal ? animal.name : "";
    animalIdInput.value = threat.animal_id || "";
    zoneNameInput.value = zone ? zone.zone_name : "";
    zoneIdInput.value = threat.zone_id || "";
    threatTypeInput.value = threat.threat_type || "";
    severityInput.value = threat.severity || "";
    reportedDateInput.value = threat.reported_date || new Date().toISOString().split("T")[0];
    statusInput.value = threat.status || "active";
    actionInput.value = threat.action || "";

    modalTitle.textContent = "Edit Threat";
    saveBtn.textContent = "Update Threat";
    modal.style.display = "block";
    overlay.style.display = "block";
}

// Make functions globally accessible
window.loadThreatForEdit = loadThreatForEdit;
window.deleteThreat = deleteThreat;

// =========================
// SEARCH FILTER
// =========================
searchInput.onkeyup = () => {
    let value = searchInput.value.toLowerCase();

    document.querySelectorAll("#threatTableBody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
};
