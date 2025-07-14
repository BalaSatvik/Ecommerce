package com.orders.carts.dao.impl;

import com.orders.carts.dao.CartDAO;
import com.orders.carts.domain.Cart;
import com.orders.carts.domain.CartItem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CartDAOImpl implements CartDAO {

    @Autowired
    private NamedParameterJdbcTemplate jdbcTemplate;

    private RowMapper<Cart> cartMapper = (rs, rowNum) -> {
        Cart cart = new Cart();
        cart.setCartId(rs.getLong("CartId"));
        cart.setUserId(rs.getLong("UserId"));
        cart.setCreatedAt(rs.getTimestamp("CreatedAt") != null ? rs.getTimestamp("CreatedAt").toLocalDateTime() : null);
        cart.setUpdatedAt(rs.getTimestamp("UpdatedAt") != null ? rs.getTimestamp("UpdatedAt").toLocalDateTime() : null);
        return cart;
    };

    private RowMapper<CartItem> cartItemMapper = (rs, rowNum) -> {
        CartItem item = new CartItem();
        item.setCartItemId(rs.getLong("CartItemId"));
        item.setCartId(rs.getLong("CartId"));
        item.setProductId(rs.getLong("ProductId"));
        item.setQuantity(rs.getInt("Quantity"));
        item.setCreatedAt(rs.getTimestamp("CreatedAt") != null ? rs.getTimestamp("CreatedAt").toLocalDateTime() : null);
        item.setUpdatedAt(rs.getTimestamp("UpdatedAt") != null ? rs.getTimestamp("UpdatedAt").toLocalDateTime() : null);
        return item;
    };

    @Override
    public Long createCart(Long userId) {
        String sql = "INSERT INTO carts (UserId) VALUES (:userId)";
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("userId", userId);
        jdbcTemplate.update(sql, params);
        return jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", new MapSqlParameterSource(), Long.class);
    }

    @Override
    public void addItemToCart(CartItem item) {
        String sql = "INSERT INTO cart_items (CartId, ProductId, Quantity) " +
                     "VALUES (:cartId, :productId, :quantity)";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("cartId", item.getCartId())
                .addValue("productId", item.getProductId())
                .addValue("quantity", item.getQuantity());
        jdbcTemplate.update(sql, params);
    }

    @Override
    public List<CartItem> getItemsByCartId(Long cartId) {
        String sql = "SELECT * FROM cart_items WHERE CartId = :cartId";
        return jdbcTemplate.query(sql, new MapSqlParameterSource("cartId", cartId), cartItemMapper);
    }

    @Override
    public void removeItem(Long cartItemId) {
        String sql = "DELETE FROM cart_items WHERE CartItemId = :cartItemId";
        jdbcTemplate.update(sql, new MapSqlParameterSource("cartItemId", cartItemId));
    }

    @Override
    public void clearCart(Long cartId) {
        String sql = "DELETE FROM cart_items WHERE CartId = :cartId";
        jdbcTemplate.update(sql, new MapSqlParameterSource("cartId", cartId));
    }

    @Override
    public Cart getCartByUserId(Long userId) {
        String sql = "SELECT * FROM carts WHERE UserId = :userId";
        List<Cart> carts = jdbcTemplate.query(sql, new MapSqlParameterSource("userId", userId), cartMapper);
        return carts.isEmpty() ? null : carts.get(0);
    }
}
