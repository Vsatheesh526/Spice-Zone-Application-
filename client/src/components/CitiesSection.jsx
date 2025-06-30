import React, { useEffect, useState } from "react";
import api from "../api";

const CitiesSection = () => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    api.get("/cities").then(res => setCities(res.data));
  }, []);

  return (
    <div className="cities-section">
      <h2 className="cities-title">Cities with food delivery</h2>
      <div className="cities-list">
        {cities.map(city => (
          <div className="city-card" key={city._id}>
           <b>{city.name}</b>
            {city.state && city.country && (
              <span style={{ color: '#888', fontWeight: 400 }}>
                {` (${city.state}, ${city.country})`}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitiesSection;
