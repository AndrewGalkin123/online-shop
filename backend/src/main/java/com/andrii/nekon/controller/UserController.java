package com.andrii.nekon.controller;

import com.andrii.nekon.dto.UserProfileDTO;
import com.andrii.nekon.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getMyProfile() {
        return ResponseEntity.ok(userService.getMyProfile());
    }

    // Пользователь удаляет свой аккаунт (мягкое удаление)
    // DELETE /api/users/me
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteMyAccount() {
        userService.deleteMyAccount();
        return ResponseEntity.ok("Account deleted");
    }

}
