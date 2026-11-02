package com.vineet.hospital.config.openapi;

import java.lang.annotation.*;

import io.swagger.v3.oas.annotations.responses.*;
import io.swagger.v3.oas.annotations.media.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@ApiResponse(
    responseCode = "409",
    description = "Appointment or slot conflict",
    content = @Content(schema = @Schema(hidden = true))
)
public @interface AppointmentConflictResponse {
}