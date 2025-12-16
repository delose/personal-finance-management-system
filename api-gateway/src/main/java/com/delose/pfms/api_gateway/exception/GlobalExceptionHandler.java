package com.delose.pfms.api_gateway.exception;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        return getErrorResponseResponseEntity(e);
    }

    private ResponseEntity<ErrorResponse> getErrorResponseResponseEntity(Exception e) {
        HttpStatus status = getStatus(e);
        String messageCode = getDetailMessageCode(e);

        ErrorResponse error = new ErrorResponse() {
            @Override
            public HttpStatusCode getStatusCode() { return status; }

            @Override
            public ProblemDetail getBody() {
                ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, e.getMessage());
                pd.setTitle(status.getReasonPhrase());
                return pd;
            }

            @Override
            public String getDetailMessageCode() { return messageCode; }
        };
        return new ResponseEntity<>(error, status);
    }

    private String getDetailMessageCode(Exception e) {
        return switch (e) {
            case BadCredentialsException ex -> "error.auth.bad_credentials";
            case ExpiredJwtException ex -> "error.auth.token_expired"; // wip
            case SignatureException ex -> "error.auth.invalid_signature";
            case DuplicateKeyException ex -> "error.db.duplicate_key"; // wip
            default -> "error.general.internal_error";
        };
    }

    private HttpStatus getStatus(Exception e) {
        if (e instanceof BadCredentialsException || e instanceof ExpiredJwtException || e instanceof SignatureException) {
            return HttpStatus.UNAUTHORIZED;
        } else if (e instanceof DataIntegrityViolationException) {
            return HttpStatus.CONFLICT;
        }
        return HttpStatus.BAD_REQUEST;
    }
}
