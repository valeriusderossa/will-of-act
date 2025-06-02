package org.woa.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.woa.dto.QuotationRequestDto
import org.woa.dto.QuotationResponseDto
import org.woa.dto.QuotationSummaryDto
import org.woa.service.QuotationService
import java.util.*

@RestController
@RequestMapping("/api/quotations")
class QuotationController(private val quotationService: QuotationService) {

    @GetMapping
    fun getAllQuotations(
        @RequestParam(required = false, defaultValue = "createdAt") sortBy: String
    ): ResponseEntity<List<QuotationResponseDto>> {
        val quotations = quotationService.getAllQuotations(sortBy)
        return ResponseEntity.ok(quotations)
    }

    @GetMapping("/summary")
    fun getAllQuotationsSummary(
        @RequestParam(required = false, defaultValue = "createdAt") sortBy: String
    ): ResponseEntity<List<QuotationSummaryDto>> {
        val quotations = quotationService.getAllQuotationsSummary(sortBy)
        return ResponseEntity.ok(quotations)
    }

    @GetMapping("/{id}")
    fun getQuotationById(@PathVariable id: Long): ResponseEntity<QuotationResponseDto> {
        return try {
            ResponseEntity.ok(quotationService.getQuotationById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping
    fun createQuotation(@RequestBody requestDto: QuotationRequestDto): ResponseEntity<QuotationResponseDto> {
        val createdQuotation = quotationService.createQuotation(requestDto)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdQuotation)
    }

    @PutMapping("/{id}")
    fun updateQuotation(
        @PathVariable id: Long,
        @RequestBody requestDto: QuotationRequestDto
    ): ResponseEntity<QuotationResponseDto> {
        return try {
            val updatedQuotation = quotationService.updateQuotation(id, requestDto)
            ResponseEntity.ok(updatedQuotation)
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteQuotation(@PathVariable id: Long): ResponseEntity<Void> {
        return try {
            quotationService.deleteQuotation(id)
            ResponseEntity.noContent().build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }
}
