import React, { useEffect, useState } from 'react';

export default function ViewCities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState('');
  const [editingCity, setEditingCity] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    state: '',
    country: ''
  });

  const fetchCities = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/cities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch cities');
      const data = await res.json();
      setCities(data);
    } catch (err) {
      setError('Could not load cities.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchCities(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this city?')) return;
    setDeleting(id);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/cities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete city');
      setCities(cities.filter(city => city._id !== id));
    } catch (err) {
      alert('Could not delete city.');
    }
    setDeleting('');
  };

  const handleEditClick = (city) => {
    setEditingCity(city._id);
    setEditFormData({
      name: city.name,
      state: city.state,
      country: city.country
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleEditSubmit = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/cities/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });
      
      if (!res.ok) throw new Error('Failed to update city');
      
      const updatedCity = await res.json();
      setCities(cities.map(city => 
        city._id === id ? updatedCity : city
      ));
      setEditingCity(null);
    } catch (err) {
      alert('Could not update city.');
    }
  };

  const handleCancelEdit = () => {
    setEditingCity(null);
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 32 }}>
      <h2 style={{ color: '#007bff', marginBottom: 18 }}>Cities List</h2>
      {loading ? <div>Loading...</div> : error ? <div style={{ color: 'red' }}>{error}</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 10, borderBottom: '1px solid #eee' }}>Name</th>
              <th style={{ padding: 10, borderBottom: '1px solid #eee' }}>State</th>
              <th style={{ padding: 10, borderBottom: '1px solid #eee' }}>Country</th>
              <th style={{ padding: 10, borderBottom: '1px solid #eee', width: 180 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map(city => (
              <tr key={city._id}>
                <td style={{ padding: 10 }}>
                  {editingCity === city._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: 6 }}
                    />
                  ) : (
                    city.name
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editingCity === city._id ? (
                    <input
                      type="text"
                      name="state"
                      value={editFormData.state}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: 6 }}
                    />
                  ) : (
                    city.state
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editingCity === city._id ? (
                    <input
                      type="text"
                      name="country"
                      value={editFormData.country}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: 6 }}
                    />
                  ) : (
                    city.country
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editingCity === city._id ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button 
                        onClick={() => handleEditSubmit(city._id)}
                        style={{ 
                          background: '#28a745', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: 4, 
                          padding: '6px 12px', 
                          cursor: 'pointer' 
                        }}
                      >
                        Save
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        style={{ 
                          background: '#6c757d', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: 4, 
                          padding: '6px 12px', 
                          cursor: 'pointer' 
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button 
                        onClick={() => handleEditClick(city)}
                        style={{ 
                          background: '#007bff', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: 4, 
                          padding: '6px 12px', 
                          cursor: 'pointer' 
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(city._id)} 
                        disabled={deleting === city._id}
                        style={{ 
                          background: '#dc3545', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: 4, 
                          padding: '6px 12px', 
                          cursor: 'pointer',
                          opacity: deleting === city._id ? 0.7 : 1
                        }}
                      >
                        {deleting === city._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
        <button className="back-btn" style={{ color: 'black', backgroundColor: 'white', border: '1px solid black', padding: '10px 20px', borderRadius: '5px' }}>
          <a href="/">Back</a>
        </button>
      
    </div>
  );
}