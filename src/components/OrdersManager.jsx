import React, { useState, useEffect, useCallback } from 'react';
import { fetchOrders, fetchStores, fetchItems, updateOrderStatus } from '../api/client';
import OrderForm from './OrderForm';
import { useSocket } from '../hooks/useSocket';

export default function OrdersManager() {
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [orders, setOrders] = useState([]);
  const [itemsMap, setItemsMap] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchStores().then(data => {
      setStores(data.stores);
      if (data.stores.length > 0) {
        setSelectedStoreId(data.stores[0].id.toString());
      }
    }).catch(console.error);

    fetchItems().then(data => {
      const map = {};
      data.items.forEach(i => map[i.id] = i.name);
      setItemsMap(map);
    }).catch(console.error);
  }, []);

  const loadOrders = useCallback(() => {
    if (!selectedStoreId) return;
    fetchOrders(selectedStoreId).then(data => {
      setOrders(data.orders);
    }).catch(console.error);
  }, [selectedStoreId]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Handle real-time new orders
  const handleNewOrder = useCallback((newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  }, []);

  // Handle real-time status updates
  const handleStatusUpdate = useCallback((updatedOrder) => {
    setOrders((prev) => 
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  }, []);

  // Initialize socket
  useSocket(selectedStoreId, handleNewOrder, handleStatusUpdate);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // loadOrders(); // No longer needed here, socket will handle it!
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <div className="flex-between card" style={{ marginBottom: '2rem' }}>
        <div className="flex-row">
          <label className="form-label" style={{marginBottom: 0, whiteSpace: 'nowrap'}}>Viewing Orders for Store:</label>
          <select 
            className="form-control" 
            style={{maxWidth: '300px'}}
            value={selectedStoreId} 
            onChange={(e) => setSelectedStoreId(e.target.value)}
          >
            {stores.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <button className="btn" onClick={() => setIsModalOpen(true)}>+ Add Manual Order</button>
      </div>

      <div className="card table-container">
        {orders.length === 0 ? (
          <p style={{color: 'var(--text-secondary)'}}>No orders found for this store.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items (Qty)</th>
                <th>Total Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>
                    {o.items.map((i, idx) => (
                      <div key={idx}>{itemsMap[i.item_id] || `Item ID: ${i.item_id}`} (x{i.qty})</div>
                    ))}
                  </td>
                  <td style={{fontWeight: 600}}>₹{o.total_amount}</td>
                  <td>{new Date(o.created_at).toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${o.status.toLowerCase()}`}>
                      {o.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="form-control" 
                      style={{padding: '0.25rem 0.5rem', width: 'auto'}}
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="PREPARING">PREPARING</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <OrderForm
          onClose={() => setIsModalOpen(false)}
          onOrderCreated={(newStoreId) => {
            if (selectedStoreId !== newStoreId.toString()) {
              setSelectedStoreId(newStoreId.toString());
            }
          }}
        />
      )}
    </div>
  );
}
