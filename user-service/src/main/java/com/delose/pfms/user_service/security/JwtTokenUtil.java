package com.delose.pfms.user_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import java.security.Key;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Date;

import java.util.Collections;

@Component
@Getter
@Setter
public class JwtTokenUtil {

    private Key secretKey;

    private Long expiration = 3600L; // Default expiration time in seconds (1 hour)

    @PostConstruct
    public void init() {
        this.secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512); // Generate a secure key
    }

    public void setExpiration(Long expiration) {
        this.expiration = expiration;
    }

    public String generateToken(Authentication authentication) {
        return Jwts.builder()
                .setSubject(authentication.getName())
                .claim("role", "ROLE_USER") // Ensure a role is added
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(secretKey)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return getAllClaimsFromToken(token).getSubject();
    }

    public boolean isTokenExpired(String token) {
        Date expirationDate = getAllClaimsFromToken(token).getExpiration();
        return expirationDate.before(new Date());
    }

    public Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = getAllClaimsFromToken(token);
        String username = claims.getSubject();
        String role = claims.get("role", String.class);

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role != null ? role : "ROLE_USER"); // Ensure role is not null
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(username, "", Collections.singletonList(authority));

        return new UsernamePasswordAuthenticationToken(userDetails, "", Collections.singletonList(authority));
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
