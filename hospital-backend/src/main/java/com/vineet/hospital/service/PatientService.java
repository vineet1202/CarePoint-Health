package com.vineet.hospital.service;

import java.util.List;

import com.vineet.hospital.dto.request.PatientUpdateRequestDto;
import com.vineet.hospital.dto.response.AppointmentResponseDto;
import com.vineet.hospital.dto.response.PatientResponseDto;

public interface PatientService {

	PatientResponseDto getPatientById(Long patientId);
    PatientResponseDto updatePatientProfile(Long patientId, PatientUpdateRequestDto request);
    
    List<AppointmentResponseDto> getAppointmentsForPatient(Long patientId);
    
    PatientResponseDto getPatientByUserId(Long patientUserId);
}
