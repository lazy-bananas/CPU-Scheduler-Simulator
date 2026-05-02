from flask import Flask, request, jsonify
from flask_cors import CORS
from algorithms.fcfs import fcfs
from algorithms.nonpre_prior import priority_non_preemptive
from algorithms.pre_prior import priority_preemptive
from algorithms.round_robin import round_robin
from algorithms.sjf import sjf_non_preemptive
from algorithms.srtf import sjf_preemptive

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return "Backend is running..."
@app.route('/schedule', methods=['POST'])
def schedule():
    data = request.get_json()
    algorithm = data['algorithm']
    processes = data['processes']
    quantum = data.get('quantum', 0)

    if not processes:
        return jsonify({'error': 'No processes provided'}), 400

    if algorithm == 'fcfs':
        result = fcfs(processes)
    elif algorithm == 'pre_prior':
        result = priority_preemptive(processes)
    elif algorithm == 'nonpre_prior':
        result = priority_non_preemptive(processes)
    elif algorithm == 'round_robin':
        result = round_robin(processes, quantum)
    elif algorithm == 'sjf':
        result = sjf_non_preemptive(processes)
    elif algorithm == 'srtf':
        result = sjf_preemptive(processes)
    else:
        return jsonify({'error': 'Invalid algorithm'}), 400

    return jsonify(result)

@app.route('/compare', methods=['POST'])
def compare():
    data = request.get_json()
    processes = data['processes']
    quantum = data.get('quantum', 2) # Default quantum for comparison

    if not processes:
        return jsonify({'error': 'No processes provided'}), 400

    results = {
        'fcfs': fcfs([p.copy() for p in processes]),
        'sjf': sjf_non_preemptive([p.copy() for p in processes]),
        'srtf': sjf_preemptive([p.copy() for p in processes]),
        'nonpre_prior': priority_non_preemptive([p.copy() for p in processes]),
        'pre_prior': priority_preemptive([p.copy() for p in processes]),
        'round_robin': round_robin([p.copy() for p in processes], quantum)
    }

    comparison = []
    for algo, res in results.items():
        comparison.append({
            'algorithm': algo,
            'avg_waiting_time': res['avg_waiting_time'],
            'avg_turnaround_time': res['avg_turnaround_time']
        })

    return jsonify(comparison)

if __name__ == '__main__':
    app.run(debug=True, port = 5000)