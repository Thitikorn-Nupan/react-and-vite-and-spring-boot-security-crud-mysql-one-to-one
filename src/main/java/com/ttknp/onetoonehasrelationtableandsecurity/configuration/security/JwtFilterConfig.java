package com.ttknp.onetoonehasrelationtableandsecurity.configuration.security;

import com.ttknp.onetoonehasrelationtableandsecurity.services.security.JwtAuthenticateService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

// @Component // as @Bean
public class JwtFilterConfig extends OncePerRequestFilter {

    // The JWT exceptions are caught by the global exception handler because
    // we used the Handler exception resolver in the file JwtAuthenticationFilter.java to forward them.
    // The other exceptions come from Spring security.
    private final HandlerExceptionResolver handlerExceptionResolver;
    private final JwtAuthenticateService jwtAuthenticateService;
    private final UserDetailsService userDetailsService;


    private Logger log;

    public JwtFilterConfig(JwtAuthenticateService jwtAuthenticateService, UserDetailsService userDetailsService , HandlerExceptionResolver handlerExceptionResolver) {
        this.jwtAuthenticateService = jwtAuthenticateService;
        this.userDetailsService = userDetailsService;
        this.handlerExceptionResolver = handlerExceptionResolver;
        this.log = LoggerFactory.getLogger(this.getClass());
    }
    /**
     * How does it work ?
     * Retrieve the username by parsing the Bearer Token and subsequently search for the corresponding user information in the database. (assume)
     * Verify the authenticity of the JWT.
     * Generate an Authentication object using the provided username and password, and subsequently store it in the SecurityContextHolder.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("doFilterInternal");
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            try {
                String token = authorizationHeader.substring(7);
                String email = jwtAuthenticateService.extractEmail(token);
                // ***
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (email != null && authentication == null) {
                    // find user's email by email
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    log.info(userDetails.getUsername());
                    boolean isTokenValid = jwtAuthenticateService.isTokenValid(token, userDetails);
                    if (isTokenValid) {

                        // ** importance for authenticate
                        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                        usernamePasswordAuthenticationToken
                                .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        // After setting the Authentication in the context, we specify
                        // that the current user is authenticated.
                        // So it passes the Spring Security Configurations successfully
                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(usernamePasswordAuthenticationToken);
                    } // end token valid

                } // end email is not null

                filterChain.doFilter(request, response);

            } catch (Exception exception) {
                // A try-catch block wraps the logic and uses the HandlerExceptionResolver to forward
                // the error to the global exception handler.
                handlerExceptionResolver.resolveException(request, response, null, exception);
            }

        } else {
            filterChain.doFilter(request, response);
        }
    }
}
