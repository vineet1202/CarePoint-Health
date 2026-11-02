package com.vineet.hospital.controller;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vineet.hospital.dto.request.AppointmentBookRequestDto;
import com.vineet.hospital.dto.request.AppointmentRescheduleRequestDto;
import com.vineet.hospital.dto.response.AppointmentResponseDto;
import com.vineet.hospital.dto.response.DoctorResponseDto;
import com.vineet.hospital.model.UserPrincipal;
import com.vineet.hospital.service.AppointmentService;
import com.vineet.hospital.service.DoctorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.*;

import com.vineet.hospital.config.openapi.CommonApiResponses;
import com.vineet.hospital.config.openapi.AppointmentConflictResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/appointments")
@Tag(
        name = "Appointments",
        description = "APIs for booking, retrieving, rescheduling and cancelling appointments"
)
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final DoctorService doctorService;

    @Operation(
            summary = "Book an appointment",
            description = "Allows an authenticated patient to book an available doctor slot."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Appointment booked successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request"),
        @ApiResponse(responseCode = "409", description = "Slot is already booked or unavailable")
    })
    @CommonApiResponses
    @AppointmentConflictResponse
    @PreAuthorize("hasRole('PATIENT')")
    @PostMapping
    public ResponseEntity<AppointmentResponseDto> bookAppointment(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AppointmentBookRequestDto request) {

        AppointmentResponseDto booked = appointmentService.bookAppointment(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(booked);
    }

    @Operation(
            summary = "Get appointment details",
            description = "Retrieves an appointment by ID. Access is restricted according to the authenticated user's role and ownership."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Appointment retrieved successfully")
    })
    @CommonApiResponses
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'ADMIN')")
    @GetMapping("/{appointmentId}")
    public ResponseEntity<AppointmentResponseDto> getAppointmentById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long appointmentId) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(appointmentId, principal.getId(), principal.getRole()));
    }

    @Operation(
            summary = "Reschedule an appointment",
            description = "Allows a patient to reschedule an existing appointment to another available slot."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Appointment rescheduled successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid reschedule request"),
        @ApiResponse(responseCode = "409", description = "Requested slot is unavailable or appointment cannot be rescheduled")
    })
    @CommonApiResponses
    @AppointmentConflictResponse
    @PreAuthorize("hasRole('PATIENT')")
    @PutMapping("/{appointmentId}/reschedule")
    public ResponseEntity<AppointmentResponseDto> rescheduleAppointment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long appointmentId,
            @Valid @RequestBody AppointmentRescheduleRequestDto request
    ) {

        return ResponseEntity.ok(appointmentService.rescheduleAppointment(appointmentId, principal.getId(), request));
    }

    @Operation(
            summary = "Cancel an appointment",
            description = "Allows a patient to cancel their existing appointment."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Appointment cancelled successfully"),
        @ApiResponse(responseCode = "400", description = "Appointment cannot be cancelled")
    })
    @CommonApiResponses
    @PreAuthorize("hasRole('PATIENT')")
    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<Void> cancelAppointment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long appointmentId
    ) {

        appointmentService.cancelAppointment(appointmentId, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Get patient appointments",
            description = "Retrieves all appointments belonging to the authenticated patient."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Appointments retrieved successfully")
    })
    @CommonApiResponses
    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/patient")
    public ResponseEntity<List<AppointmentResponseDto>> getPatientAppointments(
            @AuthenticationPrincipal UserPrincipal principal) {

        return ResponseEntity.ok(
                appointmentService.getAppointmentsForPatient(principal.getId())
        );
    }

    @Operation(
            summary = "Get doctor appointments",
            description = "Retrieves appointments assigned to the authenticated doctor. Optionally filters appointments by date."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Appointments retrieved successfully")
    })
    @CommonApiResponses
    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/doctor")
    public ResponseEntity<List<AppointmentResponseDto>> getDoctorAppointments(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false)
            @Parameter(description = "Filter appointments by date", example = "2026-11-05") LocalDate date) {

        DoctorResponseDto doctor
                = doctorService.getDoctorByUserId(principal.getId());

        return ResponseEntity.ok(appointmentService.getAppointmentsForDoctor(doctor.id(), date));
    }
}
