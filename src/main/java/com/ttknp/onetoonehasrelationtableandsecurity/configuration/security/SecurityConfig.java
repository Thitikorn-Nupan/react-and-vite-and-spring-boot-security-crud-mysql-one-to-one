package com.ttknp.onetoonehasrelationtableandsecurity.configuration.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * The custom authentication is ready, and the remaining thing is to define
 * what criteria an incoming request must match before being forwarded to application middleware. We want the following criteria:
 * There is no need to provide the CSRF token because we will use it.
 * The request URL path matching /auth/signup and /auth/login doesn't require authentication.
 * Any other request URL path must be authenticated.
 * The request is stateless, meaning every request must be treated as a new one, even if it comes from the same client or has been received earlier.
 * Must use the custom authentication provider, and they must be executed before the authentication middleware.
 * The CORS configuration must allow only POST and GET requests.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final AuthenticationProvider authenticationProvider;
    private final JwtFilterConfig jwtFilterConfig;

    //  *** @Configuration -> dependency inject -> @Configuration Or @Component
    @Autowired
    public SecurityConfig(AuthenticationProvider authenticationProvider, JwtFilterConfig jwtFilterConfig) {
        this.authenticationProvider = authenticationProvider;
        this.jwtFilterConfig = jwtFilterConfig;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((authenticate) ->
                        authenticate
                                // permitAll() it won't authenticates
                                .requestMatchers(HttpMethod.POST, "/api/register/login").permitAll() // **
                                // ***
                                // it will authenticate this particular request who has Authorities like below it can access
                                // ** Role map RULE_ADMIN , RULE_USER
                                // ** Authority map ADMIN , USER (Free prefix)
                                .requestMatchers(HttpMethod.GET, "/api/customer/read").hasAnyAuthority("admin","user") // **
                                .requestMatchers(HttpMethod.GET, "/api/customer/reads").hasAuthority("admin") // **
                                .requestMatchers(HttpMethod.POST, "/api/customer/create").hasAuthority("admin") // **
                                .requestMatchers(HttpMethod.PUT, "/api/customer/update").hasAuthority("admin") // **
                                .requestMatchers(HttpMethod.DELETE, "/api/customer/delete").hasAuthority("admin") // **

                                .requestMatchers(HttpMethod.GET, "/api/detail/reads").hasAuthority("admin") // **
                                .requestMatchers(HttpMethod.GET, "/api/detail/read").hasAuthority("admin") // **
                                .requestMatchers(HttpMethod.PUT, "/api/detail/update").hasAuthority("admin") // **


                                .anyRequest()
                                .authenticated()
                )
                .authenticationProvider(authenticationProvider)
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                // for access post,put,delete,... methods
                .csrf().disable()
                // tells spring security that clients are going to authenticate the requests through basic authentication method.
                .httpBasic()
                .and()
                .addFilterBefore(jwtFilterConfig, UsernamePasswordAuthenticationFilter.class)
                // remember if you got error Securing OPTIONS /error
                // just specify cors()
                // cors() -> tells spring security to enable cors. So Now server is ready to whitelist/filter the origins. So be mindful that we are still going to set the origins list
                .cors();

        return http.build();
    }

    /*@Bean
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
    }*/
}
