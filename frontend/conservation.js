// =========================
// SELECTORS
// =========================
const API_BASE = "http://localhost/WILDTRACK_DB/backend/api";

let table, modal, overlay, openModalBtn, closeModalBtn, saveActionBtn, searchInput;
let actionTitle, actionID, actionStatus, actionDate, actionTeam, actionDesc;

let actionsCache = [];
let editingAction = null;

// Initialize when DOM is ready
function init() {
    table = document.getElementById("actionTableBody");
    modal = document.getElementById("actionModal");
    overlay = document.getElementById("modalOverlay");
    openModalBtn = document.getElementById("openModalBtn");
    closeModalBtn = document.getElementById("closeModalBtn");
    saveActionBtn = document.getElementById("saveActionBtn");
    searchInput = document.getElementById("searchInput");

    // Form inputs
    actionTitle = document.getElementById("actionTitle");
    actionID = document.getElementById("actionID");
    actionStatus = document.getElementById("actionStatus");
    actionDate = document.getElementById("actionDate");
    actionTeam = document.getElementById("actionTeam");
    actionDesc = document.getElementById("actionDesc");

    // Check if all elements exist
    if (!table || !modal || !overlay || !openModalBtn || !closeModalBtn || !saveActionBtn) {
        console.error("Some required elements are missing!");
        return;
    }

    // Set up event listeners
    setupEventListeners();
    loadActions();
}

function setupEventListeners() {
    if (openModalBtn) {
        openModalBtn.onclick = () => {
            clearForm();
            modal.style.display = "block";
            overlay.style.display = "block";
        };
    }

    if (closeModalBtn) {
        closeModalBtn.onclick = () => {
            modal.style.display = "none";
            overlay.style.display = "none";
        };
    }

    if (overlay) {
        overlay.onclick = () => {
            modal.style.display = "none";
            overlay.style.display = "none";
        };
    }

    if (saveActionBtn) {
        saveActionBtn.type = "button"; // Prevent form submission
        saveActionBtn.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Save button clicked - event listener fired");
            saveAction();
        });
        console.log("Save button event listener attached");
    } else {
        console.error("saveActionBtn not found!");
    }

    if (searchInput) {
        searchInput.onkeyup = () => {
            let value = searchInput.value.toLowerCase();
            document.querySelectorAll("#actionTableBody tr").forEach(row => {
                row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
            });
        };
    }
}

function clearForm() {
    if (actionTitle) actionTitle.value = "";
    if (actionID) actionID.value = "";
    if (actionID) actionID.readOnly = false;
    if (actionStatus) actionStatus.value = "planned";
    if (actionDate) actionDate.value = "";
    if (actionTeam) actionTeam.value = "";
    if (actionDesc) actionDesc.value = "";
    editingAction = null;
    const modalTitle = document.getElementById("modalTitle");
    if (modalTitle) modalTitle.textContent = "Add Action";
    if (saveActionBtn) saveActionBtn.textContent = "Add Action";
}

// =========================
// LOAD ACTIONS FROM BACKEND
// =========================
async function loadActions() {
    const res = await fetch(`${API_BASE}/conservation_read.php`);

    const result = await res.json();

    if (!result.success) {
        alert("Error loading conservation actions");
        return;
    }

    const actions = result.data;
    actionsCache = actions;
    table.innerHTML = "";

    actions.forEach(a => {
        table.innerHTML += `
            <tr>
                <td><b>${a.title || "-"}</b></td>
                <td>${a.action_id || "-"}</td>
                <td><span class="status-badge ${a.status}">${a.status}</span></td>
                <td>${a.start_date || "-"}</td>
                <td>${a.team || "-"}</td>
                <td>${a.description || "-"}</td>
                <td class="actions">
                    <span onclick="loadActionForEdit(${a.action_id})">✏️</span>
                    <span onclick="deleteAction(${a.action_id})">🗑️</span>
                </td>
            </tr>
        `;
    });
}

// =========================
// SAVE / UPDATE ACTION
// =========================
async function saveAction() {
    console.log("saveAction function called");
    alert("Save action function called!"); // Temporary debug alert
    
    if (!actionID || !actionTitle) {
        console.error("Form elements not found:", { actionID, actionTitle });
        alert("Form elements not found. Please refresh the page.");
        return;
    }

    // Get form values
    const actionIdValue = actionID.value.trim();
    const titleValue = actionTitle.value.trim();
    const statusValue = actionStatus ? actionStatus.value : "planned";
    const dateValue = actionDate ? actionDate.value : "";
    const teamValue = actionTeam ? actionTeam.value.trim() : "";
    const descValue = actionDesc ? actionDesc.value.trim() : "";

    console.log("Form values:", { actionIdValue, titleValue, statusValue, dateValue, teamValue, descValue });

    // Basic validation
    if (!actionIdValue) {
        alert("Please enter an Action ID");
        if (actionID) actionID.focus();
        return;
    }

    if (!titleValue) {
        alert("Please enter an Action Title");
        if (actionTitle) actionTitle.focus();
        return;
    }

    const payload = {
        action_id: parseInt(actionIdValue),
        title: titleValue,
        status: statusValue,
        start_date: dateValue,
        team: teamValue,
        description: descValue
    };

    const isEditing = Boolean(editingAction);
    const url = isEditing
        ? `${API_BASE}/conservation_update.php`
        : `${API_BASE}/conservation_creat.php`;

    console.log("Sending request to:", url);
    console.log("Payload:", payload);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        console.log("Response status:", res.status);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();

        if (result.success) {
            alert(isEditing ? "Conservation action updated successfully!" : "Conservation action added successfully!");
            await loadActions();
            clearForm();
            if (modal) modal.style.display = "none";
            if (overlay) overlay.style.display = "none";
        } else {
            alert("Error: " + (result.error || "Unknown error"));
        }
    } catch (error) {
        console.error("Error saving action:", error);
        alert("Failed to save action: " + error.message);
    }
}

// =========================
// LOAD ACTION FOR EDIT
// =========================
function loadActionForEdit(id) {
    const action = actionsCache.find(a => Number(a.action_id) === Number(id));

    if (!action) {
        alert("Could not find that action. Try refreshing.");
        return;
    }

    editingAction = action;
    actionTitle.value = action.title || "";
    actionID.value = action.action_id || "";
    actionID.readOnly = true;
    actionStatus.value = action.status || "planned";
    actionDate.value = action.start_date || "";
    actionTeam.value = action.team || "";
    actionDesc.value = action.description || "";

    document.getElementById("modalTitle").textContent = "Edit Action";
    saveActionBtn.textContent = "Update Action";

    modal.style.display = "block";
    overlay.style.display = "block";
}

// =========================
// DELETE ACTION
// =========================
async function deleteAction(id) {
    if (!confirm("Delete this action?")) return;

    const res = await fetch(
        `${API_BASE}/conservation_delete.php?action_id=${id}`
    );

    const result = await res.json();

    if (result.success) {
        alert("Conservation action deleted");
        loadActions();
    } else {
        alert("Delete failed: " + result.error);
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Make saveAction globally accessible for debugging (after init)
setTimeout(() => {
    window.saveAction = saveAction;
    console.log("saveAction function made globally accessible");
}, 100);
