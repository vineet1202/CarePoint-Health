package com.vineet.hospital.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ConsultationRequestDto(
		@NotBlank String diagnosis,
	    String doctorNotes
	 ) {}
