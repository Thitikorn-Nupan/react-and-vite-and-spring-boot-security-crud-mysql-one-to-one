package com.ttknp.onetoonehasrelationtableandsecurity.controllers.security;

import com.ttknp.onetoonehasrelationtableandsecurity.dtos.RegisterDTO;
import com.ttknp.onetoonehasrelationtableandsecurity.entities.security.User;
import com.ttknp.onetoonehasrelationtableandsecurity.services.security.AuthenticateService;
import com.ttknp.onetoonehasrelationtableandsecurity.services.security.JwtAuthenticateService;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/register")
// @CrossOrigin(origins="http://localhost:5173")
public class AuthenticateControl {
    // ** @Builder use with @Getter
    @Builder
    @AllArgsConstructor
    @Getter
    public static class LoginResponse {
        private String token;
        private long expiresIn;
    }

    private final JwtAuthenticateService jwtAuthenticateService;
    private final Logger log;
    private final AuthenticateService authenticateService;

    @Autowired
    public AuthenticateControl(JwtAuthenticateService jwtAuthenticateService, AuthenticateService authenticateService) {
        this.jwtAuthenticateService = jwtAuthenticateService;
        this.authenticateService = authenticateService;
        log = LoggerFactory.getLogger(this.getClass());
    }

    @GetMapping("/test")
    public String test() {
        return "test";
    }

    @PostMapping("/login")
    public ResponseEntity authenticate(@RequestBody RegisterDTO registerDTO) {
        User authenticatedUser = authenticateService.authenticateLogin(registerDTO);
        log.warn("authenticatedUser {} , {} , {} , {}",authenticatedUser.getUsername(),authenticatedUser.getEmail(),authenticatedUser.getPassword(),authenticatedUser.getFullname());

        // authenticatedUser don@outlook.co.th , don@outlook.co.th , $2a$10$KoLN51yY6kREUSPiJ8b3Je25cVN92TRP9U0MsXU6cMFy5WjsvKrTO , dony don
        String jwtToken = jwtAuthenticateService.processGenerateToken(authenticatedUser); // user as argument work for info jwt

        return ResponseEntity.ok(LoginResponse
                .builder()
                .token(jwtToken)
                .expiresIn(jwtAuthenticateService.getExpirationTime())
                .build());
    }

    /*@PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authenticateService.register(registerUserDto);
        return ResponseEntity.ok(registeredUser);
    }*/



}
