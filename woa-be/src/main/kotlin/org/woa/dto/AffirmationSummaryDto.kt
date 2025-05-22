package org.woa.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDateTime

/**
 * Summary DTO for affirmation data with minimal information.
 * Used for list views and summary representations.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
data class AffirmationSummaryDto(
    val id: Long?,
    override val text: String,

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    val createdAt: LocalDateTime
) : BaseAffirmationDto()
