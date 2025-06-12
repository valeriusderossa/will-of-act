package org.woa.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import java.time.Duration
import java.time.LocalDate

@JsonInclude(JsonInclude.Include.NON_NULL)
data class RunningSummaryDto(
    val id: String,
    val distance: Double,
    val time: Duration,
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    val date: LocalDate,
    val averageSpeed: Double // km/h
)
