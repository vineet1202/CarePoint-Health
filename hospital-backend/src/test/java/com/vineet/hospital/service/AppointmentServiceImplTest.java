package com.vineet.hospital.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.vineet.hospital.repository.AppointmentRepository;
import com.vineet.hospital.repository.DoctorRepository;
import com.vineet.hospital.repository.PatientRepository;
import com.vineet.hospital.repository.SlotRepository;

@ExtendWith(MockitoExtension.class)
public class AppointmentServiceImplTest {
	
	@Mock
    private PatientRepository patientRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private SlotRepository slotRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @InjectMocks
    private AppointmentServiceImpl appointmentService;	
    
    @Test
    void bookAppointment_shouldBookAvailableSlot() {
    	
    	
    }
}
