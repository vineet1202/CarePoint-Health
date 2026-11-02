package com.vineet.hospital.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.vineet.hospital.dto.request.DoctorRegisterRequestDto;
import com.vineet.hospital.dto.request.LoginRequestDto;
import com.vineet.hospital.dto.request.PatientRegisterRequestDto;
import com.vineet.hospital.dto.response.AuthResponseDto;
import com.vineet.hospital.exception.ResourceNotFoundException;
import com.vineet.hospital.model.Doctor;
import com.vineet.hospital.model.Patient;
import com.vineet.hospital.model.Role;
import com.vineet.hospital.model.User;
import com.vineet.hospital.model.UserPrincipal;
import com.vineet.hospital.repository.DoctorRepository;
import com.vineet.hospital.repository.PatientRepository;
import com.vineet.hospital.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
	
	private final UserRepository userRepository;
	private final PatientRepository patientRepository;
	private final DoctorRepository doctorRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	 
	private final JwtService jwtUtil;

    @Override
    @Transactional
    public AuthResponseDto registerPatient(PatientRegisterRequestDto request) {

        User user = userRepository.save(new User(
        		request.email(),
        		passwordEncoder.encode(request.password()),
        		Role.PATIENT
        ));

        patientRepository.save(new Patient(
        	user,
        	request.fullName(),
        	request.dateOfBirth(),
        	request.gender(),
        	request.bloodGroup(),
        	request.emergencyContact()
        ));
          
        return createAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponseDto registerDoctor(DoctorRegisterRequestDto request) {

    	User user = userRepository.save(new User(
        		request.email(),
        		passwordEncoder.encode(request.password()),
        		Role.DOCTOR
        ));

        doctorRepository.save(new Doctor(
        		user,
        		request.fullName(),
        		request.specialization(),
        		request.qualification(),
        		request.experienceYears(),
        		request.consultationFee()
        	));

        return createAuthResponse(user);
    }

    @Override
    public AuthResponseDto login(LoginRequestDto request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.email()));

        return createAuthResponse(user);
    }
    
    public AuthResponseDto createAuthResponse(User user) {
    	String token = jwtUtil.generateToken(new UserPrincipal(user));
    	return new AuthResponseDto(
    			user.getId(), 
    			user.getEmail(), 
    			user.getRole(), 
    			token
    		);
    }

}
