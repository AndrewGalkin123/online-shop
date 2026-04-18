package com.andrii.nekon.repository;

import com.andrii.nekon.model.TopRatedProductView;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TopRatedProductRepository extends JpaRepository<TopRatedProductView, Long> {

    List<TopRatedProductView> findAllByOrderByAverageRatingDesc();
}
