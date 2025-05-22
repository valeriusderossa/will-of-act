package org.woa.dto

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class AffirmationRequestDto(
    override val text: String
) : BaseAffirmationDto()
