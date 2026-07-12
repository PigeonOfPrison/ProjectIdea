# TransitOps

TransitOps is a unified fleet management and transit dispatch platform. It is structured as a monorepo containing a FastAPI backend service and a Vite-based React frontend console.

## Project Structure

This workspace is organized as follows:

*   **[transit-api/](file:///c:/Users/Mohammad%20Hammad/My%20Projects/TransitOps/transit-api)**: Python FastAPI backend service handling database management (SQLite via SQLAlchemy async engine), vehicle status tracking, driver shift management, trips, fuel tracking, and maintenance logs.
*   **[dispatch-console/](file:///c:/Users/Mohammad%20Hammad/My%20Projects/TransitOps/dispatch-console)**: React + TypeScript + Tailwind CSS frontend dashboard that provides dispatcher operations, maps, real-time metrics, analytics reports, and CRUD views for drivers and vehicles.

---

## Backend Setup (`transit-api/`)

The backend is built with FastAPI, SQLAlchemy Async, and a local SQLite database.

### Prerequisites

*   Python 3.10+
*   `pip` and `virtualenv`

### Installation & Run

1.  Navigate to the backend directory:
    ```bash
    cd transit-api
    ```
2.  Create and activate a virtual environment:
    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Seed the database with mock transit data:
    ```bash
    python -m app.seed
    ```
5.  Start the FastAPI server:
    ```bash
    uvicorn app.main:app --reload
    ```
    *   The API server will run at: `http://localhost:8000`
    *   Interactive Swagger API docs will be available at: `http://localhost:8000/docs`

---

##  Frontend Setup (`dispatch-console/`)

The frontend is a single-page React application powered by Vite, Tailwind CSS, and TanStack Query.

### Prerequisites

*   Node.js (v18+)
*   `npm`

### Installation & Run

1.  Navigate to the frontend directory:
    ```bash
    cd ../dispatch-console
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure the environment:
    *   Create or edit the `.env` file inside `dispatch-console/`.
    *   To connect to the local backend, set:
        ```env
        VITE_API_URL=http://localhost:8000
        VITE_USE_MOCKS=false
        ```
    *   To run in **Mock/Offline Mode** (without needing the backend running), set:
        ```env
        VITE_USE_MOCKS=true
        ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    *   The console will run at: `http://localhost:5173`

---

##  Team Git Workflow

To coordinate work among the 4-member team without conflicts, please follow this branch structure:

1.  **Backend Developer A** (focus on Vehicles, Drivers, Trips APIs):
    *   Branch: `API-vehicles-drivers-trips`
2.  **Backend Developer B** (focus on Maintenance, Fuel, Dashboard APIs):
    *   Branch: `API-maintenance-fuel-dashboard`
3.  **UI Developer A** (focus on Vehicles & Drivers UI):
    *   Branch: `UI-vehicles-drivers`
4.  **UI Developer B** (focus on Trips, Maintenance & Fuel UI):
    *   Branch: `UI-trips-maintenance-fuel`

### How to push your specific work:
Staging specific files ensures you don't accidentally commit environment configurations or database files.
```bash
# 1. Switch to your feature branch
git checkout -b <your-feature-branch>

# 2. Stage only your modified files
git add transit-api/app/routers/my_router.py

# 3. Verify staged changes
git status

# 4. Commit and push
git commit -m "Implement router feature"
git push origin <your-feature-branch>
```
Once pushed, open a **Pull Request (PR)** on GitHub to merge into `main`.
