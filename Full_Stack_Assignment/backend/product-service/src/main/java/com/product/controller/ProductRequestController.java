package com.product.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.product.Exceptions.InvalidProductRequestException;
import com.product.Exceptions.ProductDatabaseOperationException;
import com.product.Exceptions.RequestNotFoundException;
import com.product.domain.Product;
import com.product.domain.ProductRequest;
import com.product.domain.SearchProductRequestCriteria;
import com.product.service.ProductRequestService;
import com.product.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/product-requests")
@RequiredArgsConstructor
public class ProductRequestController {
	private final ProductRequestService productRequestService;
	private final ProductService productService;
	
	@GetMapping("/products")
	public List<Product> getAllApprovedProducts() {
        return productService.getProducts("");
    }

	@PostMapping("/create")
	public ProductRequest createProductRequest(@RequestBody ProductRequest request)
			throws ProductDatabaseOperationException, InvalidProductRequestException {
		return productRequestService.generateProductRequest(request);
	}

	@PostMapping("/search")
	public List<ProductRequest> getRequestByCriteria(@RequestBody SearchProductRequestCriteria criteria)
			throws ProductDatabaseOperationException, RequestNotFoundException, InvalidProductRequestException {
		if (criteria.getPageNumber() != null && criteria.getPageNumber() < 0) {
			throw new InvalidProductRequestException("Page number cannot be negative");
		}
		if (criteria.getPageSize() != null && criteria.getPageSize() <= 0) {
			throw new InvalidProductRequestException("Page size must be greater than 0");
		}
		return productRequestService.getRequestsByCriteria(criteria);
	}

	@PutMapping("/update")
	public String updatePendingRequest(@RequestBody ProductRequest requestToUpdate)
			throws ProductDatabaseOperationException, InvalidProductRequestException {
		productRequestService.updatePendingProductRequest(requestToUpdate);
		return "Product request " + "[ID:" + requestToUpdate.getProductRequestId() + "]" + " updated successfully";
	}
}
