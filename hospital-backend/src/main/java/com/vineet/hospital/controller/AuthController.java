
package com.vineet.hospital.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vineet.hospital.dto.request.DoctorRegisterRequestDto;
import com.vineet.hospital.dto.request.LoginRequestDto;
import com.vineet.hospital.dto.request.PatientRegisterRequestDto;
import com.vineet.hospital.dto.response.AuthResponseDto;
import com.vineet.hospital.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Patient and doctor registration and login APIs")
public class AuthController {

    private final AuthService authService;

    @Operation(
        summary = "Register a new patient",
        description = "Creates a new patient account and returns authentication details."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Patient registered successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid registration details",
            content = @Content(schema = @Schema(hidden = true))),
        @ApiResponse(responseCode = "409", description = "Email already registered",
            content = @Content(schema = @Schema(hidden = true)))
    })
    @PostMapping("/register/patient")
    public ResponseEntity<AuthResponseDto> registerPatient(
            @Valid @RequestBody PatientRegisterRequestDto request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.registerPatient(request));
    }

    @Operation(
        summary = "Register a new doctor",
        description = "Creates a new doctor account and returns authentication details."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Doctor registered successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid registration details",
            content = @Content(schema = @Schema(hidden = true))),
        @ApiResponse(responseCode = "409", description = "Email already registered",
            content = @Content(schema = @Schema(hidden = true)))
    })
    @PostMapping("/register/doctor")
    public ResponseEntity<AuthResponseDto> registerDoctor(
            @Valid @RequestBody DoctorRegisterRequestDto request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.registerDoctor(request));
    }

    @Operation(
        summary = "Login",
        description = "Authenticates a registered patient or doctor and returns a JWT."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "400", description = "Invalid request",
            content = @Content(schema = @Schema(hidden = true))),
        @ApiResponse(responseCode = "401", description = "Invalid email or password",
            content = @Content(schema = @Schema(hidden = true)))
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(
            @Valid @RequestBody LoginRequestDto request) {

        return ResponseEntity.ok(authService.login(request));
    }
}
