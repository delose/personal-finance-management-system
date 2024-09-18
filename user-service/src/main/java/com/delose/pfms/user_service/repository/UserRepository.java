package com.delose.pfms.user_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.delose.pfms.user_service.entity.User;

public interface UserRepository extends JpaRepository<User, String> {
    User findByUsername(String username);
}