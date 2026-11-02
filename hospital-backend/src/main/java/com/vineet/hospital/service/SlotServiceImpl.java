package com.vineet.hospital.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.vineet.hospital.dto.request.SlotCreateRequestDto;
import com.vineet.hospital.dto.request.SlotGenerateRequestDto;
import com.vineet.hospital.dto.response.SlotResponseDto;
import com.vineet.hospital.exception.DuplicateResourceException;
import com.vineet.hospital.exception.InvalidRequestException;
import com.vineet.hospital.exception.ResourceNotFoundException;
import com.vineet.hospital.model.Doctor;
import com.vineet.hospital.model.Slot;
import com.vineet.hospital.model.SlotStatus;
import com.vineet.hospital.repository.DoctorRepository;
import com.vineet.hospital.repository.SlotRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SlotServiceImpl implements SlotService {

    private final SlotRepository slotRepository;
    private final DoctorRepository doctorRepository;
    
    @Override
	public List<SlotResponseDto> getAvailableSlots(Long doctorId, LocalDate date) {
		if (!doctorRepository.existsById(doctorId)) {
			throw new ResourceNotFoundException("Doctor not found: " + doctorId);
		}
		return slotRepository.findByDoctorIdAndSlotDateAndStatus(doctorId, date, SlotStatus.AVAILABLE).stream()
				.map(this::toDto).toList();
	}
	
	@Override
	public List<SlotResponseDto> getMySlots(Long doctorUserId, LocalDate date) {
		
		Doctor doctor = doctorRepository.findByUserId(doctorUserId)
				.orElseThrow(() -> new ResourceNotFoundException(
						"Doctor not found:" + doctorUserId
						));
		
		List<Slot> slots = slotRepository.findByDoctorIdAndSlotDate(doctor.getId(), date); 
		
		return slots.stream().map(this::toDto).toList();
		
	}
	
    @Override
    @Transactional
    public SlotResponseDto createSlot(Long doctorId, SlotCreateRequestDto request) {
    	Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + doctorId));

    	validateSlotDate(request.slotDate());
    	
    	if (!request.endTime().isAfter(request.startTime())) {
    	    throw new InvalidRequestException(
    	        "End time must be after start time"
    	    );
    	}
    	
    	if (slotRepository.existsOverlappingSlot(
    	        doctorId,
    	        request.slotDate(),
    	        request.startTime(),
    	        request.endTime())) {
    	    throw new DuplicateResourceException(
    	        "This slot overlaps with an existing slot"
    	    );
    	}
    	
        Slot slot = new Slot(
        		doctor,
        		request.slotDate(),
        		request.startTime(),
        		request.endTime(),
        		SlotStatus.AVAILABLE
        	);

        return toDto(slotRepository.save(slot));
    }

    @Override
    @Transactional
    public List<SlotResponseDto> generateSlots(Long doctorId, SlotGenerateRequestDto request) {
    	Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + doctorId));
        
    	validateSlotDate(request.slotDate());
    	
    	LocalTime cursor = request.dayStartTime();
    	
        if (request.slotDurationMinutes() <= 0) {
            throw new InvalidRequestException(
                "Slot duration must be greater than zero"
            );
        }

        if (!request.dayEndTime().isAfter(request.dayStartTime())) {
            throw new InvalidRequestException(
                "Day end time must be after day start time"
            );
        }
        
        List<Slot> existingSlots =
        	    slotRepository.findByDoctorIdAndSlotDate(
        	        doctorId, request.slotDate()
        	    );
        
        List<Slot> generated = new ArrayList<>();
        

        while (!cursor.plusMinutes(request.slotDurationMinutes())
                .isAfter(request.dayEndTime())) {
        	
        	LocalTime slotStart = cursor;
        	LocalTime slotEnd =
                    cursor.plusMinutes(request.slotDurationMinutes());
            
            // Check overlap with existing slots, regardless of status.
        	boolean overlapsExisting = existingSlots
        			.stream().
        			anyMatch(
	        			slot ->
			            	slotStart.isBefore(slot.getEndTime())
			                && slotEnd.isAfter(slot.getStartTime())
        			);
        	
            if (overlapsExisting) {
                throw new DuplicateResourceException(
                    "Generated slot overlaps with an existing slot: "
                        + cursor + " - " + slotEnd);
            }

            generated.add(new Slot(
                doctor,
                request.slotDate(),
                cursor,
                slotEnd,
                SlotStatus.AVAILABLE
            ));

            cursor = slotEnd;
        
        }

        return slotRepository.saveAll(generated)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional
    public void deleteSlot(Long doctorId, Long slotId) {
    	if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor not found: " + doctorId);
        }

        Slot slot = slotRepository.findByIdForUpdate(slotId)
            .orElseThrow(() -> new ResourceNotFoundException("Slot not found: " + slotId));
        
        if(!slot.getDoctor().getId().equals(doctorId)) {
        	throw new AccessDeniedException(
        			"You cannot delete another doctor's slot"
        	);
        }

        if (slot.getStatus() == SlotStatus.BOOKED) {
            throw new InvalidRequestException("Cannot delete a booked slot");
        }

        slotRepository.delete(slot);
    }

    private SlotResponseDto toDto(Slot s) {
        return new SlotResponseDto(s.getId(), s.getSlotDate(), s.getStartTime(), s.getEndTime(), s.getStatus());
    }
    
    private void validateSlotDate(LocalDate date) {
        if (date == null || !date.isAfter(LocalDate.now())) {
            throw new InvalidRequestException(
                "Slots can only be created for tomorrow onwards"
            );
        }
    }
  
}
