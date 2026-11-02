package com.vineet.hospital.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SlotGenerateRequestDto(
	    @NotNull LocalDate slotDate,
	    @NotNull LocalTime dayStartTime,
	    @NotNull LocalTime dayEndTime,
	    @NotNull @Min(5) Integer slotDurationMinutes
	) {}
