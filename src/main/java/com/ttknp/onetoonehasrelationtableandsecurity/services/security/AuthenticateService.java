package com.ttknp.onetoonehasrelationtableandsecurity.services.security;

import com.ttknp.onetoonehasrelationtableandsecurity.dtos.RegisterDTO;
import com.ttknp.onetoonehasrelationtableandsecurity.entities.security.User;
import com.ttknp.onetoonehasrelationtableandsecurity.repositories.security.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticateService {

    private final UserRepo userRepo;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    @Autowired // if you haven't had beans will get error. it makes sense
    public AuthenticateService(UserRepo userRepo, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }

    public User authenticateLogin(RegisterDTO registerDTO) {
        // for claims laterE
        authenticationManager
                .authenticate(
                        new UsernamePasswordAuthenticationToken(registerDTO.getEmail(), registerDTO.getPassword())
                );
        return userRepo
                .findByEmail(registerDTO.getEmail())
                .orElseThrow();
    }
}
