package com.andrii.nekon.service;

import com.andrii.nekon.dto.ProductDetailDTO;
import com.andrii.nekon.dto.ProductListDTO;
import com.andrii.nekon.model.Product;
import com.andrii.nekon.model.ProductImage;
import com.andrii.nekon.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Page<ProductListDTO> getProductsByCategory(String slug, Pageable pageable) {

        Page<Product> products =
                productRepository.findByCategory_Slug(slug, pageable);

        return products.map(this::mapToListDTO);
    }

    public ProductDetailDTO getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return mapToDetailDTO(product);
    }

    public List<ProductListDTO> getProductsByIds(List<Long> ids) {

        List<Product> products =
                productRepository.findByIdIn(ids);

        return products.stream()
                .map(this::mapToListDTO)
                .toList();
    }

    private ProductListDTO mapToListDTO(Product product) {

        String mainImage = product.getImages()
                .stream()
                .filter(img -> Boolean.TRUE.equals(img.getIsMain()))
                .map(img -> img.getImageUrl())
                .findFirst()
                .orElse(product.getImages().isEmpty()
                        ? null
                        : product.getImages().get(0).getImageUrl());

        return new ProductListDTO(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getOriginalPrice(),
                product.getOnSale(),
                product.getStock(),
                product.getCategory().getSlug(),
                mainImage
        );
    }

    private ProductDetailDTO mapToDetailDTO(Product product) {

        List<String> images = product.getImages().stream()
                .sorted((a, b) -> Boolean.compare(
                        !Boolean.TRUE.equals(a.getIsMain()),
                        !Boolean.TRUE.equals(b.getIsMain())
                ))
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        return new ProductDetailDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getOriginalPrice(),
                product.getOnSale(),
                product.getStock(),
                product.getAttributes(),
                product.getCategory().getSlug(),
                product.getCategory().getName(),
                images
        );
    }
}
