package com.vineet.hospital.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vineet.hospital.model.Slot;
import com.vineet.hospital.model.SlotStatus;

import jakarta.persistence.LockModeType;

public interface SlotRepository extends JpaRepository<Slot, Long> {
	
	List<Slot> findByDoctorIdAndSlotDate(
    		Long doctorId, 
    		LocalDate date
    );

    List<Slot> findByDoctorIdAndSlotDateAndStatus(
    		Long doctorId, 
    		LocalDate date, 
    		SlotStatus status
    );
    
    boolean existsByDoctorIdAndSlotDateAndStartTime(
    		Long doctorId, 
    		LocalDate slotDate, 
    		LocalTime startTime
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Slot s WHERE s.id = :id")
    Optional<Slot> findByIdForUpdate(@Param("id") Long id);
    
    @Query("""
    	    SELECT COUNT(s) > 0
    	    FROM Slot s
    	    WHERE s.doctor.id = :doctorId
    	      AND s.slotDate = :date
    	      AND s.startTime < :endTime
    	      AND s.endTime > :startTime
    	""")
    	boolean existsOverlappingSlot(
    	    @Param("doctorId") Long doctorId,
    	    @Param("date") LocalDate date,
    	    @Param("startTime") LocalTime startTime,
    	    @Param("endTime") LocalTime endTime
    	);

}
