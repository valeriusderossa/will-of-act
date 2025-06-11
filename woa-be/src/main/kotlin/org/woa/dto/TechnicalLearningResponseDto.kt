package org.woa.dto

import java.time.LocalDateTime

data class TechnicalLearningResponseDto(
    val id: Long,
    val language: String,
    val subject: String,
    val text: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
