package com.vineet.hospital.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;

public record SlotCreateRequestDto(
	    @NotNull LocalDate slotDate,
	    @NotNull LocalTime startTime,
	    @NotNull LocalTime endTime
	) {}
