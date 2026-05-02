# CPU Scheduling Simulator

A comprehensive full-stack web application to simulate and visualize various CPU scheduling algorithms. This tool helps in understanding how different scheduling strategies affect process execution, waiting time, and turnaround time.

## 🚀 Features

- **Multiple Algorithms Supported:**
  - First-Come, First-Served (FCFS)
  - Shortest Job First (SJF) - Non-Preemptive
  - Shortest Remaining Time First (SRTF) - Preemptive
  - Priority Scheduling (Preemptive & Non-Preemptive)
  - Round Robin (RR)
- **Interactive Visualization:**
  - Real-time Gantt Chart generation.
  - Detailed Process Timelines showing waiting and running states.
  - Comparison of Average Waiting Time and Average Turnaround Time.
- **Modern UI:** Responsive design with Dark Mode support and keyboard navigation for data entry.
- **Dockerized:** Easy deployment using Docker and Docker Compose.

## 🛠️ Tech Stack

- **Frontend:** HTML5, Vanilla CSS3, JavaScript (ES6+)
- **Backend:** Python, Flask
- **DevOps:** Docker, Docker Compose
- **Testing:** Pytest

## 📦 Installation & Setup

### Using Docker (Recommended)

1. Clone the repository.
2. Run the following command:
   ```bash
   docker-compose up --build
   ```
3. Open `frontend/index.html` in your browser (or serve it using a local server).

### Manual Setup

#### Backend
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the Flask server:
   ```bash
   python app.py
   ```

#### Frontend
1. Open `frontend/index.html` directly in your browser.

## 🧪 Running Tests

To run the unit tests for the scheduling algorithms:
```bash
cd backend
pytest
```

## 📝 Project Structure

```text
├── backend/
│   ├── algorithms/     # Core scheduling logic
│   ├── tests/          # Unit tests for algorithms
│   ├── app.py          # Flask API entry point
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
└── docker-compose.yml
```
