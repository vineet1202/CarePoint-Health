package com.vineet.hospital.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vineet.hospital.dto.request.SlotCreateRequestDto;
import com.vineet.hospital.dto.request.SlotGenerateRequestDto;
import com.vineet.hospital.dto.response.DoctorResponseDto;
import com.vineet.hospital.dto.response.SlotResponseDto;
import com.vineet.hospital.model.UserPrincipal;
import com.vineet.hospital.service.DoctorService;
import com.vineet.hospital.service.SlotService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/slots")
@Tag(name = "Slots", description = "APIs for managing doctor appointment slots")
public class SlotController {
	
	private final DoctorService doctorService;
	private final SlotService slotService;

	@Operation(
	        summary = "Get available slots",
	        description = "Retrieves all available appointment slots for a doctor on a specified date."
	    )
	    @ApiResponses({
	        @ApiResponse(responseCode = "200", description = "Available slots retrieved successfully"),
	        @ApiResponse(responseCode = "400", description = "Invalid date or request parameters"),
	        @ApiResponse(responseCode = "404", description = "Doctor not found")
	    })
	@GetMapping("/available/{doctorId}")
    public ResponseEntity<List<SlotResponseDto>> getAvailableSlots(
    		@Parameter(description = "ID of the doctor", example = "1")
            @PathVariable Long doctorId,

            @Parameter(description = "Date for which available slots are requested", example = "2026-11-05")
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    		) {
        return ResponseEntity.ok(slotService.getAvailableSlots(doctorId, date));
    }
    
	@Operation(
	        summary = "Get doctor's slots",
	        description = "Retrieves all slots belonging to the currently authenticated doctor for a specified date."
	    )
	    @SecurityRequirement(name = "bearerAuth")
	    @ApiResponses({
	        @ApiResponse(responseCode = "200", description = "Doctor's slots retrieved successfully"),
	        @ApiResponse(responseCode = "401", description = "Unauthorized"),
	        @ApiResponse(responseCode = "403", description = "Access denied")
	    })
    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/my")
    public ResponseEntity<List<SlotResponseDto>> getMySlots(
    		@AuthenticationPrincipal UserPrincipal principal, 
    		@Parameter(description = "Date for which slots are requested", example = "2026-11-05")
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(slotService.getMySlots(principal.getId(), date));
    }
    
	@Operation(
	        summary = "Create an appointment slot",
	        description = "Creates a single appointment slot for the currently authenticated doctor."
	    )
	    @SecurityRequirement(name = "bearerAuth")
	    @ApiResponses({
	        @ApiResponse(responseCode = "201", description = "Slot created successfully"),
	        @ApiResponse(responseCode = "400", description = "Invalid slot details"),
	        @ApiResponse(responseCode = "401", description = "Unauthorized"),
	        @ApiResponse(responseCode = "403", description = "Access denied"),
	        @ApiResponse(responseCode = "409", description = "Slot conflicts with an existing slot")
	    })
    @PreAuthorize("hasRole('DOCTOR')")
    @PostMapping
    public ResponseEntity<SlotResponseDto> createSlot(
    		@AuthenticationPrincipal UserPrincipal principal, 
    		@Valid @RequestBody SlotCreateRequestDto request
    	) {
    	
    	DoctorResponseDto doctor = doctorService.getDoctorByUserId(principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(slotService.createSlot(doctor.id(), request));
    }
 
	@Operation(
	        summary = "Generate appointment slots",
	        description = "Generates multiple appointment slots for the currently authenticated doctor based on the supplied schedule."
	    )
	    @SecurityRequirement(name = "bearerAuth")
	    @ApiResponses({
	        @ApiResponse(responseCode = "201", description = "Slots generated successfully"),
	        @ApiResponse(responseCode = "400", description = "Invalid slot generation details"),
	        @ApiResponse(responseCode = "401", description = "Unauthorized"),
	        @ApiResponse(responseCode = "403", description = "Access denied"),
	        @ApiResponse(responseCode = "409", description = "One or more slots conflict with existing slots")
	    })
    @PreAuthorize("hasRole('DOCTOR')")
    @PostMapping("/generate")
    public ResponseEntity<List<SlotResponseDto>> generateSlots(
    		@AuthenticationPrincipal UserPrincipal principal,
    		@Valid @RequestBody SlotGenerateRequestDto request
    		) {
    	
    	DoctorResponseDto doctor =
    	        doctorService.getDoctorByUserId(principal.getId());
    	
        return ResponseEntity.status(HttpStatus.CREATED).body(slotService.generateSlots(doctor.id(), request));
    }
    
	@Operation(
	        summary = "Delete an appointment slot",
	        description = "Deletes a slot belonging to the currently authenticated doctor."
	    )
	    @SecurityRequirement(name = "bearerAuth")
	    @ApiResponses({
	        @ApiResponse(responseCode = "204", description = "Slot deleted successfully"),
	        @ApiResponse(responseCode = "401", description = "Unauthorized"),
	        @ApiResponse(responseCode = "403", description = "Access denied"),
	        @ApiResponse(responseCode = "404", description = "Slot not found"),
	        @ApiResponse(responseCode = "409", description = "Slot cannot be deleted due to its current state")
	    })
    @PreAuthorize("hasRole('DOCTOR')")
    @DeleteMapping("/{slotId}")
    public ResponseEntity<Void> deleteSlot(
    		@AuthenticationPrincipal UserPrincipal principal, 
    		@Parameter(description = "ID of the slot to delete", example = "15")
            @PathVariable Long slotId
    	) {
    	
    	DoctorResponseDto doctor =
    	        doctorService.getDoctorByUserId(principal.getId());
        
    	slotService.deleteSlot(doctor.id(), slotId);
        
        return ResponseEntity.noContent().build();
    }
}
