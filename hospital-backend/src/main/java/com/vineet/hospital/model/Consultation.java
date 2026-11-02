package com.vineet.hospital.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "consultations")
public class Consultation {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne(fetch = FetchType.LAZY, optional=false)
	@JoinColumn(name = "appointment_id", nullable=false, unique=true)
	private Appointment appointment;
	
	private String diagnosis;
	
	@Column(length=3000)
	private String doctorNotes;

	public Consultation(Appointment appointment, String diagnosis, String doctorNotes) {
		this.appointment = appointment;
		this.diagnosis = diagnosis;
		this.doctorNotes = doctorNotes;
	}
	
	
	
}
