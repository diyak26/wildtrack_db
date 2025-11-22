// medical.js — finished, ready to drop into your frontend
const API_BASE = "http://localhost/wildtrack_db/backend/api";
const ANIMALS_API = "http://localhost/wildtrack_db/backend/api/animal_read.php";

const medicalTable = document.getElementById("medicalTable");
const searchInput = document.getElementById("searchInput");
const filterRecordId = document.getElementById("filterRecordId");
const filterVet = document.getElementById("filterVet");
const sortBy = document.getElementById("sortBy");
const selectAll = document.getElementById("selectAll");
const bulkDeleteBtn = document.getElementById("bulkDeleteBtn");
const pageInfo = document.getElementById("pageInfo");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");

const openAddBtn = document.getElementById("openAddBtn");
const modal = document.getElementById("medicalModal");
const modalTitle = document.getElementById("modalTitle");
const closeModal = document.getElementById("closeModal");
const medicalForm = document.getElementById("medicalForm");
const saveMedical = document.getElementById("saveMedical");
const medAnimalSelect = document.getElementById("med_animal_id");

let allRecords = [];   // raw data from backend
let filtered = [];     // after filter/search
let page = 1;
const PAGE_SIZE = 8;

// small helper
function byText(x) { return (x||"").toString().toLowerCase(); }
function formatDate(d) { if (!d) return ""; return d.split(" ")[0]; }
function diagnosisTagClass(text) {
  if (!text) return "tag info";
  const t = text.toLowerCase();
  if (t.includes("fract") || t.includes("injury") || t.includes("critical")) return "tag danger";
  if (t.includes("infection") || t.includes("fever")) return "tag warning";
  if (t.includes("check") || t.includes("routine") || t.includes("vaccin")) return "tag success";
  return "tag info";
}

// show table-level message row
function showTableMessage(msg) {
  medicalTable.innerHTML = `<tr><td colspan="9" style="padding:18px;color:#666">${msg}</td></tr>`;
}

// -----------------------
// FETCH / LOAD
// -----------------------
async function loadMedical() {
  try {
    const url = `${API_BASE}/list.php`;
    console.log("Fetching from:", url);
    const res = await fetch(url, {cache: "no-store"});
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const json = await res.json();
    console.log("Response:", json);
    
    if (json.status !== "success") {
      console.error("Failed to load medical list:", json.message || json);
      allRecords = [];
      showTableMessage("Failed to load data: " + (json.message || "Unknown error"));
      return;
    }
    allRecords = json.data || [];
    console.log("Loaded records:", allRecords.length);
    populateFilters(allRecords);
    page = 1;
    applyFiltersAndRender();
  } catch (err) {
    console.error("Fetch error loading medical list:", err);
    allRecords = [];
    showTableMessage("Failed to load data: " + err.message);
  }
}

