package com.vineet.hospital.dto.response;

public record ConsultationResponseDto(
		Long id,
	    Long appointmentId,
	    String diagnosis,
	    String doctorNotes	
	) {}
