package com.vineet.hospital.exception;

public abstract class BaseException extends RuntimeException {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	protected BaseException(String message) {
        super(message);
    }
}
