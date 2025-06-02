package org.woa.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.woa.dto.QuotationRequestDto
import org.woa.dto.QuotationResponseDto
import org.woa.entity.Quotation
import org.woa.repository.QuotationRepository
import java.time.LocalDateTime
import java.util.*

@Service
class QuotationService(private val quotationRepository: QuotationRepository) {

    fun getAllQuotations(): List<QuotationResponseDto> {
        return quotationRepository.findAll().map { it.toResponseDto() }
    }

    @Transactional
    fun getQuotationById(id: Long): QuotationResponseDto {
        val quotation = quotationRepository.findById(id)
            .orElseThrow { NoSuchElementException("Quotation not found with ID: $id") }
        
        return quotation.toResponseDto()
    }

    @Transactional
    fun createQuotation(requestDto: QuotationRequestDto): QuotationResponseDto {
        val quotation = Quotation(
            author = requestDto.author,
            quotation = requestDto.quotation,
            date = requestDto.date
        )
        
        return quotationRepository.save(quotation).toResponseDto()
    }

    @Transactional
    fun updateQuotation(id: Long, requestDto: QuotationRequestDto): QuotationResponseDto {
        val existingQuotation = quotationRepository.findById(id)
            .orElseThrow { NoSuchElementException("Quotation not found with ID: $id") }
        
        val updatedQuotation = existingQuotation.copy(
            author = requestDto.author,
            quotation = requestDto.quotation,
            date = requestDto.date,
            updatedAt = LocalDateTime.now()
        )
        
        return quotationRepository.save(updatedQuotation).toResponseDto()
    }

    @Transactional
    fun deleteQuotation(id: Long) {
        if (!quotationRepository.existsById(id)) {
            throw NoSuchElementException("Quotation not found with ID: $id")
        }
        quotationRepository.deleteById(id)
    }

    private fun Quotation.toResponseDto(): QuotationResponseDto {
        return QuotationResponseDto(
            id = this.id,
            author = this.author,
            quotation = this.quotation,
            date = this.date,
            createdAt = this.createdAt,
            updatedAt = this.updatedAt
        )
    }
}