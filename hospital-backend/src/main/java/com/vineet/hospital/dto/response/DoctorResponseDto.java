package com.vineet.hospital.dto.response;

import java.math.BigDecimal;

public record DoctorResponseDto(
	    Long id,
	    String fullName,
	    String specialization,
	    String qualification,
	    Integer experienceYears,
	    BigDecimal consultationFee
	) {}
