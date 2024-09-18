package com.delose.pfms.api_gateway.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@AllArgsConstructor
@Data
public class User {
    private String username;
    private String password;

}
