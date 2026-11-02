package com.vineet.hospital.dto.request;

import jakarta.validation.constraints.NotNull;

public record AppointmentRescheduleRequestDto(
	    @NotNull Long newSlotId
	) {}