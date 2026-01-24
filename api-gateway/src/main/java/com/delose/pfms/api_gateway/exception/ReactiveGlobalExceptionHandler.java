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

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(status, ex.getMessage());
        problemDetail.setTitle(status.getReasonPhrase());

        return ServerResponse.status(status)
                .bodyValue(problemDetail);
    }

    private String getDetailMessageCode(Throwable ex) {
        return switch (ex) {
            case BadCredentialsException e -> "error.auth.bad_credentials";
            case ExpiredJwtException e -> "error.auth.token_expired";
            case SignatureException e -> "error.auth.invalid_signature";
            case MalformedJwtException e -> "error.auth.malformed_token";
            case InsufficientAuthenticationException e -> "error.auth.missing_token";
            case DuplicateKeyException e -> "error.db.duplicate_key";
            default -> "error.general.internal_error";
        };
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
