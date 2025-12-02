import React from 'react';
import './styles/ConsentModal.css';

const ConsentModal = ({ onAllow, onDeny, onManual }) => {
  return (
    <div className="consent-modal-overlay">
      <div className="consent-modal">
        <h2>Enable Location for Medical Help?</h2>
        <p>
          Tairis uses your location to find the nearest hospitals and clinics. 
          We do not store your location data permanently. 
          If you prefer, you can enter an address manually.
        </p>
        <div className="consent-actions">
          <button className="consent-btn primary" onClick={onAllow}>
            Allow Location Access
          </button>
          <button className="consent-btn secondary" onClick={onManual}>
            Enter Address Manually
          </button>
          <button className="consent-btn outline" onClick={onDeny}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
