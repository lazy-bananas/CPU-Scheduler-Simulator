import { addRow, calculate, compareAll, clearTable, toggleTheme, initKeyboardNav } from './ui.js';

document.addEventListener("DOMContentLoaded", () => {
    // Event Listeners
    document.getElementById("addBtn").addEventListener("click", addRow);
    document.getElementById("calcBtn").addEventListener("click", calculate);
    document.getElementById("compareBtn").addEventListener("click", compareAll);
    document.getElementById("clearBtn").addEventListener("click", clearTable);
    document.getElementById("themeBtn").addEventListener("click", toggleTheme);

    document.getElementById("algorithm").addEventListener("change", function () {
        document.getElementById("quantum").style.display = this.value === "round_robin" ? "inline" : "none";
    });

    initKeyboardNav();

    // Initial State
    addRow();
});
