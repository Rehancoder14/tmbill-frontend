import React, { useState, useEffect } from 'react';
import { getOrdersPerDay, getRevenuePerStore, getTopSellingItems, archiveOldOrders, fetchStores } from '../api/client';

export default function AnalyticsDashboard() {
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  
  const [ordersPerDay, setOrdersPerDay] = useState([]);
  const [revenuePerStore, setRevenuePerStore] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    fetchStores().then(data => setStores(data.stores)).catch(console.error);
    getRevenuePerStore().then(res => setRevenuePerStore(res.data)).catch(console.error);
  }, []);

  const loadAnalytics = () => {
    const storeId = selectedStoreId || null;
    getOrdersPerDay(storeId).then(res => setOrdersPerDay(res.data)).catch(console.error);
    getTopSellingItems(storeId).then(res => setTopItems(res.data)).catch(console.error);
  };

  useEffect(() => {
    loadAnalytics();
  }, [selectedStoreId]);

  const handleArchive = async () => {
    if (!window.confirm("Archive all orders older than 30 days?")) return;
    setArchiving(true);
    try {
      const res = await archiveOldOrders();
      alert(res.message);
      // Refresh views
      loadAnalytics();
      getRevenuePerStore().then(r => setRevenuePerStore(r.data));
    } catch (e) {
      alert(e.message);
    } finally {
      setArchiving(false);
    }
  };

  return (
    <div>
      <div className="flex-between card" style={{ marginBottom: '2rem' }}>
        <div className="flex-row">
          <label className="form-label" style={{marginBottom: 0}}>Filter Overview by Store:</label>
          <select 
            className="form-control" 
            style={{maxWidth: '300px'}}
            value={selectedStoreId} 
            onChange={(e) => setSelectedStoreId(e.target.value)}
          >
            <option value="">🌍 Global Matrix (All Stores)</option>
            {stores.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={handleArchive}
          disabled={archiving}
          style={{ borderColor: 'var(--warning)', color: 'var(--warning)', fontWeight: 'bold' }}
        >
          {archiving ? 'Processing...' : '📦 Archive Old Orders (30+ Days)'}
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-title">🔥 Top 5 Selling Items {selectedStoreId && 'for Store'}</div>
          {topItems.length === 0 ? <p style={{marginTop: '1rem', color: 'var(--text-secondary)'}}>No data available.</p> : (
            <table className="table" style={{ marginTop: '0.5rem' }}>
              <thead><tr><th>Item Name</th><th>Total Qty Sold</th></tr></thead>
              <tbody>
                {topItems.map((t, idx) => (
                  <tr key={idx}>
                    <td>{t.name}</td>
                    <td style={{fontWeight: 600, color: 'var(--accent-color)'}}>{t.total_sold} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="stat-card">
          <div className="stat-title">📅 Daily Order Volume {selectedStoreId && 'for Store'}</div>
          {ordersPerDay.length === 0 ? <p style={{marginTop: '1rem', color: 'var(--text-secondary)'}}>No data available.</p> : (
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <table className="table" style={{ marginTop: '0.5rem' }}>
                <thead><tr><th>Date</th><th>Total Valid Orders</th></tr></thead>
                <tbody>
                  {ordersPerDay.map((d, idx) => (
                    <tr key={idx}>
                      <td>{new Date(d.date).toLocaleDateString()}</td>
                      <td style={{fontWeight: 600}}>{d.total_orders} <span style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>transactions</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="stat-card" style={{ gridColumn: '1 / -1' }}>
          <div className="stat-title">💰 Gross Revenue Matrix (All Time)</div>
          {revenuePerStore.length === 0 ? <p style={{marginTop: '1rem', color: 'var(--text-secondary)'}}>No data available.</p> : (
            <table className="table" style={{ marginTop: '0.5rem' }}>
              <thead><tr><th>Store Code</th><th>Store Region</th><th>Gross Lifespan Revenue</th></tr></thead>
              <tbody>
                {revenuePerStore.map((r, idx) => (
                  <tr key={idx}>
                    <td>#{r.store_id}</td>
                    <td>{r.store_name}</td>
                    <td style={{fontWeight: 700, color: 'var(--success)'}}>₹{r.total_revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
