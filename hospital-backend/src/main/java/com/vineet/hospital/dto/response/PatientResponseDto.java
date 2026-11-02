package com.vineet.hospital.dto.response;

import java.time.LocalDate;

public record PatientResponseDto(
	    Long id,
	    String fullName,
	    LocalDate dateOfBirth,
	    String gender,
	    String bloodGroup,
	    String emergencyContact
	) {}
