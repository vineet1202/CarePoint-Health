package com.vineet.hospital.service;

import java.time.LocalDate;
import java.util.List;

import com.vineet.hospital.dto.request.AppointmentBookRequestDto;
import com.vineet.hospital.dto.request.AppointmentRescheduleRequestDto;
import com.vineet.hospital.dto.response.AppointmentResponseDto;
import com.vineet.hospital.model.Role;

public interface AppointmentService {
    
	AppointmentResponseDto bookAppointment(Long patientUserId, AppointmentBookRequestDto request);
	
    AppointmentResponseDto getAppointmentById(Long appointmentId, Long userId, Role role);
    
    AppointmentResponseDto rescheduleAppointment(
    		Long appointmentId, 
    		Long patientUserId,
    		AppointmentRescheduleRequestDto request
    	);
    
    void cancelAppointment(Long appointmentId, Long patientUserId);
    
    List<AppointmentResponseDto> getAppointmentsForDoctor(Long doctorId, LocalDate date);

    List<AppointmentResponseDto> getAppointmentsForPatient(Long patientUserId);
    
    List<AppointmentResponseDto> getPatientHistoryForDoctor(
            Long doctorUserId,
            Long patientId
    );
}