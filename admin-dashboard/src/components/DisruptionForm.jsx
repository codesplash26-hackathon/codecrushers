import React, { useState } from 'react';

export default function DisruptionForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('DELAY');

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
      <label>Disruption Title</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Train #102 Delay" />
      
      <label>Disruption Type</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="DELAY">Delay</option>
        <option value="CANCELLATION">Cancellation</option>
        <option value="ROAD_CLOSURE">Road Closure</option>
        <option value="TRAFFIC">Traffic</option>
      </select>
      
      <button type="submit" style={{ padding: '10px', background: '#DC2626', color: '#FFF', border: 'none', borderRadius: '4px' }}>
        Broadcast Disruption Alert
      </button>
    </form>
  );
}
