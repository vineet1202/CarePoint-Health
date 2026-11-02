package com.vineet.hospital.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vineet.hospital.dto.request.ConsultationRequestDto;
import com.vineet.hospital.dto.response.ConsultationResponseDto;
import com.vineet.hospital.model.Role;
import com.vineet.hospital.model.UserPrincipal;
import com.vineet.hospital.service.ConsultationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consultations")
@Tag(
	    name = "Consultations",
	    description = "APIs for managing patient consultation records"
	)
	@SecurityRequirement(name = "bearerAuth")
public class ConsultationController {

	private final ConsultationService consultationService;

	@Operation(
	        summary = "Get consultation by appointment",
	        description = """
	            Retrieves consultation details associated with an appointment.
	            Patients can access their own consultations, while doctors can
	            access consultations belonging to their appointments.
	            """
	    )
	    @ApiResponses({
	        @ApiResponse(responseCode = "200",
	            description = "Consultation retrieved successfully"),
	        @ApiResponse(responseCode = "401",
	            description = "Unauthorized",
	            content = @Content(schema = @Schema(hidden = true))),
	        @ApiResponse(responseCode = "403",
	            description = "Access denied",
	            content = @Content(schema = @Schema(hidden = true))),
	        @ApiResponse(responseCode = "404",
	            description = "Appointment or consultation not found",
	            content = @Content(schema = @Schema(hidden = true)))
	    })
	@PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR')")
	@GetMapping("/appointments/{appointmentId}")
	public ResponseEntity<ConsultationResponseDto> getConsultation(
	        @AuthenticationPrincipal UserPrincipal principal,
	        @PathVariable Long appointmentId) {

	    if (principal.getRole() == Role.PATIENT) {
	        return ResponseEntity.ok(
	            consultationService.getConsultationForPatient(
	                principal.getId(), appointmentId
	            )
	        );
	    }

	    return ResponseEntity.ok(
	        consultationService.getConsultationForDoctor(
	            principal.getId(), appointmentId
	        )
	    );
	}
	
	@Operation(
	        summary = "Create consultation",
	        description = """
	            Allows a doctor to create a consultation for an appointment
	            assigned to them. The consultation contains diagnosis and
	            treatment details.
	            """
	    )
	    @ApiResponses({
	        @ApiResponse(responseCode = "201",
	            description = "Consultation created successfully"),
	        @ApiResponse(responseCode = "400",
	            description = "Invalid consultation details",
	            content = @Content(schema = @Schema(hidden = true))),
	        @ApiResponse(responseCode = "403",
	            description = "Doctor is not authorized for this appointment",
	            content = @Content(schema = @Schema(hidden = true))),
	        @ApiResponse(responseCode = "404",
	            description = "Appointment not found",
	            content = @Content(schema = @Schema(hidden = true))),
	        @ApiResponse(responseCode = "409",
	            description = "Consultation already exists or appointment is not eligible",
	            content = @Content(schema = @Schema(hidden = true)))
	    })
	@PreAuthorize("hasRole('DOCTOR')")
    @PostMapping("/appointments/{appointmentId}")
    public ResponseEntity<ConsultationResponseDto> createConsultation(
    		@AuthenticationPrincipal UserPrincipal principal,
    		@PathVariable Long appointmentId,
    		@Valid @RequestBody ConsultationRequestDto request
    		){
    	
    	ConsultationResponseDto consultationResponseDto = consultationService
    			.createConsultation(principal.getId(), appointmentId, request);
    	
    	return ResponseEntity
    			.status(HttpStatus.CREATED)
    			.body(consultationResponseDto);
    }
    

	@Operation(
	        summary = "Update consultation",
	        description = """
	            Allows the doctor responsible for the consultation to update
	            its diagnosis and treatment details.
	            """
	    )
	    @ApiResponses({
	        @ApiResponse(responseCode = "200",
	            description = "Consultation updated successfully"),
	        @ApiResponse(responseCode = "400",
	            description = "Invalid consultation details",
	            content = @Content(schema = @Schema(hidden = true))),
	        @ApiResponse(responseCode = "403",
	            description = "Doctor is not authorized to update this consultation",
	            content = @Content(schema = @Schema(hidden = true))),
	        @ApiResponse(responseCode = "404",
	            description = "Consultation not found",
	            content = @Content(schema = @Schema(hidden = true)))
	    })
    @PreAuthorize("hasRole('DOCTOR')")
    @PutMapping("/{consultationId}")
    public ResponseEntity<ConsultationResponseDto> updateConsultation(
    		@AuthenticationPrincipal UserPrincipal principal,
    		@PathVariable Long consultationId,
    		@Valid @RequestBody ConsultationRequestDto request
    		){
    	
    	ConsultationResponseDto consultationResponseDto = consultationService
    			.updateConsultation(principal.getId(), consultationId, request);
    	
    	return ResponseEntity
    			.status(HttpStatus.OK)
    			.body(consultationResponseDto);
    }
}
