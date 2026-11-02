package com.vineet.hospital.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vineet.hospital.config.openapi.CommonApiResponses;
import com.vineet.hospital.dto.request.DoctorUpdateRequestDto;
import com.vineet.hospital.dto.response.AppointmentResponseDto;
import com.vineet.hospital.dto.response.DoctorResponseDto;
import com.vineet.hospital.model.UserPrincipal;
import com.vineet.hospital.service.AppointmentService;
import com.vineet.hospital.service.DoctorService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@Tag(
	    name = "Doctors",
	    description = "APIs for doctor profiles, doctor discovery and patient history"
	)
	@SecurityRequirement(name = "bearerAuth")
public class DoctorController {

    private final DoctorService doctorService;
    
    private final AppointmentService appointmentService;
    
    @Operation(
            summary = "Get my doctor profile",
            description = "Retrieves the profile of the currently authenticated doctor."
        )
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Doctor profile retrieved successfully")
        })
        @CommonApiResponses
    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/my")
    public ResponseEntity<DoctorResponseDto> getDoctorProfile(
    		@AuthenticationPrincipal UserPrincipal principal){
    	return ResponseEntity.ok(doctorService.getDoctorByUserId(principal.getId()));
    }
    
    @Operation(
            summary = "Get doctor by ID",
            description = "Retrieves the public profile details of a doctor using their doctor ID."
        )
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Doctor retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Doctor not found",
                content = @Content(schema = @Schema(hidden = true)))
        })
    @GetMapping("/{doctorId}")
    public ResponseEntity<DoctorResponseDto> getDoctorById(
    		@Parameter(description = "ID of the doctor", example = "12")
            @PathVariable Long doctorId
    		) {
        return ResponseEntity.ok(doctorService.getDoctorById(doctorId));
    }
   
    @Operation(
            summary = "Search doctors",
            description = """
                Retrieves a paginated list of doctors.
                Optionally filters doctors by specialization.
                """
        )
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Doctors retrieved successfully")
        })
    @GetMapping
    public ResponseEntity<Page<DoctorResponseDto>> getDoctors(
            @RequestParam(required = false) String specialization,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(
                doctorService.searchDoctors(specialization, pageable)
        );
    }
    
    @Operation(
    		summary = "Get patient's appointment history for the logged-in doctor",
    		description = "Retrieves a patient's appointment history associated with the currently authenticated doctor."
        )
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Patient history retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Doctor is not authorized to access this patient's history",
                content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(responseCode = "404", description = "Patient not found",
                content = @Content(schema = @Schema(hidden = true)))
        })
        @CommonApiResponses
    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/patients/{patientId}/appointments")
    public ResponseEntity<List<AppointmentResponseDto>> getPatientHistory(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                appointmentService.getPatientHistoryForDoctor(
                        principal.getId(), patientId)
        );
    }
    
    @Operation(
            summary = "Update doctor profile",
            description = "Allows an authenticated doctor to update their own profile information."
        )
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Doctor profile updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid profile details",
                content = @Content(schema = @Schema(hidden = true)))
        })
        @CommonApiResponses
    @PreAuthorize("hasRole('DOCTOR')")
    @PutMapping("/my")
    public ResponseEntity<DoctorResponseDto> updateDoctorProfile(
    		@AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody DoctorUpdateRequestDto request) {
    	
        return ResponseEntity.ok(doctorService.updateDoctorByUserId(principal.getId(), request));
    }
    
    @Operation(
            summary = "Delete doctor",
            description = "Deletes a doctor account using the doctor ID."
        )
        @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Doctor deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Doctor not found",
                content = @Content(schema = @Schema(hidden = true)))
        })
        @CommonApiResponses
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{doctorId}")
    public ResponseEntity<Void> deleteDoctor(
    		@Parameter(description = "ID of the doctor to delete", example = "12")
            @PathVariable Long doctorId
    		) {
        doctorService.deleteDoctor(doctorId);
        return ResponseEntity.noContent().build();
    }
    

}