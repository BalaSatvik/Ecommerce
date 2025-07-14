package com.orders.carts.service;

import java.util.List;

import com.orders.carts.domain.Cart;
import com.orders.carts.domain.CartItem;

public interface CartService {
    Cart getOrCreateCart(Long userId);
    void addItemToCart(Long userId, Long productId, Integer quantity);
    List<CartItem> getCartItems(Long userId);
    void removeItem(Long cartItemId);
    void clearCart(Long userId);
}
