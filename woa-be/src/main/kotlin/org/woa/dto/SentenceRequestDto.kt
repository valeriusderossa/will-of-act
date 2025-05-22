package org.woa.dto

import com.fasterxml.jackson.annotation.JsonInclude

/**
 * Request DTO for creating or updating sentences.
 * Contains only the fields that can be modified by the client.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
data class SentenceRequestDto(
    override val englishText: String,
    override val polishText: String,
    val pronunciation: String? = null,
    val category: String? = null,
    val difficultyLevel: String? = null
) : BaseSentenceDto()
