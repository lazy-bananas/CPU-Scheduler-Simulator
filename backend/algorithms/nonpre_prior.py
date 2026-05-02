def priority_non_preemptive(processes):
    processes = sorted(processes, key=lambda x: (x["arrival"], x["pid"]))
    
    n = len(processes)
    completed = []
    ready_queue = []
    gantt = []
    
    current_time = 0
    i = 0

    while len(completed) < n:
        while i < n and processes[i]["arrival"] <= current_time:
            ready_queue.append(processes[i])
            i += 1
        
        if not ready_queue:
            current_time += 1
            continue
        
        # select highest priority (lowest number), break ties with PID
        ready_queue.sort(key=lambda x: (x["priority"], x["pid"]))
        p = ready_queue.pop(0)
        
        start = current_time
        end = start + p["burst"]
        
        p["completion"] = end
        p["turnaround"] = end - p["arrival"]
        p["waiting"] = p["turnaround"] - p["burst"]
        
        gantt.append({
            "pid": p["pid"],
            "start": start,
            "end": end
        })
        
        current_time = end
        completed.append(p)

    avg_wt = sum(p["waiting"] for p in completed) / n
    avg_tat = sum(p["turnaround"] for p in completed) / n

    return {
        "processes": completed,
        "gantt": gantt,
        "avg_waiting_time": avg_wt,
        "avg_turnaround_time": avg_tat
    }
