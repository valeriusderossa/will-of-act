package org.woa.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDateTime

/**
 * Response DTO for sentence data returned to the client.
 * Includes all relevant fields including system-generated ones.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
data class SentenceResponseDto(
    val id: Long?,
    override val englishText: String,
    override val polishText: String,
    val pronunciation: String?,

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    val createdAt: LocalDateTime,
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    val updatedAt: LocalDateTime
) : BaseSentenceDto()
