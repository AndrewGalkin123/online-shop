package com.andrii.nekon.repository;

import com.andrii.nekon.model.UserStatisticsView;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserStatisticsRepository  extends JpaRepository<UserStatisticsView, Long> {
    List<UserStatisticsView> findAllByOrderByTotalSpentDesc();
}
