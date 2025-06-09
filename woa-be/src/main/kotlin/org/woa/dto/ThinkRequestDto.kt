package org.woa.dto

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ThinkRequestDto(
    override val text: String
) : BaseThinkDto()
