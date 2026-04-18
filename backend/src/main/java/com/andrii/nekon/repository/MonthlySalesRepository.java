package com.andrii.nekon.repository;

import com.andrii.nekon.model.MonthlySalesView;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface MonthlySalesRepository
        extends JpaRepository<MonthlySalesView, LocalDateTime> {
    List<MonthlySalesView> findAllByOrderByMonthDesc();
}