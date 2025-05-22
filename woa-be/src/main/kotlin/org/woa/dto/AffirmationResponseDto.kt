package org.woa.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDateTime

/**
 * Response DTO for affirmation data returned to the client.
 * Includes all relevant fields including system-generated ones.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
data class AffirmationResponseDto(
    val id: Long?,
    override val text: String,

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    val createdAt: LocalDateTime,
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    val updatedAt: LocalDateTime
) : BaseAffirmationDto()
