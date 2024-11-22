package com.ttknp.onetoonehasrelationtableandsecurity.configuration;

import com.ttknp.onetoonehasrelationtableandsecurity.configuration.security.JwtFilterConfig;
import com.ttknp.onetoonehasrelationtableandsecurity.repositories.security.UserRepo;
import com.ttknp.onetoonehasrelationtableandsecurity.services.security.JwtAuthenticateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.HandlerExceptionResolver;

/**
    Perform the authentication by finding the user in our database.
    Generate a JWT token when the authentication succeeds. (Then)
    To override the implementation, let’s create a package configs, add the file BeansConfig.java
*/
@Configuration
public class BeansConfig {


    private final UserRepo userRepo;
    private final HandlerExceptionResolver handlerExceptionResolver;
    private final JwtAuthenticateService jwtAuthenticateService;


    @Autowired
    public BeansConfig(UserRepo userRepo,JwtAuthenticateService jwtAuthenticateService,HandlerExceptionResolver handlerExceptionResolver) {
        this.userRepo = userRepo;
        this.jwtAuthenticateService = jwtAuthenticateService;
        this.handlerExceptionResolver = handlerExceptionResolver;
    }

    //  *** @Service -> dependency inject -> @Configuration
    // The userDetailsService() defines how to retrieve the user using the UserRepository that is injected.
    // *** beans on below for JwtFilterConfig
    @Bean
    protected UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                return userRepo
                        .findByEmail(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            }
        };
    }

    //  *** @Service -> dependency inject -> @Configuration
    //  The passwordEncoder() creates an instance of the BCryptPasswordEncoder() used to encode the plain user password.
    //  *** if you have passwords like plain text will throw error
    @Bean
    protected BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    // *** Both beans on the top for AuthenticateService


    // The authenticationProvider() sets the new strategy to perform the authentication.
    // *** Both beans on below for SecurityConfig
    @Bean
    protected AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    @Bean
    protected JwtFilterConfig jwtFilterConfig() {
        return new JwtFilterConfig(jwtAuthenticateService,userDetailsService(),handlerExceptionResolver);
    }
    // ***


}
