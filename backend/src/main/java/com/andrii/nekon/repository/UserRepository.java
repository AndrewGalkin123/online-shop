package com.andrii.nekon.repository;

import com.andrii.nekon.model.Role;
import com.andrii.nekon.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    // Поиск по email С ролями — JOIN FETCH говорит Hibernate:
    // "загрузи пользователя И его роли одним запросом"
    // Используем этот метод при аутентификации
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.email = :email AND u.isActive = true")
    Optional<User> findByEmailWithRoles(@Param("email") String email);

    // Ищем пользователя по email включая деактивированных
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.email = :email")
    Optional<User> findByEmailIncludingInactive(@Param("email") String email);

    // Только активные пользователи
    List<User> findByIsActiveTrue();

    List<User> findAllByOrderByIsActiveDesc();

    @Modifying
    @Transactional
    @Query(
            value = """
    CALL register_user(
        :email,
        :password,
        :firstName,
        :lastName,
        :phone,
        :role
    )
    """,
            nativeQuery = true
    )
    void registerUser(
            @Param("email") String email,
            @Param("password") String password,
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("phone") String phone,
            @Param("role") String role
    );

    // Вызываем PostgreSQL функцию get_user_total_spent()
    // Возвращает сумму всех заказов пользователя
    @Query(value = "SELECT get_user_total_spent(:userId)", nativeQuery = true)
    Double getUserTotalSpent(@Param("userId") Long userId);

    // Вызов процедуры change_user_role
    @Modifying
    @Transactional
    @Query(value = "CALL change_user_role(:userId, :newRole)", nativeQuery = true)
    void changeUserRole(@Param("userId") Long userId, @Param("newRole") String newRole);

    // Вызов процедуры delete_user_by_id
    @Modifying
    @Transactional
    @Query(value = "CALL delete_user_by_id(:userId)", nativeQuery = true)
    void deleteUserById(@Param("userId") Long userId);
}
