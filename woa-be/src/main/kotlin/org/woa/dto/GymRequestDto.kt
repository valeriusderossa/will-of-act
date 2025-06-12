package org.woa.dto

import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDate

@JsonInclude(JsonInclude.Include.NON_NULL)
data class GymRequestDto(
    override val name: String,
    override val partOfBody: String,
    override val date: LocalDate,
    override val sets: List<SetEntryDto>
) : BaseGymDto()
