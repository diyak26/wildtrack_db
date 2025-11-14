// Demo tracking data
let trackingData = [
    {
        name: "Raja",
        location: "18.5204°N, 73.8567°E",
        time: "2 mins ago",
        speed: "5 km/h",
        status: "active"
    },
    {
        name: "Lakshmi",
        location: "18.5304°N, 73.8667°E",
        time: "5 mins ago",
        speed: "0 km/h",
        status: "stationary"
    }
];

// Load table
const tableBody = document.getElementById("trackingTable");

function loadTrackingTable() {
    tableBody.innerHTML = "";

    trackingData.forEach((t) => {
        tableBody.innerHTML += `
        <tr>
            <td><b>${t.name}</b></td>
            <td>${t.location}</td>
            <td>${t.time}</td>
            <td>${t.speed}</td>
            <td>
                <span class="status ${t.status}">
                    ${t.status}
                </span>
            </td>
        </tr>
        `;
    });
}

loadTrackingTable();

// Search filter
document.getElementById("searchInput").addEventListener("keyup", () => {
    let filter = searchInput.value.toLowerCase();
    document.querySelectorAll("#trackingTable tr").forEach((row) => {
        row.style.display = row.innerText.toLowerCase().includes(filter)
            ? ""
            : "none";
    });
});
