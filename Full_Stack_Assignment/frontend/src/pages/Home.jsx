import React, { useState, useEffect } from "react";

// Generate a stable random image per product using Picsum
const getRandomImage = (seed) => `https://picsum.photos/seed/${seed}/400/300`;

const PAGE_SIZE = 6; // Number of products per page

const Home = () => {
  const [categories, setCategories] = useState([
    { categoryId: 0, categoryName: "All" },
  ]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all categories
  useEffect(() => {
    fetch("http://localhost:8080/categories/search")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories([{ categoryId: 0, categoryName: "All" }, ...data]);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch products for selected category
  useEffect(() => {
    setLoading(true);
    setCurrentPage(1); // Reset to first page on category change
    const url =
      selectedCategoryId === 0
        ? "http://localhost:8080/api/product-approval/products"
        : `http://localhost:8080/api/category-product-mappings/category/${selectedCategoryId}/products`;

    fetch(url)
      .then((res) => res.json())
      .then((response) => {
        let productList = [];
        if (Array.isArray(response)) {
          productList = response;
        } else if (response.success && Array.isArray(response.data)) {
          productList = response.data;
        }
        setProducts(productList);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [selectedCategoryId]);

  // Pagination logic
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handlePageClick = (page) => setCurrentPage(page);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <main style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" }}>
        {/* Category Filter */}
        <div
          style={{
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <label
            htmlFor="category-filter"
            style={{ marginRight: 8, fontWeight: "bold" }}
          >
            Filter by Category:
          </label>
          <select
            id="category-filter"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          >
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Products List */}
        {loading ? (
          <div style={{ textAlign: "center", color: "#888", fontSize: 18 }}>
            Loading products...
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "2rem",
              }}
            >
              {paginatedProducts.map((product, index) => (
                <div
                  key={product.id ?? `product-${index}`}
                  style={{
                    background: "#fff",
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                    padding: "1rem",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={getRandomImage(product.id ?? index)}
                    alt={product.productName}
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                  <h3 style={{ margin: "1rem 0 0.5rem 0", color: "#222" }}>
                    {product.productName}
                  </h3>
                  <p
                    style={{
                      color: "#27ae60",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    ₹{product.price}
                  </p>
                  <button
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.5rem 1.5rem",
                      background: "#222",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "2rem 0 0 0",
                  gap: 8,
                }}
              >
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: 4,
                    border: "1px solid #ccc",
                    background: currentPage === 1 ? "#eee" : "#fff",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageClick(i + 1)}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: 4,
                      border: "1px solid #ccc",
                      background: currentPage === i + 1 ? "#222" : "#fff",
                      color: currentPage === i + 1 ? "#fff" : "#222",
                      fontWeight: currentPage === i + 1 ? "bold" : "normal",
                      cursor: "pointer",
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: 4,
                    border: "1px solid #ccc",
                    background: currentPage === totalPages ? "#eee" : "#fff",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer
        style={{
          background: "#222",
          color: "#fff",
          textAlign: "center",
          padding: "1rem",
          marginTop: "2rem",
        }}
      >
        &copy; {new Date().getFullYear()} Shopify. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
