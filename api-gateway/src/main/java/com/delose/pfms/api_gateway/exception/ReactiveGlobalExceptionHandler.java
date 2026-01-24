package com.delose.pfms.api_gateway.exception;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Order(-2) // High precedence to handle exceptions before other handlers
public class ReactiveGlobalExceptionHandler implements org.springframework.web.server.WebExceptionHandler {

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        if (exchange.getResponse().isCommitted()) {
            return Mono.error(ex);
        }

        ServerRequest request = ServerRequest.create(exchange, exchange.getRequest().getHeaders());

        return handleException(ex, request)
                .flatMap(response -> response.writeTo(exchange, new org.springframework.web.reactive.function.server.support.ServerResponseContext()))
                .onErrorResume(e -> Mono.error(ex));
    }

    private Mono<ServerResponse> handleException(Throwable ex, ServerRequest request) {
        HttpStatus status = getStatus(ex);
        String messageCode = getDetailMessageCode(ex);

        // Create a more detailed error message for expired tokens
        String errorMessage = "An error occurred";
        if (ex instanceof ExpiredJwtException) {
            errorMessage = "Your session has expired. Please log in again.";
        } else if (ex.getMessage() != null) {
            errorMessage = ex.getMessage();
        }

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(status, errorMessage);
        problemDetail.setTitle(status.getReasonPhrase());
        problemDetail.setProperty("errorCode", messageCode);

        return ServerResponse.status(status)
                .bodyValue(problemDetail);
    }

    private String getDetailMessageCode(Throwable ex) {
        if (ex instanceof BadCredentialsException) {
            return "error.auth.bad_credentials";
        } else if (ex instanceof ExpiredJwtException) {
            return "error.auth.token_expired";
        } else if (ex instanceof SignatureException) {
            return "error.auth.invalid_signature";
        } else if (ex instanceof MalformedJwtException) {
            return "error.auth.malformed_token";
        } else if (ex instanceof InsufficientAuthenticationException) {
            return "error.auth.missing_token";
        } else if (ex instanceof DuplicateKeyException) {
            return "error.db.duplicate_key";
        } else {
            return "error.general.internal_error";
        }
    }

    private HttpStatus getStatus(Throwable ex) {
        if (ex instanceof BadCredentialsException ||
            ex instanceof ExpiredJwtException ||
            ex instanceof SignatureException ||
            ex instanceof MalformedJwtException ||
            ex instanceof InsufficientAuthenticationException) {
            return HttpStatus.UNAUTHORIZED;
        } else if (ex instanceof DataIntegrityViolationException) {
            return HttpStatus.CONFLICT;
        }
        return HttpStatus.BAD_REQUEST;
    }
}
