CREATE INDEX idx_appointment_patient
ON appointments (patient_id);

CREATE INDEX idx_appointment_doctor
ON appointments (doctor_id);

ALTER TABLE slots
ADD CONSTRAINT chk_slot_time
CHECK (end_time > start_time);

ALTER TABLE doctors
ADD CONSTRAINT chk_doctor_experience
CHECK (experience_years IS NULL OR experience_years >= 0);

ALTER TABLE doctors
ADD CONSTRAINT chk_consultation_fee
CHECK (consultation_fee >= 0);

