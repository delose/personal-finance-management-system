package com.delose.pfms.user_service.service;

import reactor.core.publisher.Mono;
import com.delose.pfms.user_service.entity.UserEntity;

public interface UserService {
    Mono<UserEntity> register(UserEntity user);
    Mono<UserEntity> login(String username, String password);
    Mono<UserEntity> getUserDetails(String username);
}