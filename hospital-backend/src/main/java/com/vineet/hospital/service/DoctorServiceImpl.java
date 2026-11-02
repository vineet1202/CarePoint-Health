package com.vineet.hospital.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.vineet.hospital.dto.request.ConsultationRequestDto;
import com.vineet.hospital.dto.request.DoctorUpdateRequestDto;
import com.vineet.hospital.dto.response.ConsultationResponseDto;
import com.vineet.hospital.dto.response.DoctorResponseDto;
import com.vineet.hospital.exception.DuplicateResourceException;
import com.vineet.hospital.exception.ResourceNotFoundException;
import com.vineet.hospital.model.Appointment;
import com.vineet.hospital.model.AppointmentStatus;
import com.vineet.hospital.model.Consultation;
import com.vineet.hospital.model.Doctor;
import com.vineet.hospital.repository.AppointmentRepository;
import com.vineet.hospital.repository.ConsultationRepository;
import com.vineet.hospital.repository.DoctorRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

	private final DoctorRepository doctorRepository;
	private final AppointmentRepository appointmentRepository;
	private final ConsultationRepository consultationRepository;

	@Override
	public DoctorResponseDto getDoctorByUserId(Long userId) {
		Doctor doctor = doctorRepository.findByUserId(userId)
				.orElseThrow(() -> new ResourceNotFoundException("Profile not found: " + userId));
		return toResponseDto(doctor);
	}
	
	@Override
	public DoctorResponseDto getDoctorById(Long doctorId) {
		Doctor doctor = doctorRepository.findById(doctorId)
				.orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + doctorId));
		return toResponseDto(doctor);
	}
	
	public Page<DoctorResponseDto> searchDoctors(
	        String specialization,
	        Pageable pageable
	) {
	    return doctorRepository.searchBySpecialization(
	            specialization,
	            pageable
	    ).map(this::toResponseDto);
	}

	

	
	@Override
	@Transactional
	public DoctorResponseDto updateDoctorByUserId(Long doctorUserId, DoctorUpdateRequestDto request) {
		Doctor doctor = doctorRepository.findByUserId(doctorUserId)
	            .orElseThrow(() ->
	                new ResourceNotFoundException("Doctor profile not found")
	            );

		if (request.qualification() != null)
			doctor.setQualification(request.qualification());
		if (request.experienceYears() != null)
			doctor.setExperienceYears(request.experienceYears());
		if (request.consultationFee() != null)
			doctor.setConsultationFee(request.consultationFee());

		return toResponseDto(doctor);
	}

	@Override
	@Transactional
	public void deleteDoctor(Long doctorId) {
		if (!doctorRepository.existsById(doctorId)) {
			throw new ResourceNotFoundException("Doctor not found: " + doctorId);
		}
		doctorRepository.deleteById(doctorId);
	}
	
	//-------------------helper methods----------------------------

	private DoctorResponseDto toResponseDto(Doctor d) {
		return new DoctorResponseDto(d.getId(), d.getFullName(), d.getSpecialization(), d.getQualification(),
				d.getExperienceYears(), d.getConsultationFee());
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
