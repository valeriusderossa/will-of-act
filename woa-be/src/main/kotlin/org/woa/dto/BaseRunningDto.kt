package org.woa.dto

import java.time.Duration
import java.time.LocalDate

sealed class BaseRunningDto {
    abstract val distance: Double
    abstract val time: Duration
    abstract val date: LocalDate
}
