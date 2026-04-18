package com.andrii.nekon.repository;

import com.andrii.nekon.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategory_Slug(String slug, Pageable pageable);

    List<Product> findByIdIn(List<Long> ids);

    @Query(value = "SELECT is_product_in_stock(:productId)", nativeQuery = true)
    Boolean isProductInStock(@Param("productId") Long productId);

    // Вызов процедуры update_product_stock
    @Modifying
    @Transactional
    @Query(value = "CALL update_product_stock(:productId, :newStock)", nativeQuery = true)
    void updateProductStock(
            @Param("productId") Long productId,
            @Param("newStock") Integer newStock
    );
}
