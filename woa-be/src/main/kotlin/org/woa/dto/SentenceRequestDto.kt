package org.woa.dto

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class SentenceRequestDto(
    override val englishText: String,
    override val polishText: String,
    val pronunciation: String? = null,
) : BaseSentenceDto()
