const table = document.getElementById("resultsTable");

let results =
    JSON.parse(localStorage.getItem("pingpongResults")) || [];

function loadResults() {

    table.innerHTML = "";

    results.forEach((result, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${result.left}</td>
            <td>${result.right}</td>
            <td>${result.winner}</td>
        `;

        table.appendChild(row);
    });
}

function clearResults() {

    localStorage.removeItem("pingpongResults");

    results = [];

    loadResults();
}

loadResults();