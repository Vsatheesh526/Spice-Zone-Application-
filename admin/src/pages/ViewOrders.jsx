import React, { useEffect, useState } from "react";
import api from "../api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ViewOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders", {
      headers: { Authorization: "Bearer " + localStorage.getItem("adminToken") }
    }).then(res => setOrders(res.data));
  }, []);

  let deliveredCount = 0;
  let cancelledCount = 0;
  let totalRevenue = 0;
  orders.forEach(o => {
    if (o.status === 'Delivered') deliveredCount++;
    if (o.status === 'Cancelled') cancelledCount++;
    // Ensure o.total is a number
    const totalValue = typeof o.total === 'number' ? o.total : parseFloat(o.total) || 0;
    if (o.status === 'Delivered') totalRevenue += totalValue;
  });

  const containerStyle = {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "auto"
  };

  const headingStyle = {
    color: "#333",
    marginBottom: "20px"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
  };

  const thStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
    textAlign: "left"
  };

  const tdStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    verticalAlign: "top"
  };

  const itemStyle = {
    marginBottom: "4px"
  };

  // Cancel order handler
  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.put(`/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: "Bearer " + localStorage.getItem("adminToken") }
      });
      setOrders(orders => orders.map(o => o._id === orderId ? { ...o, status: 'Cancelled' } : o));
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  // Mark as delivered handler
  const handleDelivered = async (orderId) => {
    if (!window.confirm('Mark this order as delivered?')) return;
    try {
      await api.put(`/orders/${orderId}/delivered`, {}, {
        headers: { Authorization: "Bearer " + localStorage.getItem("adminToken") }
      });
      setOrders(orders => orders.map(o => o._id === orderId ? { ...o, status: 'Delivered' } : o));
    } catch (err) {
      alert('Failed to mark as delivered');
    }
  };

  // Confirm order handler (for cancelled orders)
  const handleOk = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/delivered`, {}, {
        headers: { Authorization: "Bearer " + localStorage.getItem("adminToken") }
      });
      setOrders(orders => orders.map(o => {
        if (o._id === orderId && o.status === 'Cancelled') {
          return { ...o, status: 'Delivered' };
        }
        return o;
      }));
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Order List", 14, 16);
    autoTable(doc, {
      head: [["User", "Items", "Total", "Status"]],
      body: orders.map(o => [
        o.user?.name || o.user,
        o.items.map(item => `${item.name} x ${item.qty}`).join(", "),
        `₹${o.total}`,
        o.status === 'Cancelled' ? 'Order Cancelled' : o.status === 'Delivered' ? 'Delivered' : 'Pending'
      ]),
      startY: 22,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 123, 255] }
    });
    doc.save("orders-list.pdf");
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>All Orders</h2>
      <div style={{ marginBottom: 16, display: 'flex', gap: 24, alignItems: 'center' }}>
        <div><strong>Total Orders:</strong> {orders.length}</div>
        <div><strong>Delivered:</strong> {deliveredCount}</div>
        <div><strong>Cancelled:</strong> {cancelledCount}</div>
        <div><strong>Total Revenue:</strong> ₹{totalRevenue.toLocaleString()}</div>
        <button onClick={downloadPDF} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Download as PDF</button>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Items</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Operation</th>
          </tr>
        </thead>
        <tbody>

          {orders.map((o, i) => (
            <tr key={i}>
              <td style={tdStyle}>{o.user?.name || o.user}</td>
              <td style={tdStyle}>
                {o.items.map((item, idx) => (
                  <div key={idx} style={itemStyle}>
                    {item.name} x {item.qty}
                  </div>
                ))}
              </td>
              <td style={tdStyle}>₹{o.total}</td>
              <td style={tdStyle}>
                {o.status === 'Cancelled'
                  ? 'Order Cancelled'
                  : o.status === 'Delivered'
                    ? 'Delivered'
                    : 'Pending'}
              </td>
              <td style={tdStyle}>
                {o.status === 'Cancelled' ? (
                  <button onClick={() => handleOk(o._id)} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>
                    OK
                  </button>
                ) : (
                  <>
                    <button onClick={() => handleCancel(o._id)} disabled={o.status === 'Cancelled' || o.status === 'Delivered'} style={{ background: '#ffc107', color: '#333', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: o.status === 'Cancelled' || o.status === 'Delivered' ? 'not-allowed' : 'pointer', marginRight: 6 }}>
                      Cancel Order
                    </button>
                    <button onClick={() => handleDelivered(o._id)} disabled={o.status === 'Delivered' || o.status === 'Cancelled'} style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: o.status === 'Delivered' || o.status === 'Cancelled' ? 'not-allowed' : 'pointer' }}>
                      Mark as Delivered
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          
        </tbody>
      </table>
        <br /><br />
      <button> <a href="/">Back</a></button>
    </div>
  );
}
