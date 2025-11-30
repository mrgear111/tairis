import "../styles/contact.css";
import emailIcon from "../assets/email_icon.png";
import mobileIcon from "../assets/mobile_icon.png";
import addressIcon from "../assets/address_icon.png";
import businessHoursIcon from "../assets/business_hours_icon.png";
import emergencyIcon from "../assets/emergency_icon.png";

function Contact() {
    return (
        <div className="contact-container">
            <div className="contact-content">
                <div className="contact-header">
                    <h1>Get In Touch</h1>
                    <p className="tagline">We're here to help in emergencies and answer your questions</p>
                </div>

                <div className="contact-grid">
                    {/* Contact Information Section */}
                    <section className="contact-info">
                        <h2>Contact Information</h2>

                        <div className="contact-item">
                            <div className="contact-icon">
                                <img src={emailIcon} alt="Email" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                            </div>
                            <div className="contact-details">
                                <h3>Email</h3>
                                <p className="placeholder">tairis@gmail.com</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="contact-icon">
                                <img src={mobileIcon} alt="Phone" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                            </div>
                            <div className="contact-details">
                                <h3>Phone</h3>
                                <p className="placeholder">9758900419</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="contact-icon">
                                <img src={addressIcon} alt="Address" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                            </div>
                            <div className="contact-details">
                                <h3>Address</h3>
                                <p className="placeholder">Any random address</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="contact-icon">
                                <img src={businessHoursIcon} alt="Hours" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                            </div>
                            <div className="contact-details">
                                <h3>Business Hours</h3>
                                <p className="placeholder">Monday - Friday: 9:00 AM - 6:00 PM</p>
                                <p className="placeholder">Saturday - Sunday: Closed</p>
                            </div>
                        </div>
                    </section>

                    {/* Contact Form Section */}
                    <section className="contact-form-section">
                        <h2>Send Us a Message</h2>
                        <form className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Your Name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    placeholder="How can we help?"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="6"
                                    placeholder="Tell us more about your inquiry..."
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-btn">
                                Send Message
                            </button>
                        </form>
                    </section>
                </div>

                {/* Emergency Notice */}
                <section className="emergency-notice">
                    <div className="notice-icon">
                        <img src={emergencyIcon} alt="Emergency" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                    </div>
                    <div className="notice-content">
                        <h3>Emergency?</h3>
                        <p>
                            If you are experiencing a medical emergency, please call emergency services
                            immediately or visit the nearest emergency room. This contact form is not
                            monitored 24/7.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Contact;
