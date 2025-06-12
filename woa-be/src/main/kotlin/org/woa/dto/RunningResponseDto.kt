package org.woa.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import java.time.Duration
import java.time.LocalDate

@JsonInclude(JsonInclude.Include.NON_NULL)
data class RunningResponseDto(
    val id: String,
    override val distance: Double,
    override val time: Duration,
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    override val date: LocalDate
) : BaseRunningDto()
