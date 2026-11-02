package com.vineet.hospital.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vineet.hospital.dto.request.PatientUpdateRequestDto;
import com.vineet.hospital.dto.response.AppointmentResponseDto;
import com.vineet.hospital.dto.response.PatientResponseDto;
import com.vineet.hospital.exception.ResourceNotFoundException;
import com.vineet.hospital.model.Appointment;
import com.vineet.hospital.model.Patient;
import com.vineet.hospital.repository.AppointmentRepository;
import com.vineet.hospital.repository.PatientRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public PatientResponseDto getPatientById(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));
        return toResponseDto(patient);
    }
    
    @Override
    public PatientResponseDto getPatientByUserId(Long patientUserId) {
        Patient patient = patientRepository.findByUserId(patientUserId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
        return toResponseDto(patient);
    }

    @Transactional
    public PatientResponseDto updatePatientProfile(
            Long userId,
            PatientUpdateRequestDto request) {

        Patient patient = patientRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        if (request.fullName() != null) {
            patient.setFullName(request.fullName());
        }

        if (request.dateOfBirth() != null) {
            patient.setDateOfBirth(request.dateOfBirth());
        }

        if (request.gender() != null) {
            patient.setGender(request.gender());
        }

        if (request.bloodGroup() != null) {
            patient.setBloodGroup(request.bloodGroup());
        }

        if (request.emergencyContact() != null) {
            patient.setEmergencyContact(request.emergencyContact());
        }

        return toResponseDto(patient);
    }

    @Override
    public List<AppointmentResponseDto> getAppointmentsForPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId).stream()
            .map(this::toAppointmentDto)
            .toList();
    }

    private PatientResponseDto toResponseDto(Patient p) {
        return new PatientResponseDto(p.getId(), p.getFullName(), p.getDateOfBirth(),
            p.getGender(), p.getBloodGroup(), p.getEmergencyContact());
    }

    private AppointmentResponseDto toAppointmentDto(Appointment a) {
        return new AppointmentResponseDto(a.getId(), a.getDoctor().getId(), a.getDoctor().getFullName(),
            a.getPatient().getId(), a.getPatient().getFullName(),
            a.getSlot().getSlotDate(), a.getSlot().getStartTime(), a.getSlot().getEndTime(), a.getStatus());
    }
}
