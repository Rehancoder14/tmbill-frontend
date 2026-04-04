import React, { useState, useEffect } from 'react';
import { fetchStores, fetchItems, createOrder } from '../api/client';

export default function OrderForm({ onClose, onOrderCreated }) {
  const [stores, setStores] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  
  const [storeId, setStoreId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [qty, setQty] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStores().then(data => setStores(data.stores)).catch(console.error);
    fetchItems().then(data => setItemsList(data.items)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storeId || !selectedItemId || qty < 1) {
      setError('Please select a store, an item, and a valid quantity.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await createOrder({
        store_id: parseInt(storeId),
        items: [{ item_id: parseInt(selectedItemId), qty: parseInt(qty) }]
      });
      onOrderCreated(storeId);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Create New Order</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div style={{color:'red', marginBottom: '1rem'}}>{error}</div>}
            
            <div className="form-group">
              <label className="form-label">Select Store</label>
              <select 
                className="form-control" 
                value={storeId} 
                onChange={(e) => setStoreId(e.target.value)}
                required
              >
                <option value="">-- Select a store --</option>
                {stores.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Item</label>
              <select 
                className="form-control" 
                value={selectedItemId} 
                onChange={(e) => setSelectedItemId(e.target.value)}
                required
              >
                <option value="">-- Select an item --</option>
                {itemsList.map(i => (
                  <option key={i.id} value={i.id}>{i.name} (₹{i.price})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input 
                type="number" 
                className="form-control" 
                min="1" 
                value={qty} 
                onChange={(e) => setQty(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Creating...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
