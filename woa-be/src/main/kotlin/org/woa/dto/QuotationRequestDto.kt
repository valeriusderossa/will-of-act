package org.woa.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDate

@JsonInclude(JsonInclude.Include.NON_NULL)
data class QuotationRequestDto(
    override val author: String,
    override val quotation: String,
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    override val date: LocalDate
) : BaseQuotationDto()
