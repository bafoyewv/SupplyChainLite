package com.company.exception;

public class AppBadRequestException extends RuntimeException {

    public AppBadRequestException(String s) {
        super(s);
    }
}
