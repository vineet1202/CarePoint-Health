package com.vineet.hospital.dto.response;

import com.vineet.hospital.model.Role;

public record AuthResponseDto(
	    Long userId,
	    String email,
	    Role role,
	    String token   
	) {}
