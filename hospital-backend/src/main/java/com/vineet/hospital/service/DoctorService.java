package com.vineet.hospital.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.vineet.hospital.dto.request.ConsultationRequestDto;
import com.vineet.hospital.dto.request.DoctorUpdateRequestDto;
import com.vineet.hospital.dto.response.ConsultationResponseDto;
import com.vineet.hospital.dto.response.DoctorResponseDto;

public interface DoctorService {
	 
	 Page<DoctorResponseDto> searchDoctors(String specialization, Pageable pageable);
	 
	 DoctorResponseDto getDoctorById(Long doctorId);
	 DoctorResponseDto updateDoctorByUserId(Long doctorUserId, DoctorUpdateRequestDto request);
	 void deleteDoctor(Long doctorId);
	 
	 
	
	 //consultation
	
	 
	 //profile
	 DoctorResponseDto getDoctorByUserId(Long id);
	 
	 
	 
}
