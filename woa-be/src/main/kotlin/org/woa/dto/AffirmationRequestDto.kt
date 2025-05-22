package org.woa.dto

import com.fasterxml.jackson.annotation.JsonInclude

/**
 * Request DTO for creating or updating affirmations.
 * Contains only the fields that can be modified by the client.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
data class AffirmationRequestDto(
    override val text: String
) : BaseAffirmationDto()
