def sjf_preemptive(processes):
    processes = sorted(processes, key=lambda x: x["arrival"])
    
    n = len(processes)
    remaining = {p["pid"]: p["burst"] for p in processes}
    
    current_time = 0
    completed = 0
    gantt = []
    
    last_pid = -1

    while completed < n:
        # get available processes
        available = [p for p in processes if p["arrival"] <= current_time and remaining[p["pid"]] > 0]
        
        if not available:
            current_time += 1
            continue
        
        # pick process with minimum remaining time
        p = min(available, key=lambda x: remaining[x["pid"]])
        
        # gantt handling (merge continuous blocks)
        if last_pid != p["pid"]:
            gantt.append({
                "pid": p["pid"],
                "start": current_time,
                "end": current_time + 1
            })
        else:
            gantt[-1]["end"] += 1
        
        last_pid = p["pid"]
        
        # execute for 1 unit
        remaining[p["pid"]] -= 1
        current_time += 1
        
        if remaining[p["pid"]] == 0:
            p["completion"] = current_time
            p["turnaround"] = current_time - p["arrival"]
            p["waiting"] = p["turnaround"] - p["burst"]
            completed += 1

    avg_wt = sum(p["waiting"] for p in processes) / n
    avg_tat = sum(p["turnaround"] for p in processes) / n

    return {
        "processes": processes,
        "gantt": gantt,
        "avg_waiting_time": avg_wt,
        "avg_turnaround_time": avg_tat
    }