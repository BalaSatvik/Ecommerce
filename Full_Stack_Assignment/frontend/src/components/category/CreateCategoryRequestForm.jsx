import React, { useState } from "react";
import { createCategoryRequest } from "../../services/CategoryRequestService";

const CreateCategoryRequestForm = () => {
  const [categoryName, setCategoryName] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createCategoryRequest({
        categoryName,
        requestedBy,
      });
      alert("Category request submitted successfully!");
      setCategoryName("");
      setRequestedBy("");
    } catch (error) {
      console.error("Error creating category request:", error);
      alert("Failed to create request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Category Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-2">
          <label>Category Name:</label>
          <input
            type="text"
            className="form-control"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Requested By (User ID):</label>
          <input
            type="number"
            className="form-control"
            value={requestedBy}
            onChange={(e) => setRequestedBy(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default CreateCategoryRequestForm;
