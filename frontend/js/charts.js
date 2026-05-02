export function drawGantt(gantt) {
    const container = document.getElementById("gantt");
    if (!container) return;
    container.innerHTML = "";
    if (!gantt || !gantt.length) return;

    const scale = 40;
    const totalTime = gantt[gantt.length - 1].end;
    
    const chartWrapper = document.createElement("div");
    chartWrapper.className = "gantt-container";
    chartWrapper.style.width = (totalTime * scale + 50) + "px";

    const chart = document.createElement("div");
    chart.className = "gantt-chart-wrapper";
    chart.style.height = "50px";
    chart.style.position = "relative";

    const timeline = document.createElement("div");
    timeline.className = "gantt-timeline";
    timeline.style.position = "relative";
    timeline.style.height = "25px";
    timeline.style.marginTop = "5px";

    gantt.forEach(block => {
        const width = (block.end - block.start) * scale;
        const left = block.start * scale;

        const div = document.createElement("div");
        div.className = `gantt-block p${getColorIndex(block.pid)}`;
        div.style.position = "absolute";
        div.style.left = left + "px";
        div.style.width = (width - 1) + "px";
        div.style.height = "100%";
        div.innerHTML = `P${block.pid}`;
        chart.appendChild(div);

        const time = document.createElement("span");
        time.innerText = block.start;
        time.style.left = left + "px";
        time.style.position = "absolute";
        time.style.transform = "translateX(-50%)";
        timeline.appendChild(time);
    });

    const last = document.createElement("span");
    last.innerText = totalTime;
    last.style.left = (totalTime * scale) + "px";
    last.style.position = "absolute";
    last.style.transform = "translateX(-50%)";
    timeline.appendChild(last);

    chartWrapper.appendChild(chart);
    chartWrapper.appendChild(timeline);
    container.appendChild(chartWrapper);
}

export function drawProcessCharts(processes, gantt) {
    const container = document.getElementById("processCharts");
    if (!container || !processes || !gantt) return;

    container.innerHTML = "";
    const scale = 40;
    const totalTime = Math.max(...gantt.map(b => b.end), ...processes.map(p => p.arrival));

    processes.forEach(p => {
        const chart = document.createElement("div");
        chart.className = "process-chart-card";
        
        // Apply process-specific color index for CSS
        const colorIdx = getColorIndex(p.pid);
        chart.classList.add(`p-border-${colorIdx}`);

        const label = document.createElement("div");
        label.className = "process-label";
        label.innerHTML = `<span class="p-badge p${colorIdx}">P${p.pid}</span> Process Timeline`;
        
        const barContainer = document.createElement("div");
        barContainer.className = "process-bar-container";
        barContainer.style.width = (totalTime * scale) + "px";

        const arrival = document.createElement("div");
        arrival.className = "arrival-indicator";
        arrival.innerHTML = `<span>Arr @ ${p.arrival}</span>`;
        arrival.style.left = (p.arrival * scale) + "px";
        barContainer.appendChild(arrival);

        let lastEnd = p.arrival;

        gantt.forEach(block => {
            if (block.pid === p.pid) {
                // Wait block
                if (block.start > lastEnd) {
                    const waitWidth = (block.start - lastEnd) * scale;
                    const waitDiv = document.createElement("div");
                    waitDiv.className = "wait-block";
                    waitDiv.style.position = "absolute";
                    waitDiv.style.width = waitWidth + "px";
                    waitDiv.style.left = (lastEnd * scale) + "px";
                    waitDiv.style.height = "100%";
                    if (waitWidth >= 50) waitDiv.innerText = "WAIT";
                    barContainer.appendChild(waitDiv);
                }

                // Run block
                const runWidth = (block.end - block.start) * scale;
                const runDiv = document.createElement("div");
                runDiv.className = `run-block p${colorIdx}`;
                runDiv.style.position = "absolute";
                runDiv.style.width = runWidth + "px";
                runDiv.style.left = (block.start * scale) + "px";
                runDiv.style.height = "100%";
                if (runWidth >= 60) {
                    runDiv.innerText = "RUNNING";
                } else if (runWidth >= 20) {
                    runDiv.innerText = "R";
                }
                barContainer.appendChild(runDiv);
                lastEnd = block.end;
            }
        });

        chart.appendChild(label);
        chart.appendChild(barContainer);
        container.appendChild(chart);
    });
}

function getColorIndex(pid) {
    return ((pid - 1) % 10) + 1;
}
