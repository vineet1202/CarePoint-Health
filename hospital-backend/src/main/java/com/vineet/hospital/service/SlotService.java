package com.vineet.hospital.service;

import java.time.LocalDate;
import java.util.List;

import com.vineet.hospital.dto.request.SlotCreateRequestDto;
import com.vineet.hospital.dto.request.SlotGenerateRequestDto;
import com.vineet.hospital.dto.response.SlotResponseDto;

public interface SlotService {
	
	List<SlotResponseDto> getAvailableSlots(Long doctorId, LocalDate date);
	
	List<SlotResponseDto> getMySlots(Long doctorId, LocalDate date);
	
    SlotResponseDto createSlot(Long doctorId, SlotCreateRequestDto request);
    
    List<SlotResponseDto> generateSlots(Long doctorId, SlotGenerateRequestDto request);
    
    void deleteSlot(Long doctorId, Long slotId);
}
