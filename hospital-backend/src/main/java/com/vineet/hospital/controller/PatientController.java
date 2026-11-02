package com.vineet.hospital.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vineet.hospital.dto.request.PatientUpdateRequestDto;
import com.vineet.hospital.dto.response.AppointmentResponseDto;
import com.vineet.hospital.dto.response.PatientResponseDto;
import com.vineet.hospital.model.UserPrincipal;
import com.vineet.hospital.service.PatientService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@Tag(name = "Patients", description = "APIs for managing patient profiles and appointments")
public class PatientController {
	
    private final PatientService patientService;

    @Operation(
            summary = "Get patient by ID",
            description = "Retrieves patient details using the patient ID."
        )
        @SecurityRequirement(name = "bearerAuth")
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Patient details retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Patient not found")
        })
    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/{patientId}")
    public ResponseEntity<PatientResponseDto> getPatientById(
    		@Parameter(description = "ID of the patient", example = "1")
    		@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getPatientById(patientId));
    }
    
    @Operation(
            summary = "Get logged-in patient's profile",
            description = "Retrieves the profile of the currently authenticated patient."
        )
        @SecurityRequirement(name = "bearerAuth")
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Patient profile retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Patient profile not found")
        })
    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/my")
    public ResponseEntity<PatientResponseDto> getPatientProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(patientService.getPatientByUserId(principal.getId()));
    }
    
    @Operation(
            summary = "Update patient profile",
            description = "Updates the profile of the currently authenticated patient."
        )
        @SecurityRequirement(name = "bearerAuth")
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Patient profile updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid patient details"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Patient profile not found")
        })
    @PreAuthorize("hasRole('PATIENT')")
    @PutMapping("/my")
    public ResponseEntity<PatientResponseDto> updatePatientProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PatientUpdateRequestDto request) {

        return ResponseEntity.ok(
            patientService.updatePatientProfile(principal.getId(), request)
        );
    }
    
    @Operation(
            summary = "Get patient appointments",
            description = "Retrieves the appointments associated with a patient."
        )
        @SecurityRequirement(name = "bearerAuth")
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Patient appointments retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Patient not found")
        })
    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/{patientId}/appointments")
    public ResponseEntity<List<AppointmentResponseDto>> getPatientAppointments(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getAppointmentsForPatient(patientId));
    }
}