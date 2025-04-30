package com.company.exception;

public class InvalidPasswordOrGmailException extends RuntimeException {
    public InvalidPasswordOrGmailException() {
        super("Invalid password or gmail");
    }
}
