package com.willofact.dto

import com.willofact.entity.Learning
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

data class LearningRequest(
    @field:NotBlank(message = "Language is required")
    @field:Size(max = 50, message = "Language must not exceed 50 characters")
    val language: String,

    @field:NotBlank(message = "Subject is required")
    @field:Size(max = 200, message = "Subject must not exceed 200 characters")
    val subject: String,

    @field:NotBlank(message = "Text is required")
    @field:Size(max = 5000, message = "Text must not exceed 5000 characters")
    val text: String
)

data class LearningResponse(
    val id: Long,
    val language: String,
    val subject: String,
    val text: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    companion object {
        fun from(learning: Learning): LearningResponse {
            return LearningResponse(
                id = learning.id,
                language = learning.language,
                subject = learning.subject,
                text = learning.text,
                createdAt = learning.createdAt,
                updatedAt = learning.updatedAt
            )
        }
    }
}

data class LearningSummary(
    val id: Long,
    val language: String,
    val subject: String,
    val textPreview: String,
    val createdAt: LocalDateTime
) {
    companion object {
        fun from(learning: Learning): LearningSummary {
            return LearningSummary(
                id = learning.id,
                language = learning.language,
                subject = learning.subject,
                textPreview = if (learning.text.length > 100) 
                    learning.text.substring(0, 100) + "..." 
                else learning.text,
                createdAt = learning.createdAt
            )
        }
    }
}
