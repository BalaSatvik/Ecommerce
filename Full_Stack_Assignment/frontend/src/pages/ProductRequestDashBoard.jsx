
import React, { useEffect, useState } from 'react';
import { getAllProducts, createProductRequest } from '../services/ProductRequestService';

const ProductRequestDashboard = () => {
  const [products, setProducts] = useState([]);
  const [requestForm, setRequestForm] = useState({
    productName: '',
    description: '',
    price: '',
    quantity: '',
    requestedBy: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data);
    } catch (err) {
      alert('Error loading products: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleChange = (e) => {
    setRequestForm({ ...requestForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...requestForm,
        price: parseFloat(requestForm.price),
        quantity: parseInt(requestForm.quantity, 10),
        requestedBy: parseInt(requestForm.requestedBy, 10)
      };
      await createProductRequest(payload);
      alert('Product request submitted successfully!');
      setRequestForm({
        productName: '',
        description: '',
        price: '',
        quantity: '',
        requestedBy: ''
      });
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>All Products</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Average Rating</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>No products found.</td>
            </tr>
          )}
          {products.map(p => (
            <tr key={p.productId}>
              <td>{p.productId}</td>
              <td>{p.productName}</td>
              <td>{p.description}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td>{p.averageRating}</td>
              <td>{p.createdAtDate}</td>
              <td>{p.updatedAtDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Send Product Request</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={requestForm.productName}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={requestForm.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          value={requestForm.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={requestForm.quantity}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="requestedBy"
          placeholder="Requested By (User ID)"
          value={requestForm.requestedBy}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default ProductRequestDashboard;