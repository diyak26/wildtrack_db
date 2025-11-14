// Threat data (dummy for now)
let threats = [
    {
        animal: "Raja",
        type: "Abnormal Movement",
        severity: "high",
        location: "Zone A",
        time: "10 mins ago",
        status: "active"
    },
    {
        animal: "Lakshmi",
        type: "Health Issue",
        severity: "medium",
        location: "Zone B",
        time: "1 hour ago",
        status: "resolved"
    }
];

const table = document.getElementById("threatTableBody");

// Load rows
function loadThreats() {
    table.innerHTML = "";

    threats.forEach(t => {
        table.innerHTML += `
            <tr>
                <td><b>${t.animal}</b></td>
                <td>${t.type}</td>
                <td><span class="badge ${t.severity}">${t.severity}</span></td>
                <td>${t.location}</td>
                <td>${t.time}</td>
                <td><span class="badge ${t.status}">${t.status}</span></td>
            </tr>
        `;
    });
}
loadThreats();

// Search filter
document.getElementById("searchThreat").onkeyup = () => {
    let filter = searchThreat.value.toLowerCase();

    document.querySelectorAll("#threatTableBody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter)
            ? ""
            : "none";
    });
};
