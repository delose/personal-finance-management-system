package com.delose.pfms.user_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import lombok.Getter;
import lombok.Setter;

@Table("users")
@Getter
@Setter
public class UserEntity {

    @Id
    private Long id;
    private String username;
    private String password;
    private String email;

}
