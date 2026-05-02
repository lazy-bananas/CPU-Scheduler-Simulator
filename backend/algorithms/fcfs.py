def fcfs(processes):
    processes = sorted(processes, key=lambda p: (p['arrival'], p['pid']))

    current_time = 0
    gantt=[]
    result=[]

    for p in processes:
        if current_time < p['arrival']:
            current_time = p['arrival']
        
        start = current_time
        end= start + p['burst']

        new_p = {
            "pid": p["pid"],
            "arrival": p["arrival"],
            "burst": p["burst"],
            "completion":  end,
            "turnaround" : end - p['arrival'],
            "waiting":(end - p['arrival']) - p['burst']
        }

        result.append(new_p)

        gantt.append({
            'pid':p['pid'],
            'start': start,
            'end': end
        })

        current_time = end

    avg_wt = sum(p['waiting'] for p in result) / len(processes)
    avg_tat = sum(p['turnaround'] for p in result) / len(processes)

    return {
        'processes': result,
        'gantt': gantt,
        'avg_waiting_time': avg_wt,
        'avg_turnaround_time': avg_tat
    }