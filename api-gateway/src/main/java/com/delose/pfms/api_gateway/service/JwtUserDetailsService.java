package com.delose.pfms.api_gateway.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;

/**
 * Service class responsible for loading user details from the database.
 * It is used by the Spring Security framework to authenticate and authorize users.
 * It loads user details from a hardcoded list of users.
 */
@Service
@RequiredArgsConstructor
public class JwtUserDetailsService implements UserDetailsService {

    private final RestTemplate restTemplate;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Call the user-service to fetch user details
        User user = restTemplate.getForObject("http://user-service/api/v1/users/" + username, User.class);

        if (user != null) {
            return new User(
                    user.getUsername(),
                    user.getPassword(), // Assuming this is the hashed password
                    new ArrayList<>()  // Populate authorities if needed
            );
        } else {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
    }
}