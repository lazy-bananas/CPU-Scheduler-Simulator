export function drawGantt(gantt) {
    const container = document.getElementById("gantt");
    container.innerHTML = "";
    if (!gantt || !gantt.length) return;

    const scale = 40;
    const totalTime = Math.max(...gantt.map(block => block.end));
    const chart = document.createElement("div");
    chart.className = "gantt-chart-wrapper";
    chart.style.display = "flex";
    chart.style.height = "60px";
    chart.style.position = "relative";
    chart.style.width = (totalTime * scale) + "px";

    const timeline = document.createElement("div");
    timeline.className = "gantt-timeline";
    timeline.style.display = "flex";
    timeline.style.position = "relative";
    timeline.style.height = "30px";
    timeline.style.width = (totalTime * scale) + "px";

    gantt.forEach(block => {
        const width = (block.end - block.start) * scale;
        const left = block.start * scale;

        const div = document.createElement("div");
        div.className = `gantt-block p${getColorIndex(block.pid)}`;
        div.style.position = "absolute";
        div.style.left = left + "px";
        div.style.width = (width - 2) + "px"; // Small gap
        div.style.height = "100%";
        div.innerHTML = `P${block.pid}`;
        chart.appendChild(div);

        const time = document.createElement("span");
        time.innerText = block.start;
        time.style.left = left + "px";
        time.style.position = "absolute";
        timeline.appendChild(time);
    });

    const last = document.createElement("span");
    const lastTime = gantt[gantt.length - 1].end;
    last.innerText = lastTime;
    last.style.left = (lastTime * scale) + "px";
    last.style.position = "absolute";
    timeline.appendChild(last);

    const wrapper = document.createElement("div");
    wrapper.appendChild(chart);
    wrapper.appendChild(timeline);
    container.appendChild(wrapper);
}

export function drawProcessCharts(processes, gantt) {
    const container = document.getElementById("processCharts");
    if (!container || !processes || !gantt) return;

    container.innerHTML = "";
    const scale = 40;
    const totalTime = Math.max(...gantt.map(b => b.end), ...processes.map(p => p.arrival));

    processes.forEach(p => {
        const chart = document.createElement("div");
        chart.className = "process-chart";
        chart.style.setProperty("--process-color", getProcessColor(p.pid));

        const label = document.createElement("div");
        label.className = "process-label";
        label.innerHTML = `Process P${p.pid}`;
        
        const bar = document.createElement("div");
        bar.className = "process-bar-container";
        bar.style.width = (totalTime * scale) + "px";

        const arrival = document.createElement("span");
        arrival.className = "arrival-marker";
        arrival.innerText = `Arr @ ${p.arrival}`;
        arrival.style.position = "absolute";
        arrival.style.left = (p.arrival * scale) + "px";
        arrival.style.top = "-35px";
        arrival.style.transform = "translateX(-50%)";
        bar.appendChild(arrival);

        let lastEnd = p.arrival;

        gantt.forEach(block => {
            if (block.pid === p.pid) {
                if (block.start > lastEnd) {
                    const waitWidth = (block.start - lastEnd) * scale;
                    const waitDiv = document.createElement("div");
                    waitDiv.className = "wait-block";
                    waitDiv.style.position = "absolute";
                    waitDiv.style.width = waitWidth + "px";
                    waitDiv.style.left = (lastEnd * scale) + "px";
                    waitDiv.style.height = "100%";
                    if (waitWidth >= 60) waitDiv.innerText = "WAITING";
                    bar.appendChild(waitDiv);
                }

                const runWidth = (block.end - block.start) * scale;
                const runDiv = document.createElement("div");
                runDiv.className = `run-block p${getColorIndex(p.pid)}`;
                runDiv.style.position = "absolute";
                runDiv.style.width = runWidth + "px";
                runDiv.style.left = (block.start * scale) + "px";
                runDiv.style.height = "100%";
                if (runWidth >= 60) {
                    runDiv.innerText = "RUNNING";
                } else if (runWidth >= 25) {
                    runDiv.innerText = "RUN";
                }
                bar.appendChild(runDiv);
                lastEnd = block.end;
            }
        });

        chart.appendChild(label);
        chart.appendChild(bar);
        container.appendChild(chart);
    });
}

function getColorIndex(pid) {
    return ((pid - 1) % 10) + 1;
}

function getProcessColor(pid) {
    const colors = [
        "#ff6b6b",
        "#51cf66",
        "#339af0",
        "#fcc419",
        "#ae3ec9",
        "#ff922b",
        "#20c997",
        "#fa5252",
        "#748ffc",
        "#f06595"
    ];

    return colors[getColorIndex(pid) - 1];
}
