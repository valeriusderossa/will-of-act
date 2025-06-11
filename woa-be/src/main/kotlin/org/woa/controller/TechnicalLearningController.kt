package org.woa.controller

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.woa.dto.TechnicalLearningRequestDto
import org.woa.dto.TechnicalLearningResponseDto
import org.woa.dto.TechnicalLearningSummaryDto
import org.woa.service.TechnicalLearningService

@RestController
@RequestMapping("/api/learnings")
class TechnicalLearningController(
    private val technicalLearningService: TechnicalLearningService
) {
    
    /**
     * Get all technical learnings (summary view)
     */
    @GetMapping
    fun getAllTechnicalLearnings(): ResponseEntity<List<TechnicalLearningSummaryDto>> {
        val technicalLearnings = technicalLearningService.getAllTechnicalLearnings()
        return ResponseEntity.ok(technicalLearnings)
    }
    
    /**
     * Get technical learning by ID (full details)
     */
    @GetMapping("/{id}")
    fun getTechnicalLearningById(@PathVariable id: Long): ResponseEntity<TechnicalLearningResponseDto> {
        return try {
            val technicalLearning = technicalLearningService.getTechnicalLearningById(id)
            ResponseEntity.ok(technicalLearning)
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }
    
    /**
     * Create new technical learning
     */
    @PostMapping
    fun createTechnicalLearning(
        @Valid @RequestBody request: TechnicalLearningRequestDto
    ): ResponseEntity<TechnicalLearningResponseDto> {
        val createdTechnicalLearning = technicalLearningService.createTechnicalLearning(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTechnicalLearning)
    }
    
    /**
     * Update existing technical learning
     */
    @PutMapping("/{id}")
    fun updateTechnicalLearning(
        @PathVariable id: Long,
        @Valid @RequestBody request: TechnicalLearningRequestDto
    ): ResponseEntity<TechnicalLearningResponseDto> {
        return try {
            val updatedTechnicalLearning = technicalLearningService.updateTechnicalLearning(id, request)
            ResponseEntity.ok(updatedTechnicalLearning)
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }
    
    /**
     * Delete technical learning
     */
    @DeleteMapping("/{id}")
    fun deleteTechnicalLearning(@PathVariable id: Long): ResponseEntity<Void> {
        return try {
            technicalLearningService.deleteTechnicalLearning(id)
            ResponseEntity.noContent().build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }
    
    /**
     * Search technical learnings by keyword
     */
    @GetMapping("/search")
    fun searchTechnicalLearnings(
        @RequestParam(required = false, defaultValue = "") q: String
    ): ResponseEntity<List<TechnicalLearningSummaryDto>> {
        val results = technicalLearningService.searchTechnicalLearnings(q)
        return ResponseEntity.ok(results)
    }
    
    /**
     * Get technical learnings by language
     */
    @GetMapping("/by-language/{language}")
    fun getTechnicalLearningsByLanguage(@PathVariable language: String): ResponseEntity<List<TechnicalLearningResponseDto>> {
        val technicalLearnings = technicalLearningService.getTechnicalLearningsByLanguage(language)
        return ResponseEntity.ok(technicalLearnings)
    }
    
    /**
     * Get all available languages
     */
    @GetMapping("/languages")
    fun getAllLanguages(): ResponseEntity<List<String>> {
        val languages = technicalLearningService.getAllLanguages()
        return ResponseEntity.ok(languages)
    }
    
    /**
     * Get subjects by language
     */
    @GetMapping("/languages/{language}/subjects")
    fun getSubjectsByLanguage(@PathVariable language: String): ResponseEntity<List<String>> {
        val subjects = technicalLearningService.getSubjectsByLanguage(language)
        return ResponseEntity.ok(subjects)
    }
    
    /**
     * Get statistics about technical learnings
     */
    @GetMapping("/statistics")
    fun getStatistics(): ResponseEntity<Map<String, Any>> {
        val statistics = technicalLearningService.getStatistics()
        return ResponseEntity.ok(statistics)
    }
}
