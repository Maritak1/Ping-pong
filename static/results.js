// ===== REZULTĀTU LAPAS SCRIPTS =====

// Iegūst rezultātu tabulas body elementu
const table = document.getElementById("resultsTable");

// Nolasa rezultātus no localStorage
let results =
    JSON.parse(localStorage.getItem("pingpongResults")) || [];

// Ielāde rezultātu no localStorage un parāda tos tabulā
function loadResults() {
    table.innerHTML = "";

    // Ja nav rezultātu, parāda paziņojumu
    if (results.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="4" style="text-align: center; color: #d4af37;">Nav spēļu. Sāc pirmo!</td>`;
        table.appendChild(row);
        return;
    }

    // Katra rezultāta ieraksts tiek pievienots tabulai
    results.forEach((result, index) => {
        const row = document.createElement("tr");

        // Spēlētāju vārdi vai noklusējuma teksts
        const leftPlayerDisplay = result.leftPlayer || "Kreisais spēlētājs";
        const rightPlayerDisplay = result.rightPlayer || "Labais spēlētājs";

        // Tabulas rinda ar rezultātu
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${leftPlayerDisplay} (${result.left})</td>
            <td>${rightPlayerDisplay} (${result.right})</td>
            <td>${result.winner}</td>
        `;

        table.appendChild(row);
    });
}

// Izdzēš visus rezultātus no localStorage
function clearResults() {
    // Apstiprina dzēšanu
    if (!confirm("Vai tiešām vēlies izdzēst visus rezultātus?")) {
        return;
    }

    localStorage.removeItem("pingpongResults");
    results = [];
    loadResults();
}

// Ielāde rezultātu lapas ielādes laikā
loadResults();