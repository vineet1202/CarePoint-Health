package com.vineet.hospital.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vineet.hospital.model.Appointment;
import com.vineet.hospital.model.AppointmentStatus;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
	
    List<Appointment> findByDoctorIdAndSlot_SlotDate(Long doctorId, LocalDate date);
    
    List<Appointment> findByDoctorIdAndSlot_SlotDateAndStatus(Long doctorId, LocalDate date, AppointmentStatus status);
    
    List<Appointment> findByPatientId(Long patientId);
    
    boolean existsBySlotIdAndStatus(Long slotId, AppointmentStatus status);
    
    List<Appointment> findByDoctorId(Long doctorId);
    
    @Query("""
    	    SELECT a
    	    FROM Appointment a
    	    WHERE a.doctor.id = :doctorId
    	      AND a.patient.id = :patientId
    	    ORDER BY a.slot.slotDate DESC, a.slot.startTime DESC
    	""")
    	List<Appointment> findPatientHistoryForDoctor(
    	        @Param("doctorId") Long doctorId,
    	        @Param("patientId") Long patientId
    	);
}
