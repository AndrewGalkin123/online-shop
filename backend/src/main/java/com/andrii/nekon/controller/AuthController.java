package com.andrii.nekon.controller;

import com.andrii.nekon.dto.AuthResponseDTO;
import com.andrii.nekon.dto.LoginRequestDTO;
import com.andrii.nekon.dto.RegisterRequestDTO;
import com.andrii.nekon.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO request) {
        authService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }

    // Теперь login возвращает AuthResponseDTO с токеном
    // а не просто строку "User logged in successfully"
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
