import pytest
from algorithms.fcfs import fcfs
from algorithms.round_robin import round_robin
from algorithms.srtf import sjf_preemptive

def test_fcfs_basic():
    processes = [
        {"pid": 1, "arrival": 0, "burst": 5},
        {"pid": 2, "arrival": 2, "burst": 3}
    ]
    result = fcfs(processes)
    assert result['avg_waiting_time'] == 1.5 # (0 + 3)/2
    assert result['avg_turnaround_time'] == 5.5 # (5 + 6)/2

def test_round_robin_basic():
    processes = [
        {"pid": 1, "arrival": 0, "burst": 5},
        {"pid": 2, "arrival": 1, "burst": 3}
    ]
    # Quantum 2: P1(2), P2(2), P1(2), P2(1), P1(1)
    # P1: [0-2], [4-6], [7-8] -> Finish 8, TAT 8, WT 3
    # P2: [2-4], [6-7] -> Finish 7, TAT 6, WT 3
    result = round_robin(processes, 2)
    assert result['avg_waiting_time'] == 3.0
    assert result['avg_turnaround_time'] == 7.0

def test_srtf_basic():
    processes = [
        {"pid": 1, "arrival": 0, "burst": 8},
        {"pid": 2, "arrival": 1, "burst": 4}
    ]
    # P1 starts (0-1), P2 arrives and is shorter (1-5), P1 finishes (5-12)
    # P2: finish 5, TAT 4, WT 0
    # P1: finish 12, TAT 12, WT 4
    result = sjf_preemptive(processes)
    assert result['avg_waiting_time'] == 2.0
    assert result['avg_turnaround_time'] == 8.0
