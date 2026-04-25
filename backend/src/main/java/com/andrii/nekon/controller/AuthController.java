package com.andrii.nekon.controller;

import com.andrii.nekon.dto.AuthResponseDTO;
import com.andrii.nekon.dto.LoginRequestDTO;
import com.andrii.nekon.dto.RegisterRequestDTO;
import com.andrii.nekon.service.AuthService;
import com.andrii.nekon.service.RateLimitService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;
    private final RateLimitService rateLimitService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO request) {
        authService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }

    // Теперь login возвращает AuthResponseDTO с токеном
    // а не просто строку "User logged in successfully"
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request, HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);

        if (!rateLimitService.tryConsume(ip)) {
            return ResponseEntity
                    .status(HttpStatus.TOO_MANY_REQUESTS) // 429
                    .body(Map.of(
                            "message", "Too many login attempts. Please wait 1 minute."
                    ));
        }


        return ResponseEntity.ok(authService.login(request));
    }

    private String getClientIp(HttpServletRequest httpRequest) {
        String ip = httpRequest.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) {
            ip = httpRequest.getRemoteAddr();
        }
        // X-Forwarded-For может содержать несколько IP — берём первый
        return ip.split(",")[0].trim();
    }
}
