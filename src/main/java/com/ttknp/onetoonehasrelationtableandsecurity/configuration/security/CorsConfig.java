package com.ttknp.onetoonehasrelationtableandsecurity.configuration.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean // this bean have to config inside @Configuration
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            // allow preflight to check which origin is allowed and how do i whitelist “http://localhost:4200” as a qualified origin
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/customer/**")
                        .allowedOrigins("http://localhost:5173","http://thitikorn-nupan.com") // work instead @CrossOrigin(origins = "http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE");
                registry.addMapping("/api/detail/**")
                        .allowedOrigins("http://localhost:5173","http://thitikorn-nupan.com")
                        .allowedMethods("GET", "PUT");
                registry.addMapping("/api/register/login")
                        .allowedOrigins("http://localhost:5173","http://thitikorn-nupan.com")
                        .allowedMethods("POST");
            }
        };
    }
}
