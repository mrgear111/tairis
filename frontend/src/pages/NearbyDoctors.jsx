import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { LocationAcquirer } from '../services/LocationAcquirer';
import { OverpassService } from '../services/OverpassService';
import { NominatimService } from '../services/NominatimService';
import { CacheService } from '../services/CacheService';
import { POINormalizer } from '../services/POINormalizer';

import ConsentModal from '../components/ConsentModal';
import FacilityList from '../components/FacilityList';
import '../components/styles/NearbyDoctors.css';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to center map when user location changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function NearbyDoctors() {
  const [showConsent, setShowConsent] = useState(false);
  const [userLocation, setUserLocation] = useState(null); // { lat, lon }
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    checkConsentAndLoad();
  }, []);

  // Filter facilities when search query or facilities change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFacilities(facilities);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = facilities.filter(f => 
        f.name.toLowerCase().includes(query) || 
        f.type.toLowerCase().includes(query) ||
        (f.services && f.services.some(s => s.toLowerCase().includes(query)))
      );
      setFilteredFacilities(filtered);
    }
    
    // Persist to localStorage for Chat context
    if (facilities.length > 0) {
      localStorage.setItem('tairis_nearby_facilities', JSON.stringify(facilities));
    }
  }, [searchQuery, facilities]);

  const checkConsentAndLoad = async () => {
    if (LocationAcquirer.hasConsent()) {
      fetchLocation();
    } else {
      setShowConsent(true);
    }
  };

  const fetchLocation = async () => {
    setLoading(true);
    setStatus('Acquiring location...');
    try {
      const coords = await LocationAcquirer.getCoordinates();
      setUserLocation(coords);
      fetchFacilities(coords.lat, coords.lon);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchFacilities = async (lat, lon) => {
    setStatus('Finding nearby medical facilities...');
    const radius = 5000; // 5km
    const cacheKey = CacheService.generateKey(lat, lon, radius, 'medical');
    
    // Check cache first
    const cachedData = CacheService.get(cacheKey);
    if (cachedData) {
      setFacilities(cachedData);
      setLoading(false);
      setStatus(`Found ${cachedData.length} facilities (cached)`);
      return;
    }

    try {
      // Try Overpass first
      let rawData = await OverpassService.fetchPOIs(lat, lon, radius);
      let normalizedData = rawData
        .map(item => POINormalizer.normalizeOverpass(item, lat, lon))
        .filter(item => item !== null);

      // If Overpass returns empty or fails (though fetchPOIs throws on error), try Nominatim
      if (normalizedData.length === 0) {
        setStatus('Overpass empty, trying fallback...');
        const nominatimData = await NominatimService.search('hospital', lat, lon);
        const normalizedNominatim = nominatimData.map(item => 
          POINormalizer.normalizeNominatim(item, lat, lon)
        );
        normalizedData = [...normalizedData, ...normalizedNominatim];
      }

      // Sort by distance
      normalizedData.sort((a, b) => a.distance_m - b.distance_m);

      setFacilities(normalizedData);
      CacheService.set(cacheKey, normalizedData);
      setStatus(`Found ${normalizedData.length} facilities`);
    } catch (err) {
      console.error("Error fetching facilities:", err);
      setError("Failed to fetch facilities. Please try again.");
      
      // Fallback to Nominatim on error
      try {
        setStatus('Error, trying fallback...');
        const nominatimData = await NominatimService.search('hospital', lat, lon);
        const normalizedNominatim = nominatimData.map(item => 
          POINormalizer.normalizeNominatim(item, lat, lon)
        );
        normalizedNominatim.sort((a, b) => a.distance_m - b.distance_m);
        setFacilities(normalizedNominatim);
      } catch (fallbackErr) {
        setError("Could not find facilities even with fallback.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAllow = () => {
    LocationAcquirer.setConsent(true);
    setShowConsent(false);
    fetchLocation();
  };

  const handleDeny = () => {
    setShowConsent(false);
    setError("Location access denied. You can enter an address manually.");
  };

  const handleManual = () => {
    // For now, just close modal. Manual input to be implemented.
    setShowConsent(false);
    const address = prompt("Enter your city or address:");
    if (address) {
      setLoading(true);
      setStatus('Geocoding address...');
      NominatimService.geocode(address).then(coords => {
        if (coords) {
          setUserLocation(coords);
          fetchFacilities(coords.lat, coords.lon);
        } else {
          setError("Could not find coordinates for that address.");
          setLoading(false);
        }
      });
    }
  };

  return (
    <div className="nearby-doctors-page">
      {showConsent && (
        <ConsentModal 
          onAllow={handleAllow} 
          onDeny={handleDeny} 
          onManual={handleManual} 
        />
      )}

      <div className="nearby-header">
        <h1>Nearby Medical Help</h1>
        <p>Find the closest hospitals, clinics, and pharmacies.</p>
      </div>

      <div className="nearby-content">
        <div className="nearby-sidebar">
          <div className="nearby-search-container">
            <input
              type="text"
              placeholder="Search hospitals, services (e.g. MRI)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nearby-search-input"
            />
          </div>

          {loading && <div className="search-status">⏳ {status}</div>}
          {error && <div className="search-error">⚠️ {error}</div>}
          
          {!loading && !error && status && (
            <div className="search-status">✅ {status}</div>
          )}

          <FacilityList 
            facilities={filteredFacilities} 
            selectedId={selectedFacilityId}
            onSelect={(f) => setSelectedFacilityId(f.id)}
          />
        </div>

        <div className="nearby-map-container">
          {userLocation ? (
            <MapContainer 
              center={[userLocation.lat, userLocation.lon]} 
              zoom={13} 
              scrollWheelZoom={true}
            >
              <ChangeView center={[userLocation.lat, userLocation.lon]} zoom={13} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker 
                position={[userLocation.lat, userLocation.lon]}
                icon={L.divIcon({
                  className: 'live-location-marker',
                  html: '<div class="location-dot"></div>',
                  iconSize: [16, 16],
                  iconAnchor: [8, 8]
                })}
              >
                <Popup>You are here</Popup>
              </Marker>
              
              {facilities.map(facility => (
                <Marker 
                  key={facility.id} 
                  position={[facility.coords.lat, facility.coords.lon]}
                  eventHandlers={{
                    click: () => setSelectedFacilityId(facility.id),
                  }}
                >
                  <Popup>
                    <strong>{facility.name}</strong><br />
                    {facility.type}<br />
                    {(facility.distance_m / 1000).toFixed(1)} km away
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
              Map will appear here after location is detected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NearbyDoctors;
