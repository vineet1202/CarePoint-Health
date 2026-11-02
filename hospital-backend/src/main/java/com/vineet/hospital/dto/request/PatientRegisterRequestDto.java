package com.vineet.hospital.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PatientRegisterRequestDto(
	    @Email @NotBlank String email,
	    @NotBlank @Size(min = 8) String password,
	    @NotBlank String fullName,
	    LocalDate dateOfBirth,
	    String gender,
	    String bloodGroup,
	    String emergencyContact
	) {}
