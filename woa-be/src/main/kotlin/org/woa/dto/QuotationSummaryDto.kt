package org.woa.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDate

@JsonInclude(JsonInclude.Include.NON_NULL)
data class QuotationSummaryDto(
    val id: Long?,
    override val author: String,
    val quotationPreview: String, // First 100 characters of quotation
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    override val date: LocalDate,
    
    // Required by sealed class but not used in summary
    override val quotation: String = ""
) : BaseQuotationDto()
