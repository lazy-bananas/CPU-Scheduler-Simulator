from collections import deque

def round_robin(processes, quantum):
    processes = sorted(processes, key=lambda x: (x["arrival"], x["pid"]))
    
    n = len(processes)
    remaining = {p["pid"]: p["burst"] for p in processes}
    
    queue = deque()
    gantt = []
    current_time = 0
    i = 0
    completed = 0

    while completed < n:
        while i < n and processes[i]["arrival"] <= current_time:
            queue.append(processes[i])
            i += 1
        
        if not queue:
            current_time += 1
            continue
        
        p = queue.popleft()
        
        exec_time = min(int(quantum), int(remaining[p["pid"]]))
        
        start = current_time
        end = start + exec_time
        
        gantt.append({
            "pid": p["pid"],
            "start": start,
            "end": end
        })
        
        current_time = end
        remaining[p["pid"]] -= exec_time
        
        while i < n and processes[i]["arrival"] <= current_time:
            queue.append(processes[i])
            i += 1
        
        if remaining[p["pid"]] > 0:
            queue.append(p)
        else:
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
