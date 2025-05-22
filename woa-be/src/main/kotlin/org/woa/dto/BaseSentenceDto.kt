package org.woa.dto

/**
 * Base DTO for sentence data.
 * Contains common fields used across different sentence DTOs.
 */
sealed class BaseSentenceDto {
    abstract val englishText: String
    abstract val polishText: String
}
