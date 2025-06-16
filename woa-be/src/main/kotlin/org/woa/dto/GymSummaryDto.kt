package org.woa.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDate

@JsonInclude(JsonInclude.Include.NON_NULL)
data class GymSummaryDto(
    val id: Long?,
    val name: String,
    val partOfBody: String,
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    val date: LocalDate,
    val totalSets: Int,
    val totalReps: Int,
    val maxWeight: Double,
    val avgWeight: Double
)
