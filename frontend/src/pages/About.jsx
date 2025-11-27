import "../styles/about.css";

function About() {
    return (
        <div className="about-container">
            <div className="about-content">
                <div className="about-header">
                    <h1>About Tairis</h1>
                    <p className="tagline">Doctor-Free First Aid Decision Tree</p>
                </div>

                <section className="about-section">
                    <h2>What is Tairis?</h2>
                    <p>
                        Tairis is a web-based application designed to guide users through basic first-aid steps
                        in emergency situations, without needing a doctor immediately. The app uses an interactive
                        decision-tree structure, where users answer simple questions and receive step-by-step
                        first-aid instructions tailored to their specific situation.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Key Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🌳</div>
                            <h3>Interactive Decision Tree</h3>
                            <p>
                                Navigate through emergency first-aid scenarios with our intelligent decision tree system
                                that adapts to your responses.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📋</div>
                            <h3>Step-by-Step Guidance</h3>
                            <p>
                                Receive clear, actionable instructions based on your specific emergency situation,
                                ensuring you can provide immediate help.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3>Fast & User-Friendly</h3>
                            <p>
                                Built with a focus on speed and simplicity, so you can get the help you need
                                when every second counts.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🏥</div>
                            <h3>Find Nearby Doctors</h3>
                            <p>
                                Quickly locate medical professionals in your area when professional care is needed.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Our Mission</h2>
                    <p>
                        In emergency situations, having immediate access to first-aid knowledge can make all the
                        difference. Tairis empowers everyone to provide basic medical assistance while waiting for
                        professional help, potentially saving lives through quick and informed action.
                    </p>
                </section>

                <section className="about-section tech-stack">
                    <h2>Built With Modern Technology</h2>
                    <p>
                        Tairis is built using cutting-edge web technologies including React for the frontend,
                        Express.js for the backend, and MongoDB for data management, ensuring a fast, responsive,
                        and reliable experience.
                    </p>
                </section>
            </div>
        </div>
    );
}

export default About;
