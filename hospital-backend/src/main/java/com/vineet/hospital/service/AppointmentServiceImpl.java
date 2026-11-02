package com.vineet.hospital.service;


import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vineet.hospital.dto.request.AppointmentBookRequestDto;
import com.vineet.hospital.dto.request.AppointmentRescheduleRequestDto;
import com.vineet.hospital.dto.response.AppointmentResponseDto;
import com.vineet.hospital.exception.InvalidRequestException;
import com.vineet.hospital.exception.ResourceNotFoundException;
import com.vineet.hospital.exception.SlotNotAvailableException;
import com.vineet.hospital.model.Appointment;
import com.vineet.hospital.model.AppointmentStatus;
import com.vineet.hospital.model.Doctor;
import com.vineet.hospital.model.Patient;
import com.vineet.hospital.model.Role;
import com.vineet.hospital.model.Slot;
import com.vineet.hospital.model.SlotStatus;
import com.vineet.hospital.model.User;
import com.vineet.hospital.repository.AppointmentRepository;
import com.vineet.hospital.repository.DoctorRepository;
import com.vineet.hospital.repository.PatientRepository;
import com.vineet.hospital.repository.SlotRepository;
import com.vineet.hospital.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

	private final AppointmentRepository appointmentRepository;    
	private final SlotRepository slotRepository;
	private final DoctorRepository doctorRepository;
	private final PatientRepository patientRepository;

    @Override
    @Transactional
    public AppointmentResponseDto bookAppointment(Long patientUserId, AppointmentBookRequestDto request) {
    	
    	Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientUserId));
        
    	Slot slot = slotRepository.findByIdForUpdate(request.slotId())
            .orElseThrow(() -> new ResourceNotFoundException("Slot not found: " + request.slotId()));

        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            throw new SlotNotAvailableException("Slot " + request.slotId() + " is no longer available");
        }

        Doctor doctor = slot.getDoctor();
        Appointment appointment = new Appointment(
        	    patient,
        	    doctor,
        	    slot,
        	    AppointmentStatus.BOOKED,
        	    ""
        	);

        appointmentRepository.save(appointment);
        slot.setStatus(SlotStatus.BOOKED);
        
        return toResponseDto(appointment);
    }

    @Override
    @Transactional(readOnly=true)
    public AppointmentResponseDto getAppointmentById(Long appointmentId, Long userId, Role role) {
    	
    	Appointment appointment = appointmentRepository.findById(appointmentId)
    			.orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id : " + appointmentId));
    	
    	if(role != Role.ADMIN && !appointment.getDoctor().getUser().getId().equals(userId) 
    			&& !appointment.getPatient().getUser().getId().equals(userId)
    		) {
    		throw new InvalidRequestException("You are not authorized to view this appointment");
    	}
        
        return toResponseDto(appointment);
    }
    
    @Override
    @Transactional
	public List<AppointmentResponseDto> getAppointmentsForPatient(Long patientUserId) {
    	
    	Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found: " + patientUserId));

    	List<Appointment> appointments = appointmentRepository.findByPatientId(patient.getId());
    	
		return appointments.stream().map(this::toResponseDto).toList();
	}

    @Override
    @Transactional
    public AppointmentResponseDto rescheduleAppointment(
    		Long appointmentId, 
    		Long patientUserId,
    		AppointmentRescheduleRequestDto request
    	) {
    	
    	Appointment appointment = appointmentRepository.findById(appointmentId)
    			.orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id : " + appointmentId));
    	
    	//verify if patient owns the appointment
    	if(!appointment.getPatient().getUser().getId().equals(patientUserId)) {
    		throw new InvalidRequestException("You are not authorized to reschedule this appointment");
    	}
    	
    	//only reschedule a booked appointment
    	if(appointment.getStatus() != AppointmentStatus.BOOKED) {
    		throw new InvalidRequestException("This appointment is cancelled");
    	}
    	
    	Long oldSlotId = appointment.getSlot().getId();
        Long newSlotId = request.newSlotId();
        
        if (oldSlotId.equals(newSlotId)) {
            throw new InvalidRequestException(
                    "The new slot must be different from the current slot");
        }
        
        Slot firstSlot = slotRepository.findByIdForUpdate(
                Math.min(oldSlotId, newSlotId))
        .orElseThrow(() ->
                new ResourceNotFoundException("Slot not found"));

        Slot secondSlot = slotRepository.findByIdForUpdate(
                Math.max(oldSlotId, newSlotId))
        .orElseThrow(() ->
                new ResourceNotFoundException("Slot not found"));
        
        Slot oldSlot = oldSlotId < newSlotId ? firstSlot : secondSlot;
        Slot newSlot = oldSlotId < newSlotId ? secondSlot : firstSlot;

        if (newSlot.getStatus() != SlotStatus.AVAILABLE) {
            throw new SlotNotAvailableException("Slot " + request.newSlotId() + " is no longer available");
        }
        if (!newSlot.getDoctor().getId().equals(oldSlot.getDoctor().getId())) {
            throw new InvalidRequestException("Rescheduling must stay with the same doctor");
        }

        oldSlot.setStatus(SlotStatus.AVAILABLE);
        newSlot.setStatus(SlotStatus.BOOKED);
        appointment.setSlot(newSlot);

        return toResponseDto(appointment);
    }
    
    @Override
    @Transactional
    public void cancelAppointment(Long appointmentId, Long patientUserId) {
    	
        Appointment appointment = findAppointmentOrThrow(appointmentId);
        
        //verify if patient owns the appointment
    	if(!appointment.getPatient().getUser().getId().equals(patientUserId)) {
    		throw new InvalidRequestException("You are not authorized to cancel this appointment");
    	}
    	
    	if (appointment.getStatus() != AppointmentStatus.BOOKED) {
            throw new InvalidRequestException(
                    "Only booked appointments can be cancelled");
        }
        
    	appointment.setStatus(AppointmentStatus.CANCELLED);
    	appointment.getSlot().setStatus(SlotStatus.AVAILABLE);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getAppointmentsForDoctor(Long doctorId, LocalDate date) {
    	
    	if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException(
                    "Doctor not found: " + doctorId);
        }
    	
    	List<Appointment> appointments;
    	
    	if (date == null) {
    		appointments = appointmentRepository.findByDoctorId(doctorId);
    	}
    	else {
    		appointments = appointmentRepository
            		.findByDoctorIdAndSlot_SlotDateAndStatus(doctorId, date, AppointmentStatus.BOOKED);
    	}
    	
        return appointments
        		.stream()
        		.map(this::toResponseDto)
        		.toList();
    }
    
    
    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getPatientHistoryForDoctor(
            Long doctorUserId,
            Long patientId) {

        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient not found");
        }

        List<Appointment> appointments =
                appointmentRepository.findPatientHistoryForDoctor(
                        doctor.getId(), patientId);

        return appointments.stream()
                .map(this::toResponseDto)
                .toList();
    }
    
    
    

    private Appointment findAppointmentOrThrow(Long id) {
        return appointmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));
    }

    private AppointmentResponseDto toResponseDto(Appointment appointment) {
        return new AppointmentResponseDto(
        	appointment.getId(), 
        	appointment.getDoctor().getId(), 
        	appointment.getDoctor().getFullName(),
            appointment.getPatient().getId(), 
            appointment.getPatient().getFullName(),
            appointment.getSlot().getSlotDate(), 
            appointment.getSlot().getStartTime(), 
            appointment.getSlot().getEndTime(), 
            appointment.getStatus()
        );
    }

	
}