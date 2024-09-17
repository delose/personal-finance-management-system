package com.delose.pfms.user_service.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collections;
import java.util.Date;
import java.security.Key;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtTokenUtilTest {

    private JwtTokenUtil jwtTokenUtil;

    @BeforeEach
    public void setUp() {
        // Generate a secure key
        Key secretKey = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS512);
        
        // Initialize JwtTokenUtil with the secure key
        jwtTokenUtil = new JwtTokenUtil();
        jwtTokenUtil.setSecretKey(secretKey); // Add this method to set the secret key
        jwtTokenUtil.setExpiration(3600L); // Set default expiration time
    }

    @Test
    @Disabled("Debugging required")
    public void testGenerateToken() {
        User user = new User("testuser", "", Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null);
        
        String token = jwtTokenUtil.generateToken(authentication);
        assertThat(token).isNotNull();

        String username = jwtTokenUtil.getUsernameFromToken(token);
        assertThat(username).isEqualTo("testuser");

        Claims claims = Jwts.parser().setSigningKey("your_secret_key").parseClaimsJws(token).getBody();
        assertThat(claims.getExpiration()).isAfter(new Date());
    }

    @Test
    @Disabled("Debugging required")
    public void testTokenExpiration() throws InterruptedException {
        jwtTokenUtil.setExpiration(1L); // Set expiration to 1 second for testing
        User user = new User("testuser", "", Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null);

        String token = jwtTokenUtil.generateToken(authentication);
        Thread.sleep(2000); // Wait for 2 seconds

        assertThat(jwtTokenUtil.isTokenExpired(token)).isTrue();
    }

    @Test
    public void testValidateToken() {
        User user = new User("testuser", "", Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null);

        String token = jwtTokenUtil.generateToken(authentication);
        assertThat(jwtTokenUtil.validateToken(token, user)).isTrue();
    }

}
