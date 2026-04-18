package com.andrii.nekon.dto;

import lombok.*;

// Для смены роли пользователя
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ChangeRoleDTO {
    private String role; // ROLE_USER, ROLE_MANAGER, ROLE_ADMIN
}