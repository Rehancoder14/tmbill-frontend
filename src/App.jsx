import React, { useState } from 'react';
import OrdersManager from './components/OrdersManager';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      <div className="header" style={{ marginBottom: '1rem' }}>
        <h1 className="title">TMBill Portal</h1>
        <span className={`badge ${activeTab === 'dashboard' ? 'badge-completed' : 'badge-placed'}`} style={{fontSize: '0.9rem', padding: '0.4rem 1rem'}}>
          {activeTab === 'dashboard' ? 'Analytics Engine' : 'Operations Manager'}
        </span>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Reporting Analytics
        </button>
        <button 
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📝 Order Management
        </button>
      </div>

      <main>
        {activeTab === 'dashboard' && <AnalyticsDashboard />}
        {activeTab === 'orders' && <OrdersManager />}
      </main>
    </div>
  );
}

export default App;
