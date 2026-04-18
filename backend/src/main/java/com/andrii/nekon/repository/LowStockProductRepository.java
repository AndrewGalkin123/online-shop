package com.andrii.nekon.repository;

import com.andrii.nekon.model.LowStockProductView;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LowStockProductRepository extends JpaRepository<LowStockProductView, Long> {
    List<LowStockProductView> findAllByOrderByStockQuantityAsc();
}