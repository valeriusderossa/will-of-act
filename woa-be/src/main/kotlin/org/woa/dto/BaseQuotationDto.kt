package org.woa.dto

import java.time.LocalDate

sealed class BaseQuotationDto {
    abstract val author: String
    abstract val quotation: String
    abstract val date: LocalDate
}
