package com.delose.pfms.user_service.service;

import com.delose.pfms.user_service.dto.UserRegistrationDTO;
import com.delose.pfms.user_service.entity.UserEntity;
import com.delose.pfms.user_service.exception.UserException;

public interface UserService {
    UserEntity register(UserRegistrationDTO user) throws UserException;
}