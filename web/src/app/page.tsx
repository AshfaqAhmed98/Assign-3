import { Dumbbell } from "lucide-react";

export default function Home() {
  return (
    <div className="app-shell">
      <header className="fit-navbar">
        <a className="fit-brand" href="#top" aria-label="Fitlog home">
          <Dumbbell size={24} strokeWidth={2.5} />
          <span>FITLOG</span>
        </a>
        <nav className="fit-nav-links" aria-label="Primary navigation">
          <a className="fit-nav-link active" href="#workouts">Workouts</a>
          <a className="fit-nav-link" href="#plan">My Plan</a>
        </nav>
        <div className="fit-nav-status">
          <a className="status-link" href="#plan">Plan <span className="plan-count">0</span></a>
          <a className="status-link saved-status" href="#saved">Saved <span className="saved-count">0</span></a>
        </div>
      </header>
      <main className="navbar-preview" id="top">
        <span id="workouts" />
        <span id="plan" />
        <span id="saved" />
      </main>
    </div>
  );
}
