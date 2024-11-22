package com.ttknp.onetoonehasrelationtableandsecurity.exception;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.AccountStatusException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;
import java.security.SignatureException;

/*There are different authentications we want to return a more explicit message. Let’s enumerates them:

Bad login credentials: thrown by the exception BadCredentialsException, we must return the HTTP Status code 401.
Account locked: thrown by the exception AccountStatusException, we must return the HTTP Status code 403.
Not authorized to access a resource: thrown by the exception AccessDeniedException, we must return the HTTP Status code 403.
Invalid JWT: thrown by the exception SignatureException, we must return the HTTP Status code 401.
JWT has expired: thrown by the exception ExpiredJwtException, we must return the HTTP Status code 401.
To handle these errors, we must use the Spring global exception handler to catch the exception thrown and customize the response to send to the client.*/
@RestControllerAdvice
public class GlobalExceptionHandler {

    // works as
    /*  @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        log.warn("commence() *** override works *** (rejects every unauthenticated request) *** Suck as invalid role,Token expired,Username didn't exist");
        // response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "unauthorized in this secure API"); // ** no response message on browser
        // ** this way below is better
        response.getWriter().append("Token was expired or User didn't exist"); // *** Note it's not just auth token expired it still catch if user no rules that you specify
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }*/
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleSecurityException(Exception exception) {
        ProblemDetail errorDetail = null;

        // exception.printStackTrace();

        if (exception instanceof BadCredentialsException) {
            errorDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(401), exception.getMessage());
            errorDetail.setProperty("description", "The username or password is incorrect");

            return errorDetail;
        }

        if (exception instanceof AccountStatusException) {
            errorDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(403), exception.getMessage());
            errorDetail.setProperty("description", "The account is locked");
        }

        if (exception instanceof AccessDeniedException) {
            errorDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(403), exception.getMessage());
            errorDetail.setProperty("description", "You are not authorized to access this resource");
        }

        if (exception instanceof SignatureException) {
            errorDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(403), exception.getMessage());
            errorDetail.setProperty("description", "The JWT signature is invalid");
        }

        if (exception instanceof ExpiredJwtException) {
            errorDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(403), exception.getMessage());
            errorDetail.setProperty("description", "The JWT token has expired");
        }

        if (errorDetail == null) {
            errorDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(500), exception.getMessage());
            errorDetail.setProperty("description", "Unknown internal server error.");
        }

        return errorDetail;
        /* {
            "type": "about:blank",
            "title": "Internal Server Error",
            "status": 500,
            "detail": "JWT signature does not match locally computed signature. JWT validity cannot be asserted and should not be trusted.",
            "instance": "/api/1/customer/reads",
            "description": "Unknown internal server error."
        }*/
    }
}