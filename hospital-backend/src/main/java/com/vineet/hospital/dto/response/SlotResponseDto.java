package com.vineet.hospital.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

import com.vineet.hospital.model.SlotStatus;

public record SlotResponseDto(
	    Long id,
	    LocalDate slotDate,
	    LocalTime startTime,
	    LocalTime endTime,
	    SlotStatus status
	) {}
