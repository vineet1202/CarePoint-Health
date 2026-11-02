CREATE TABLE consultations (
    id BIGSERIAL PRIMARY KEY,

    appointment_id BIGINT NOT NULL UNIQUE
        REFERENCES appointments(id),

    diagnosis VARCHAR(1000) NOT NULL,
    doctor_notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);