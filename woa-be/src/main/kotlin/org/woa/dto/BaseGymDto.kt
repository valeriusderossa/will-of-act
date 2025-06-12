package org.woa.dto

import java.time.LocalDate

sealed class BaseGymDto {
    abstract val name: String
    abstract val partOfBody: String
    abstract val date: LocalDate
    abstract val sets: List<SetEntryDto>
}
