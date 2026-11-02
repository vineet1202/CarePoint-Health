package com.vineet.hospital.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

import com.vineet.hospital.model.AppointmentStatus;

public record AppointmentResponseDto(
	    Long id,
	    Long doctorId,
	    String doctorName,
	    Long patientId,
	    String patientName,
	    LocalDate slotDate,
	    LocalTime startTime,
	    LocalTime endTime,
	    AppointmentStatus status
	) {}
