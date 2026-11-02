package com.vineet.hospital.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;

public record DoctorUpdateRequestDto(
	    String qualification,
	    Integer experienceYears,
	    @DecimalMin("0.0") BigDecimal consultationFee
	) {}
