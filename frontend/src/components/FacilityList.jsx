import React from 'react';
import './styles/FacilityList.css';

const FacilityList = ({ facilities, onSelect, selectedId }) => {
  if (!facilities || facilities.length === 0) {
    return <div className="no-facilities">No facilities found nearby.</div>;
  }

  return (
    <div className="facility-list">
      {facilities.map((facility) => (
        <div 
          key={facility.id} 
          className={`facility-card ${selectedId === facility.id ? 'selected' : ''}`}
          onClick={() => onSelect(facility)}
        >
          <div className="facility-header">
            <h3 className="facility-name">{facility.name}</h3>
            <span className="facility-distance">
              {(facility.distance_m / 1000).toFixed(1)} km
            </span>
          </div>
          
          <div className="facility-type">{facility.type}</div>
          
          {facility.services && facility.services.length > 0 && (
            <div className="facility-services">
              {facility.services.map((service, idx) => (
                <span key={idx} className="service-badge">{service}</span>
              ))}
            </div>
          )}
          
          <div className="facility-actions">
            {facility.phone && (
              <a 
                href={`tel:${facility.phone}`} 
                className="action-btn call"
                onClick={(e) => e.stopPropagation()}
              >
                📞 Call
              </a>
            )}
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${facility.coords.lat},${facility.coords.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn"
              onClick={(e) => e.stopPropagation()}
            >
              📍 Directions
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FacilityList;
