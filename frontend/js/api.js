export async function fetchSchedule(algo, processes, quantum) {
    const response = await fetch("http://127.0.0.1:5000/schedule", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            algorithm: algo,
            processes: processes,
            quantum: quantum
        })
    });
    
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to fetch schedule");
    }
    return data;
}

export async function fetchComparison(processes, quantum) {
    const response = await fetch("http://127.0.0.1:5000/compare", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            processes: processes,
            quantum: quantum
        })
    });
    
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to fetch comparison");
    }
    return data;
}
