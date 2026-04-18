package com.andrii.nekon.controller;

import com.andrii.nekon.dto.ProductDetailDTO;
import com.andrii.nekon.dto.ProductListDTO;
import com.andrii.nekon.dto.TopRatedProductDTO;
import com.andrii.nekon.service.ProductService;
import com.andrii.nekon.service.ReviewService;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;
    private final ReviewService reviewService;

    public ProductController(ProductService productService, ReviewService reviewService) {
        this.productService = productService;
        this.reviewService = reviewService;
    }

    @PostMapping("/by-ids")
    public List<ProductListDTO> getProductsByIds(
            @RequestBody List<Long> ids
    ) {
        return productService.getProductsByIds(ids);
    }

    @GetMapping("/categories/{slug}/products")
    public Page<ProductListDTO> getByCategory(
            @PathVariable String slug,
            @PageableDefault(size = 12) Pageable pageable
    ) {
        return productService.getProductsByCategory(slug, pageable);
    }

    // Топ товаров по рейтингу — публичный, без токена
// GET http://localhost:8080/api/products/top-rated
    @GetMapping("/products/top-rated")
    public ResponseEntity<List<TopRatedProductDTO>> getTopRated() {
        return ResponseEntity.ok(reviewService.getTopRatedProducts());
    }

    @GetMapping("/products/{id}")
    public ProductDetailDTO getById(@PathVariable Long id) {
        return productService.getProductById(id);
    }
}
