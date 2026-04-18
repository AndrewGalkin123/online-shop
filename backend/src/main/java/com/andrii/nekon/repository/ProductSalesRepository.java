package com.andrii.nekon.repository;

import com.andrii.nekon.model.ProductSalesView;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductSalesRepository extends JpaRepository<ProductSalesView, Long> {
    List<ProductSalesView> findAllByOrderByTotalSoldDesc();
}