import React, { useState } from 'react';

export default function AddCity() {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('City Name is required.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:5000/api/adminprofile/add-city', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, state, country })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to add city');
      }
      setSuccess('City added successfully!');
      setName(''); setState(''); setCountry('');
    } catch (err) {
      setError(err.message || 'Could not add city.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 32 }}>
      <h2 style={{ color: '#007bff', marginBottom: 18 }}>Add City</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontWeight: 600 }}>City Name:</label>
          <input value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: 7, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontWeight: 600 }}>State:</label>
          <input value={state} onChange={e => setState(e.target.value)} required style={{ width: '100%', padding: 7, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600 }}>Country:</label>
          <input value={country} onChange={e => setCountry(e.target.value)} required style={{ width: '100%', padding: 7, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <button type="submit" disabled={loading} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 22px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
          {loading ? 'Adding...' : 'Add City'}
        </button>
        {success && <div style={{ color: 'green', marginTop: 14 }}>{success}</div>}
        {error && <div style={{ color: 'red', marginTop: 14 }}>{error}</div>}
      </form>
      <br />
              <button className="back-btn" style={{ color: 'black', backgroundColor: 'white', border: '1px solid black', padding: '10px 20px', borderRadius: '5px' }}>
          <a href="/">Back</a>
        </button>
    </div>
  );
}
