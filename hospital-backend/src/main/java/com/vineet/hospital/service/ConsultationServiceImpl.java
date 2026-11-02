package com.vineet.hospital.service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vineet.hospital.dto.request.ConsultationRequestDto;
import com.vineet.hospital.dto.response.ConsultationResponseDto;
import com.vineet.hospital.exception.DuplicateResourceException;
import com.vineet.hospital.exception.InvalidRequestException;
import com.vineet.hospital.exception.ResourceNotFoundException;
import com.vineet.hospital.model.Appointment;
import com.vineet.hospital.model.AppointmentStatus;
import com.vineet.hospital.model.Consultation;
import com.vineet.hospital.repository.AppointmentRepository;
import com.vineet.hospital.repository.ConsultationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConsultationServiceImpl implements ConsultationService{
	
	private final AppointmentRepository appointmentRepository;
	
	private final ConsultationRepository consultationRepository;
	
	@Override
	@Transactional(readOnly = true)
	public ConsultationResponseDto getConsultationForDoctor(
	        Long doctorUserId,
	        Long appointmentId) {

	    Appointment appointment = appointmentRepository.findById(appointmentId)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Appointment not found"));

	    if (!appointment.getDoctor().getUser().getId().equals(doctorUserId)) {
	        throw new AccessDeniedException(
	                "You are not authorized to view this consultation");
	    }

	    Consultation consultation = consultationRepository
	            .findByAppointmentId(appointmentId)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Consultation not found"));

	    return toResponseDto(consultation);
	}
	
	@Override
	@Transactional(readOnly = true)
	public ConsultationResponseDto getConsultationForPatient(
	        Long patientUserId,
	        Long appointmentId) {

	    Appointment appointment = appointmentRepository.findById(appointmentId)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Appointment not found"));

	    if (!appointment.getPatient().getUser().getId().equals(patientUserId)) {
	        throw new AccessDeniedException(
	                "You are not authorized to view this consultation");
	    }

	    if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
	        throw new InvalidRequestException(
	                "Consultation is not available for this appointment");
	    }

	    Consultation consultation = consultationRepository
	            .findByAppointmentId(appointmentId)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Consultation not found"));

	    return toResponseDto(consultation);
	}
	
	@Override
	@Transactional
	public ConsultationResponseDto createConsultation(Long doctorUserId, Long appointmentId,
			ConsultationRequestDto request) {
		
		Appointment appointment = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new ResourceNotFoundException("Appoinment not found: " + appointmentId));
		
		//verify this appointment belongs to the doctor
		if(!appointment.getDoctor().getUser().getId().equals(doctorUserId)) {
			throw new AccessDeniedException("You cannot access this appointment");
		}
		
		//prevent duplicate consultations
		if(consultationRepository.existsByAppointmentId(appointmentId)) {
			throw new DuplicateResourceException("Consultation already exists for this appointment");
		}
		
		Consultation consultation = new Consultation(
				appointment,
				request.diagnosis(),
				request.doctorNotes()
			);
		
		Consultation saved = consultationRepository.save(consultation);
		
		appointment.setStatus(AppointmentStatus.COMPLETED);
		
		return toResponseDto(saved);
	}

	@Override
	@Transactional
	public ConsultationResponseDto updateConsultation(Long doctorId, Long consultationId,
			ConsultationRequestDto request) {
		
		Consultation consultation = consultationRepository.findById(consultationId)
				.orElseThrow(() -> new ResourceNotFoundException("Consultation not found: " + consultationId));
		
		if(!consultation.getAppointment().getDoctor().getUser().getId().equals(doctorId)) {
			throw new AccessDeniedException("You cannot update this consultation");
		}
		
		consultation.setDiagnosis(request.diagnosis());
        consultation.setDoctorNotes(request.doctorNotes());
        
        return toResponseDto(consultation);
		
	}
	
	
	
	
	
	private ConsultationResponseDto toResponseDto(Consultation consultation) {
		return new ConsultationResponseDto(
				consultation.getId(), 
				consultation.getAppointment().getId(), 
				consultation.getDiagnosis(), 
				consultation.getDoctorNotes()
			);
	}
}
