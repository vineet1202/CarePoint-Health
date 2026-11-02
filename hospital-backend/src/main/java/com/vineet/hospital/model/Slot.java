package com.vineet.hospital.model;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "slots",
    uniqueConstraints = @UniqueConstraint(
    		name = "uk_doctor_slot_start",
    		columnNames = {"doctor_id", "slot_date", "start_time"}
    )
)
@Getter
@Setter
@NoArgsConstructor
public class Slot extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(nullable = false)
    private LocalDate slotDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlotStatus status;

	public Slot(Doctor doctor, LocalDate slotDate, LocalTime startTime, LocalTime endTime, SlotStatus status) {
		this.doctor = doctor;
		this.slotDate = slotDate;
		this.startTime = startTime;
		this.endTime = endTime;
		this.status = status;
	}
    
    
}
