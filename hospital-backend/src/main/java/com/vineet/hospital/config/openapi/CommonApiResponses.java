
package com.vineet.hospital.config.openapi;

import java.lang.annotation.*;

import io.swagger.v3.oas.annotations.responses.*;
import io.swagger.v3.oas.annotations.media.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@ApiResponses({
    @ApiResponse(responseCode = "401", description = "Unauthorized",
        content = @Content(schema = @Schema(hidden = true))),
    @ApiResponse(responseCode = "403", description = "Forbidden",
        content = @Content(schema = @Schema(hidden = true))),
    @ApiResponse(responseCode = "404", description = "Resource not found",
        content = @Content(schema = @Schema(hidden = true)))
})
public @interface CommonApiResponses {
}