export const API_BASE = 'http://localhost:4000';
// export const API_BASE = 'http://72.61.231.39:4000';
export const fetchStores = async () => {
  const res = await fetch(`${API_BASE}/stores`);
  if (!res.ok) throw new Error('Failed to fetch stores');
  return res.json();
};

export const fetchItems = async () => {
  const res = await fetch(`${API_BASE}/items`);
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
};

export const fetchOrders = async (storeId) => {
  const res = await fetch(`${API_BASE}/orders?store_id=${storeId}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export const createOrder = async (orderData) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to create order');
  }
  return res.json();
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
};

export const getOrdersPerDay = async (storeId) => {
  const url = storeId ? `${API_BASE}/analytics/orders-per-day?store_id=${storeId}` : `${API_BASE}/analytics/orders-per-day`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch orders per day');
  return res.json();
};

export const getRevenuePerStore = async () => {
  const res = await fetch(`${API_BASE}/analytics/revenue-per-store`);
  if (!res.ok) throw new Error('Failed to fetch revenue');
  return res.json();
};

export const getTopSellingItems = async (storeId) => {
  const url = storeId ? `${API_BASE}/analytics/top-selling-items?store_id=${storeId}` : `${API_BASE}/analytics/top-selling-items`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch top items');
  return res.json();
};

export const archiveOldOrders = async () => {
  const res = await fetch(`${API_BASE}/archive-old-orders`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to archive orders');
  return res.json();
};
