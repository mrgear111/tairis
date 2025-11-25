import "./styles/howitworks.css";

function HowItWorks() {
    const steps = [
        {
            id: 1,
            title: "Select Your Emergency Type",
            description: "Choose from a list of common emergencies to get relevant help.",
            icon: "1"
        },
        {
            id: 2,
            title: "Answer Quick Questions",
            description: "Provide key details about the situation to tailor the guidance.",
            icon: "2"
        },
        {
            id: 3,
            title: "Follow Guided First-Aid Steps",
            description: "Receive clear, step-by-step instructions to manage the emergency.",
            icon: "3"
        },
        {
            id: 4,
            title: "Contact Nearby Doctors",
            description: "Connect with local medical professionals or emergency services.",
            icon: "4"
        }
    ];

    return (
        <section className="how-it-works-section">
            <div className="how-it-works-container">
                <div className="how-it-works-header">
                    <h2>How Tairis Helps in an Emergency</h2>
                    <p>Simple steps to navigate through a crisis</p>
                </div>

                <div className="how-it-works-grid">
                    {steps.map((step) => (
                        <div key={step.id} className="step-card">
                            <div className="step-number">{step.icon}</div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
