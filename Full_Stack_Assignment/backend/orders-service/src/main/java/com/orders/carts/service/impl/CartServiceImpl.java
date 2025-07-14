package com.orders.carts.service.impl;

import com.orders.carts.dao.CartDAO;
import com.orders.carts.domain.Cart;
import com.orders.carts.domain.CartItem;
import com.orders.carts.service.CartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartDAO cartDAO;

    @Override
    public Cart getOrCreateCart(Long userId) {
        Cart cart = cartDAO.getCartByUserId(userId);
        if (cart == null) {
            Long cartId = cartDAO.createCart(userId);
            cart = new Cart(cartId, userId, null, null, null);
        }
        return cart;
    }

    @Override
    public void addItemToCart(Long userId, Long productId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = new CartItem();
        item.setCartId(cart.getCartId());
        item.setProductId(productId);
        item.setQuantity(quantity);
        cartDAO.addItemToCart(item);
    }

    @Override
    public List<CartItem> getCartItems(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return cartDAO.getItemsByCartId(cart.getCartId());
    }

    @Override
    public void removeItem(Long cartItemId) {
        cartDAO.removeItem(cartItemId);
    }

    @Override
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cartDAO.clearCart(cart.getCartId());
    }
}
