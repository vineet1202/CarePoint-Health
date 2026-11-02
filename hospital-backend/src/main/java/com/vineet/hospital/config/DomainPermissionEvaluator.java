package com.vineet.hospital.config;

import java.io.Serializable;

import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.vineet.hospital.model.Role;
import com.vineet.hospital.model.User;
import com.vineet.hospital.model.UserPrincipal;
import com.vineet.hospital.repository.AppointmentRepository;
import com.vineet.hospital.repository.DoctorRepository;
import com.vineet.hospital.repository.PatientRepository;
import com.vineet.hospital.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
public class DomainPermissionEvaluator implements PermissionEvaluator {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    
    public DomainPermissionEvaluator(PatientRepository patientRepository, DoctorRepository doctorRepository,
			AppointmentRepository appointmentRepository, UserRepository userRepository) {
		this.patientRepository = patientRepository;
		this.doctorRepository = doctorRepository;
		this.appointmentRepository = appointmentRepository;
		this.userRepository = userRepository;
	}

	@Override
    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        return false;
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        if (!(authentication.getPrincipal() instanceof UserPrincipal principal)) return false;

        Long userId = principal.getId();
        Long id = Long.valueOf(targetId.toString());
        String perm = permission.toString();

        User requester = userRepository.findById(userId).orElse(null);
        if (requester != null && requester.getRole() == Role.ADMIN) return true;

        return switch (targetType) {
            case "Patient" -> patientRepository.findById(id)
                .map(p -> p.getUser().getId().equals(userId))
                .orElse(false);

            case "Doctor" -> doctorRepository.findById(id)
                .map(d -> d.getUser().getId().equals(userId))
                .orElse(false);

            case "Appointment" -> appointmentRepository.findById(id)
                .map(a -> {
                    boolean isPatient = a.getPatient().getUser().getId().equals(userId);
                    boolean isDoctor = a.getDoctor().getUser().getId().equals(userId);
                    return switch (perm) {
                        case "RESCHEDULE" -> isPatient;
                        default -> isPatient || isDoctor;
                    };
                })
                .orElse(false);

            default -> false;
        };
    }
}