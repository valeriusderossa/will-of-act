package org.woa.dto

import java.time.LocalDateTime

data class TechnicalLearningSummaryDto(
    val id: Long,
    val language: String,
    val subject: String,
    val textPreview: String,
    val createdAt: LocalDateTime
)
