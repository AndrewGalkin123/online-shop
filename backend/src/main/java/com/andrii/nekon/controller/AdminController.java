package com.andrii.nekon.controller;

import com.andrii.nekon.dto.*;
import com.andrii.nekon.model.UserLog;
import com.andrii.nekon.repository.UserLogRepository;
import com.andrii.nekon.service.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // только ADMIN
public class AdminController {

    private final ManagerService managerService;
    private final UserLogRepository userLogRepository;

    // Сменить роль пользователя
    // PATCH /api/admin/users/1/role
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<?> changeRole(
            @PathVariable Long id,
            @RequestBody ChangeRoleDTO request
    ) {
        managerService.changeUserRole(id, request.getRole());
        return ResponseEntity.ok("Role updated to " + request.getRole());
    }

    // Удалить пользователя
    // DELETE /api/admin/users/1
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        managerService.deleteUser(id);
        return ResponseEntity.ok("User deleted");
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<?> activateUser(@PathVariable Long id) {
        managerService.activateUser(id);
        return ResponseEntity.ok("User activated");
    }

    // Логи действий — триггер log_user_action пишет автоматически
    // GET /api/admin/logs
    @GetMapping("/logs")
    public ResponseEntity<List<UserLog>> getLogs() {
        return ResponseEntity.ok(userLogRepository.findAllByOrderByCreatedAtDesc());
    }
}