package com.company.exception;

public class ItemNotFoundException extends RuntimeException {

    public ItemNotFoundException() {
        super("Item Not Found!!!");
    }
}
