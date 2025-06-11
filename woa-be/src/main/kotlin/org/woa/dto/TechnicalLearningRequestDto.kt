package org.woa.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class TechnicalLearningRequestDto(
    @field:NotBlank(message = "Language is required")
    @field:Size(max = 50, message = "Language must not exceed 50 characters")
    val language: String,
    
    @field:NotBlank(message = "Subject is required")
    @field:Size(max = 100, message = "Subject must not exceed 100 characters")
    val subject: String,
    
    @field:NotBlank(message = "Text is required")
    @field:Size(max = 10000, message = "Text must not exceed 10000 characters")
    val text: String
)
