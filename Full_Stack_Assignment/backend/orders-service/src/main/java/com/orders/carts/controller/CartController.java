package com.orders.carts.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orders.carts.domain.CartItem;
import com.orders.carts.service.CartService;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // Get items in user's cart
    @GetMapping("/{userId}/items")
    public List<CartItem> getCartItems(@PathVariable Long userId) {
        return cartService.getCartItems(userId);
    }

    // Add item to cart
    @PostMapping("/add")
    public String addItem(@RequestBody AddItemRequest request) {
        cartService.addItemToCart(request.getUserId(), request.getProductId(), request.getQuantity());
        return "Item added to cart.";
    }

    // Remove single item
    @DeleteMapping("/item/{cartItemId}")
    public String removeItem(@PathVariable Long cartItemId) {
        cartService.removeItem(cartItemId);
        return "Item removed from cart.";
    }

    // Clear entire cart
    @DeleteMapping("/{userId}/clear")
    public String clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return "Cart cleared.";
    }

    @Data
    public static class AddItemRequest {
        private Long userId;
        private Long productId;
        private Integer quantity;
    }
}
