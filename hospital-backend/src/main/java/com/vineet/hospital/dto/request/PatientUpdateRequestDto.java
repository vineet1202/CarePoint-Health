package com.vineet.hospital.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

public record PatientUpdateRequestDto(
		 @Size(min = 2, max = 100)
		 String fullName,

		 @PastOrPresent
		 LocalDate dateOfBirth,

		 String gender,

		 String bloodGroup,

		 @Size(max = 15)
		 String emergencyContact
	) {}
