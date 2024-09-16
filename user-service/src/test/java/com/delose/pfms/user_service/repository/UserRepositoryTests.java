package com.delose.pfms.user_service.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.delose.pfms.user_service.entity.UserEntity;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class UserRepositoryTests {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testCreateAndFindUser() {
        UserEntity user = new UserEntity("testuser", "testuser@example.com", "password123", "ROLE_USER");
        userRepository.save(user);

        UserEntity foundUser = userRepository.findByUsername("testuser").orElse(null);
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getUsername()).isEqualTo("testuser");
    }
}
