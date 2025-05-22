package org.woa.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDateTime

/**
 * Summary DTO for sentence data with minimal information.
 * Used for list views and summary representations.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
data class SentenceSummaryDto(
    val id: Long?,
    override val englishText: String,
    override val polishText: String,

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    val createdAt: LocalDateTime
) : BaseSentenceDto()
