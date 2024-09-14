package com.delose.pfms.user_service.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import com.delose.pfms.user_service.entity.UserEntity;
import reactor.core.publisher.Mono;

public interface UserRepository extends ReactiveCrudRepository<UserEntity, Long> {

    Mono<UserEntity> findByUsername(String username);
    Mono<UserEntity> findByEmail(String email);
}