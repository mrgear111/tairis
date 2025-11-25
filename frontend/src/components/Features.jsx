import { Link } from "react-router-dom";
import "./styles/features.css";

function Features() {
  const featuresList = [
    {
      id: 1,
      title: "Instant First-Aid Guidance",
      description: "Get immediate, reliable first-aid guidance for common emergencies",
      icon: "⚡"
    },
    {
      id: 2,
      title: "Interactive Question Flow",
      description: "Question-based flow that adapts to your responses for personalized guidance",
      icon: "❓"
    },
    {
      id: 4,
      title: "Multiple Emergency Categories",
      description: "Coverage for cuts, burns, choking, fractures, and many more emergencies",
      icon: "🏥"
    },
    {
      id: 5,
      title: "Fast & User-Friendly",
      description: "Intuitive interface designed for quick access during emergencies",
      icon: "⚙️"
    },
    {
      id: 6,
      title: "Safety-Focused Suggestions",
      description: "Includes actions to take and critical actions to avoid",
      icon: "🛡️"
    },
    {
      id: 9,
      title: "Emergency Contacts",
      description: "Quick access to essential emergency contact information",
      icon: "☎️"
    }
  ];

  return (
    <section className="features-section">
      <div className="medical-icons-bg">
        <svg className="med-icon icon-plus-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        <svg className="med-icon icon-heart-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg className="med-icon icon-pill-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5 10.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5S6 8.17 6 9s-.67 1.5-1.5 1.5zm15 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-7.5 1.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 3 12 3s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0 2c3.59 0 6.5-2.91 6.5-6.5S15.59 1 12 1 5.5 3.91 5.5 7.5 8.41 14 12 14zM3 21h18v2H3v-2z" />
        </svg>
        <svg className="med-icon icon-wave-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
        </svg>
        <svg className="med-icon icon-plus-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        <svg className="med-icon icon-heart-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
      <div className="features-container">
        <div className="features-header">
          <h2>Tairis</h2>
          <p>Everything you need for medical emergencies</p>
          <Link to="/get-started" className="header-btn">Get Started</Link>
        </div>

        <div className="features-title-section">
          <h2>Why Choose Tairis?</h2>
          <p>Every feature designed to save precious lives</p>
        </div>

        <div className="features-grid">
          {featuresList.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
