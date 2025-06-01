package org.woa.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.woa.entity.Quotation
import java.time.LocalDate

@Repository
interface QuotationRepository : JpaRepository<Quotation, Long> {
    
    fun findByAuthorContainingIgnoreCaseOrQuotationContainingIgnoreCase(
        author: String, 
        quotation: String
    ): List<Quotation>
    
    fun findByAuthorIgnoreCase(author: String): List<Quotation>
    
    fun findByDateBetween(startDate: LocalDate, endDate: LocalDate): List<Quotation>
    
    fun findByDate(date: LocalDate): List<Quotation>
}
