package org.woa.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDate

@JsonInclude(JsonInclude.Include.NON_NULL)
data class GymResponseDto(
    val id: Long,
    override val name: String,
    override val partOfBody: String,
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    override val date: LocalDate,
    override val sets: List<SetEntryDto>
) : BaseGymDto()
