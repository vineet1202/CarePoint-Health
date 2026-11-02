package com.vineet.hospital.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DoctorRegisterRequestDto(
	    @Email @NotBlank String email,
	    @NotBlank @Size(min = 8) String password,
	    @NotBlank String fullName,
	    @NotBlank String specialization,
	    String qualification,
	    Integer experienceYears,
	    @NotNull @DecimalMin("0.0") BigDecimal consultationFee
	) {}
