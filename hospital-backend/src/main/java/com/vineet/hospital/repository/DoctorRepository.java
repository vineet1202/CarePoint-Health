package com.vineet.hospital.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vineet.hospital.model.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecializationIgnoreCase(String specialization);
    Optional<Doctor> findByUserId(Long userId);
    
    @Query("""
    	    SELECT d FROM Doctor d
    	    WHERE LOWER(d.specialization)
    	    LIKE LOWER(CONCAT('%', :keyword, '%'))
    	""")
    	Page<Doctor> searchBySpecialization(
    	        @Param("keyword") String keyword,
    	        Pageable pageable
    	);
}