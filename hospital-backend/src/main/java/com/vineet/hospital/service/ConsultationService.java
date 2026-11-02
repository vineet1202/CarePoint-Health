package com.vineet.hospital.service;

import com.vineet.hospital.dto.request.ConsultationRequestDto;
import com.vineet.hospital.dto.response.ConsultationResponseDto;

public interface ConsultationService {

	ConsultationResponseDto getConsultationForDoctor(
	        Long doctorUserId,
	        Long appointmentId
		);
	
	ConsultationResponseDto getConsultationForPatient(
		    Long patientUserId,
		    Long appointmentId
		);
	
	 ConsultationResponseDto createConsultation(
			 Long doctorId, 
			 Long appointmentId, 
			 ConsultationRequestDto request
		);
	 
	 ConsultationResponseDto updateConsultation(
			 Long doctorId, 
			 Long consultationId, 
			 ConsultationRequestDto request
		);
}
