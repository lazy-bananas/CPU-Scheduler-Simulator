import { fetchComparison, fetchSchedule } from './api.js';
import { drawGantt, drawProcessCharts } from './charts.js';

let pidCounter = 1;

export function addRow() {
    const table = document.getElementById("tableBody");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${pidCounter}</td>
        <td><input type="number" class="arrival-input" value="0"></td>
        <td><input type="number" class="burst-input" value="1"></td>
        <td><input type="number" class="priority-input" value="1"></td>
        <td><button class="delete-btn">Delete</button></td>
    `;
    
    row.querySelector(".delete-btn").onclick = () => row.remove();
    table.appendChild(row);
    pidCounter++;
}

export function clearTable() {
    document.getElementById("tableBody").innerHTML = "";
    pidCounter = 1;
}

export function toggleTheme() {
    document.body.classList.toggle("dark");
    const btn = document.getElementById("themeBtn");
    btn.innerText = document.body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
}

export async function calculate() {
    const rows = document.querySelectorAll("#tableBody tr");
    const processes = [];

    rows.forEach((row, index) => {
        const inputs = row.querySelectorAll("input");
        const arrival = parseInt(inputs[0].value);
        const burst = parseInt(inputs[1].value);
        const priority = parseInt(inputs[2].value);

        if (isNaN(arrival) || isNaN(burst) || arrival < 0 || burst <= 0) {
            alert(`Invalid input in row ${index + 1}`);
            throw new Error("Invalid input");
        }

        processes.push({ pid: index + 1, arrival, burst, priority: priority || 0 });
    });

    const algo = document.getElementById("algorithm").value;
    const quantum = parseInt(document.getElementById("quantum").value) || 0;

    if (algo === "round_robin" && quantum <= 0) {
        alert("Please enter a valid time quantum for Round Robin.");
        return;
    }

    try {
        const data = await fetchSchedule(algo, processes, quantum);
        displayResult(data);
    } catch (err) {
        alert(err.message);
    }
}

export async function compareAll() {
    const rows = document.querySelectorAll("#tableBody tr");
    const processes = [];

    rows.forEach((row, index) => {
        const inputs = row.querySelectorAll("input");
        processes.push({ 
            pid: index + 1, 
            arrival: parseInt(inputs[0].value) || 0, 
            burst: parseInt(inputs[1].value) || 1, 
            priority: parseInt(inputs[2].value) || 1 
        });
    });

    const quantum = parseInt(document.getElementById("quantum").value) || 2;

    try {
        const data = await fetchComparison(processes, quantum);
        displayComparisonResult(data);
    } catch (err) {
        alert(err.message);
    }
}

function displayComparisonResult(data) {
    const container = document.getElementById("comparisonSection");
    container.style.display = "block";
    const table = document.getElementById("comparisonTable");
    
    table.innerHTML = `
        <tr>
            <th>Algorithm</th>
            <th>Avg Waiting Time</th>
            <th>Avg Turnaround Time</th>
        </tr>
    `;

    data.forEach(item => {
        table.innerHTML += `
            <tr>
                <td>${getAlgorithmLabel(item.algorithm)}</td>
                <td>${item.avg_waiting_time.toFixed(2)}</td>
                <td>${item.avg_turnaround_time.toFixed(2)}</td>
            </tr>
        `;
    });
}

function getAlgorithmLabel(algorithm) {
    const labels = {
        fcfs: "FCFS",
        sjf: "SJF (Non-Preemptive)",
        srtf: "SJF (Preemptive)",
        nonpre_prior: "Priority (Non-Preemptive)",
        pre_prior: "Priority (Preemptive)",
        round_robin: "Round Robin"
    };

    return labels[algorithm] || algorithm;
}

function displayResult(data) {
    const table = document.getElementById("resultTable");
    table.innerHTML = `
        <tr>
            <th>Process ID</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            <th>Completion Time</th>
            <th>Turnaround Time</th>
            <th>Waiting Time</th>
        </tr>
    `;

    data.processes.forEach(p => {
        table.innerHTML += `
            <tr>
                <td>${p.pid}</td>
                <td>${p.arrival}</td>
                <td>${p.burst}</td>
                <td>${p.completion}</td>
                <td>${p.turnaround}</td>
                <td>${p.waiting}</td>
            </tr>
        `;
    });

    document.getElementById("avgWT").innerText = data.avg_waiting_time.toFixed(2);
    document.getElementById("avgTAT").innerText = data.avg_turnaround_time.toFixed(2);

    drawGantt(data.gantt);
    drawProcessCharts(data.processes, data.gantt);
}

export function initKeyboardNav() {
    document.addEventListener("keydown", (e) => {
        const active = document.activeElement;
        if (active.tagName !== "INPUT") return;

        const row = active.closest("tr");
        const rows = Array.from(document.querySelectorAll("#tableBody tr"));
        const inputs = Array.from(row.querySelectorAll("input"));
        const colIndex = inputs.indexOf(active);
        const rowIndex = rows.indexOf(row);

        const focusEnd = (input) => {
            input.focus();
            const val = input.value;
            input.value = "";
            input.value = val;
        };

        if (e.key === "ArrowDown" && rows[rowIndex + 1]) {
            e.preventDefault();
            focusEnd(rows[rowIndex + 1].querySelectorAll("input")[colIndex]);
        } else if (e.key === "ArrowUp" && rows[rowIndex - 1]) {
            e.preventDefault();
            focusEnd(rows[rowIndex - 1].querySelectorAll("input")[colIndex]);
        } else if (e.key === "ArrowRight" && inputs[colIndex + 1]) {
            e.preventDefault();
            focusEnd(inputs[colIndex + 1]);
        } else if (e.key === "ArrowLeft" && inputs[colIndex - 1]) {
            e.preventDefault();
            focusEnd(inputs[colIndex - 1]);
        }
    });
}