async function loadAnimalOptionsForMedical() {
  try {
    const res = await fetch(ANIMALS_API, {cache: "no-store"});
    const json = await res.json();
    if (json.status !== "success") {
      console.error("Failed to load animals:", json.message);
      medAnimalSelect.innerHTML = `<option value="">Failed to load animals</option>`;
      return;
    }
    medAnimalSelect.innerHTML = `<option value="">Select animal...</option>`;
    (json.data || []).forEach(a => {
      const opt = document.createElement("option");
      opt.value = a.animal_id;
      // prefer a.species or a.animal_name depending on your animals table fields
      const label = a.species || a.animal_name || `ID ${a.animal_id}`;
      opt.textContent = `${label} (ID: ${a.animal_id})`;
      medAnimalSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Error loading animals:", err);
    medAnimalSelect.innerHTML = `<option value="">Failed to load animals</option>`;
  }
}

// populate filter dropdowns
function populateFilters(data) {
  const types = new Set();
  const vets = new Set();
  data.forEach(r => {
    if (r.record_id) types.add(r.record_id);
    if (r.vet_name) vets.add(r.vet_name);
  });

  filterRecordId.innerHTML = `<option value="">All Record Types</option>` + [...types].map(t => `<option>${t}</option>`).join("");
  filterVet.innerHTML = `<option value="">All Vets</option>` + [...vets].map(v => `<option>${v}</option>`).join("");
}

// -----------------------
// RENDER
// -----------------------
function applyFiltersAndRender() {
  const q = byText(searchInput.value);
  filtered = allRecords.filter(r => {
    const text = [
      r.animal_name,
      r.diagnosis,
      r.vet_name,
      r.notes,
      r.record_id
    ].map(byText).join(" ");
    if (q && !text.includes(q)) return false;
    if (filterRecordId.value && r.record_id !== filterRecordId.value) return false;
    if (filterVet.value && r.vet_name !== filterVet.value) return false;
    return true;
  });

  // sort
  switch (sortBy.value) {
    case "date_desc": filtered.sort((a,b)=> new Date(b.treatment_date) - new Date(a.treatment_date)); break;
    case "date_asc": filtered.sort((a,b)=> new Date(a.treatment_date) - new Date(b.treatment_date)); break;
    case "animal_asc": filtered.sort((a,b)=> byText(a.animal_name).localeCompare(byText(b.animal_name))); break;
    case "animal_desc": filtered.sort((a,b)=> byText(b.animal_name).localeCompare(byText(a.animal_name))); break;
  }

  page = Math.max(1, Math.min(page, Math.ceil(filtered.length / PAGE_SIZE) || 1));
  renderTable();
}

function renderTable() {
  medicalTable.innerHTML = "";
  if (!filtered.length) {
    showTableMessage("No medical records found.");
    pageInfo.textContent = `Page 1 / 1`;
    return;
  }

  const start = (page - 1) * PAGE_SIZE;
  const pageSlice = filtered.slice(start, start + PAGE_SIZE);
  pageInfo.textContent = `Page ${page} / ${Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}`;

  pageSlice.forEach(row => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><input type="checkbox" class="rowCheck" data-id="${row.followup_id}"></td>
      <td><b>${row.animal_name || ("ID "+(row.animal_id||""))}</b><div class="muted">#${row.animal_id}</div></td>
      <td>${escapeHtml(row.record_id || "")}</td>
      <td>${formatDate(row.treatment_date)}</td>
      <td>${escapeHtml(row.vet_name || "")}</td>
      <td><span class="${diagnosisTagClass(row.diagnosis)}">${escapeHtml(row.diagnosis || "—")}</span></td>
      <td>${escapeHtml(row.medication || "")}</td>
      <td title="${escapeHtml(row.notes || "")}">${escapeHtml((row.notes || "").slice(0,60))}</td>
      <td>
        <span class="icon edit" data-id="${row.followup_id}" title="Edit">✎</span>
        <span class="icon delete" data-id="${row.followup_id}" title="Delete">🗑️</span>
      </td>
    `;
    medicalTable.appendChild(tr);
  });

  attachRowHandlers();
}

// small HTML escape to avoid injecting accidental markup from DB fields
function escapeHtml(str) {
  if (!str) return "";
  return str.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
}

// -----------------------
// EVENTS
// -----------------------
searchInput.oninput = () => { page = 1; applyFiltersAndRender(); };
filterRecordId.onchange = () => { page = 1; applyFiltersAndRender(); };
filterVet.onchange = () => { page = 1; applyFiltersAndRender(); };
sortBy.onchange = () => { applyFiltersAndRender(); };

prevPage.onclick = () => { page = Math.max(1, page-1); renderTable(); };
nextPage.onclick = () => { page = Math.min(Math.ceil(filtered.length / PAGE_SIZE), page+1); renderTable(); };

selectAll.onchange = () => {
  document.querySelectorAll(".rowCheck").forEach(cb => cb.checked = selectAll.checked);
};

bulkDeleteBtn.onclick = async () => {
  const ids = Array.from(document.querySelectorAll(".rowCheck"))
    .filter(cb => cb.checked)
    .map(cb => cb.dataset.id);

  if (!ids.length) { alert("Select records first."); return; }
  if (!confirm(`Delete ${ids.length} record(s)?`)) return;

  try {
    const res = await fetch(`${API_BASE}/delete.php`, {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ followup_ids: ids })   // backend should accept array
    });
    const json = await res.json();
    if (json.status === "success") {
      alert("Deleted");
      await loadMedical();
    } else alert("Delete failed: " + (json.message||"unknown"));
  } catch (err) { alert("Failed to connect to backend."); console.error(err); }
};

// open modal for add
openAddBtn.onclick = () => {
  modalTitle.textContent = "Add Medical Record";
  medicalForm.reset();
  document.getElementById("med_followup_id").value = "";
  modal.setAttribute("aria-hidden", "false");
};

// close modal
if (closeModal) closeModal.onclick = () => modal.setAttribute("aria-hidden","true");

// also close modal when clicking backdrop
modal.addEventListener("click", (ev) => {
  if (ev.target === modal) modal.setAttribute("aria-hidden","true");
});

// attach edit/delete icons
function attachRowHandlers() {
  document.querySelectorAll(".icon.edit").forEach(btn => {
    btn.onclick = () => openEditForm(btn.dataset.id);
  });

  document.querySelectorAll(".icon.delete").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      if (!confirm("Delete this medical record?")) return;
      try {
        const res = await fetch(`${API_BASE}/delete.php`, {
          method:"POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ followup_id: id })
        });
        const json = await res.json();
        if (json.status === "success") await loadMedical();
        else alert("Delete failed: " + (json.message||"unknown"));
      } catch (err) { alert("Failed to connect to backend."); console.error(err); }
    };
  });
}

// open edit form and populate
function openEditForm(followup_id) {
  const rec = allRecords.find(r => String(r.followup_id) === String(followup_id));
  if (!rec) return alert("Record not found");

  modalTitle.textContent = "Edit Medical Record";
  document.getElementById("med_followup_id").value = rec.followup_id || "";
  document.getElementById("med_animal_id").value = rec.animal_id || "";
  document.getElementById("med_record_id").value = rec.record_id || "";
  document.getElementById("med_treatment_date").value = rec.treatment_date ? rec.treatment_date.split(" ")[0] : "";
  document.getElementById("med_vet_name").value = rec.vet_name || "";
  document.getElementById("med_diagnosis").value = rec.diagnosis || "";
  document.getElementById("med_treatment").value = rec.treatment || "";
  document.getElementById("med_medication").value = rec.medication || "";
  document.getElementById("med_notes").value = rec.notes || "";

  modal.setAttribute("aria-hidden","false");
}

// -----------------------
// SAVE ADD / EDIT
// -----------------------
medicalForm.onsubmit = async (e) => {
  e.preventDefault();

  const payload = {
    followup_id: document.getElementById("med_followup_id").value || null,
    record_id: document.getElementById("med_record_id").value.trim(),
    animal_id: parseInt(document.getElementById("med_animal_id").value) || 0,
    treatment_date: document.getElementById("med_treatment_date").value,
    vet_name: document.getElementById("med_vet_name").value.trim(),
    diagnosis: document.getElementById("med_diagnosis").value.trim(),
    treatment: document.getElementById("med_treatment").value.trim(),
    medication: document.getElementById("med_medication").value.trim(),
    notes: document.getElementById("med_notes").value.trim()
  };

  // basic validation
  if (!payload.animal_id || !payload.record_id || !payload.treatment_date) {
    alert("Animal, Record Type and Treatment Date are required.");
    return;
  }

  const endpoint = payload.followup_id ? `${API_BASE}/update.php` : `${API_BASE}/add.php`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.status === "success") {
      modal.setAttribute("aria-hidden","true");
      await loadMedical();
    } else {
      alert("Save failed: " + (json.message || "unknown"));
      console.error("Save error:", json);
    }
  } catch (err) {
    alert("Failed to connect to backend.");
    console.error(err);
  }
};

// -----------------------
// INIT
// -----------------------
async function init() {
  // load animals first for modal dropdown
  await loadAnimalOptionsForMedical();
  await loadMedical();
}

// start
document.addEventListener("DOMContentLoaded", init);
