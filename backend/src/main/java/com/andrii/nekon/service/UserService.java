package com.andrii.nekon.service;
import com.andrii.nekon.dto.UserAdminDTO;
import com.andrii.nekon.dto.UserProfileDTO;
import com.andrii.nekon.model.User;
import com.andrii.nekon.repository.UserRepository;
import com.andrii.nekon.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ─── Профиль текущего пользователя с суммой трат ─────────────────────────
    // GET /api/users/me
    public UserProfileDTO getMyProfile() {
        User user = getCurrentUser();
        // Вызываем функцию БД — она считает сумму всех заказов пользователя
        Double totalSpent = userRepository.getUserTotalSpent(user.getId());

        UserProfileDTO userProfileDTO = new UserProfileDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                totalSpent
        );

        return userProfileDTO;
    }

    public void deleteMyAccount() {
        User user = getCurrentUser();
        // Используем ту же процедуру что и админ — мягкое удаление
        userRepository.deleteUserById(user.getId());
    }

    private String getUserRole(User user) {
        // Берём первую роль пользователя
        return user.getRoles().stream()
                .findFirst()
                .map(role -> role.getName())
                .orElse("ROLE_USER");
    }

    // ─── Для ADMIN/MANAGER: профиль любого пользователя с суммой трат ────────
    // GET /api/admin/users/{id}  или  GET /api/manager/users/{id}
    public UserAdminDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Та же функция БД — но для любого пользователя по id
        Double totalSpent = userRepository.getUserTotalSpent(userId);

        return new UserAdminDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                totalSpent,
                getUserRole(user),
                user.getIsActive()
        );
    }

    // ─── Для ADMIN/MANAGER: все пользователи с суммой трат ───────────────────
    // GET /api/admin/users
    public List<UserAdminDTO> getAllUsers() {
        return userRepository.findAllByOrderByIsActiveDesc()
                .stream()
                .map(user -> new UserAdminDTO(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getPhone(),
                        // для каждого пользователя вызываем функцию БД
                        userRepository.getUserTotalSpent(user.getId()),
                        getUserRole(user),
                        user.getIsActive()
                ))
                .collect(Collectors.toList());
    }
}
