package com.ttknp.onetoonehasrelationtableandsecurity.repositories.security;

import com.ttknp.onetoonehasrelationtableandsecurity.entities.security.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository //** i don't need service layer on this repo
public interface UserRepo extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
}
