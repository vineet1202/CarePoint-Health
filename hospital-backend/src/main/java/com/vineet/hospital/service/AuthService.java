package com.vineet.hospital.service;

import com.vineet.hospital.dto.request.DoctorRegisterRequestDto;
import com.vineet.hospital.dto.request.LoginRequestDto;
import com.vineet.hospital.dto.request.PatientRegisterRequestDto;
import com.vineet.hospital.dto.response.AuthResponseDto;

public interface AuthService {

	AuthResponseDto registerPatient(PatientRegisterRequestDto request);
    AuthResponseDto registerDoctor(DoctorRegisterRequestDto request);
    AuthResponseDto login(LoginRequestDto request);
}
