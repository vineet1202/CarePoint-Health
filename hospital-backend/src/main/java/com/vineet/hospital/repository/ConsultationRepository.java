package com.vineet.hospital.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vineet.hospital.model.Consultation;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
	
	List<Consultation> findByAppointmentPatientId(Long patientId);
	
	Boolean existsByAppointmentId(Long appointmentId);

	Optional<Consultation> findByAppointmentId(Long appointmentId);
}
