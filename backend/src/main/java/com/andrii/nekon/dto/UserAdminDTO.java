package com.andrii.nekon.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserAdminDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private Double totalSpent; // из get_user_total_spent()
    private String role;
    private Boolean isActive;
}
