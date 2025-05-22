package org.woa.dto

/**
 * Base DTO for affirmation data.
 * Contains common fields used across different affirmation DTOs.
 */
sealed class BaseAffirmationDto {
    abstract val text: String
}
