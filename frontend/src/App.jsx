import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

const metricImages = [
  '/metrics-loss.png',
  '/metrics-accuracy.png',
  '/metrics-val-loss.png',
  '/metrics-confusion.png',
];

async function submitEssay(essay) {
  const response = await fetch('https://resai-8vaz.onrender.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ essay }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Prediction failed');
  }

  return data;
}

function Shell({ children }) {
  const location = useLocation();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">R</span>
          <span>
            <strong>ResAI</strong>
            <small>Essay prediction lab</small>
          </span>
        </Link>
        <nav className="nav-links">
          <Link className={location.pathname === '/' ? 'active' : ''} to="/">
            Submit essay
          </Link>
          <Link className={location.pathname === '/metrics' ? 'active' : ''} to="/metrics">
            Training metrics
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [essay, setEssay] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => essay.trim().length > 0, [essay]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || loading) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await submitEssay(essay);
      setPrediction(result.prediction);
    } catch (err) {
      setPrediction(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="hero-grid">
      <section className="hero-copy card">
        <div className="eyebrow">Prediction console</div>
        <h1>Submit an essay and get an instant model prediction.</h1>
        <p>
          Type the text in the required field, send it to the Flask backend, and inspect the output
          in a clean, focused interface.
        </p>
        <div className="hero-stats">
          <div>
            <strong>Fast</strong>
            <span>Backend-connected response</span>
          </div>
          <div>
            <strong>Required</strong>
            <span>Whitespace-only input is blocked</span>
          </div>
          <div>
            <strong>Metrics</strong>
            <span>Dedicated training dashboard</span>
          </div>
        </div>
      </section>

      <section className="card form-card">
        <form className="essay-form" onSubmit={handleSubmit}>
          <label htmlFor="essay">Essay text</label>
          <textarea
            id="essay"
            name="essay"
            required
            rows="10"
            placeholder="Paste your essay here..."
            value={essay}
            onChange={(event) => setEssay(event.target.value)}
          />
          <div className="form-actions">
            <button className="primary-btn" type="submit" disabled={!canSubmit || loading}>
              {loading ? 'Predicting...' : 'Submit'}
            </button>
            <button className="secondary-btn" type="button" onClick={() => navigate('/metrics')}>
              See training metrics
            </button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Model output</div>
          {error ? <p className="error-text">{error}</p> : null}
          {prediction !== null ? (
            <div className="prediction-box">
              <span className="prediction-value">{prediction}</span>
              <span className="prediction-caption">Predicted essay length</span>
            </div>
          ) : (
            <p className="muted-text">Your prediction will appear here after submission.</p>
          )}
        </div>
      </section>
    </main>
  );
}

function MetricsPage() {
  return (
    <main className="metrics-page">
      <section className="metrics-hero card">
        <div className="eyebrow">Training dashboard</div>
        <h1>Model training metrics</h1>
        <p>
          These visualizations represent the training journey of the model. They are arranged like a
          monitoring wall, emphasizing convergence, validation behavior, and diagnostic review.
        </p>
      </section>

      <section className="metrics-grid">
        {metricImages.map((src, index) => (
          <article className="metric-card card" key={src}>
            <div className="metric-header">
              <span>Metric {index + 1}</span>
              <span>PNG</span>
            </div>
            <div className="metric-image-wrap">
              <img src={src} alt={`Training metric ${index + 1}`} />
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/metrics" element={<MetricsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  );
}
