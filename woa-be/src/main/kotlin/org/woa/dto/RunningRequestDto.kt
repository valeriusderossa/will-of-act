package org.woa.dto

import com.fasterxml.jackson.annotation.JsonInclude
import java.time.Duration
import java.time.LocalDate

@JsonInclude(JsonInclude.Include.NON_NULL)
data class RunningRequestDto(
    override val distance: Double,
    override val time: Duration,
    override val date: LocalDate
) : BaseRunningDto()
