package com.andrii.nekon.repository;

import com.andrii.nekon.model.UserLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserLogRepository extends JpaRepository<UserLog, Long> {
    List<UserLog> findAllByOrderByCreatedAtDesc();
}