package org.woa.service

import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.woa.dto.TechnicalLearningRequestDto
import org.woa.dto.TechnicalLearningResponseDto
import org.woa.dto.TechnicalLearningSummaryDto
import org.woa.entity.TechnicalLearning
import org.woa.repository.TechnicalLearningRepository
import java.time.LocalDateTime

@Service
@Transactional
class TechnicalLearningService(
    private val technicalLearningRepository: TechnicalLearningRepository
) {
    
    /**
     * Get all technical learnings as summaries
     */
    @Transactional(readOnly = true)
    fun getAllTechnicalLearnings(): List<TechnicalLearningSummaryDto> {
        return technicalLearningRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
            .map { it.toSummaryDto() }
    }
    
    /**
     * Get technical learning by ID with full details
     */
    @Transactional(readOnly = true)
    fun getTechnicalLearningById(id: Long): TechnicalLearningResponseDto {
        val technicalLearning = technicalLearningRepository.findById(id)
            .orElseThrow { NoSuchElementException("Technical learning not found with id: $id") }
        return technicalLearning.toResponseDto()
    }
    
    /**
     * Create new technical learning
     */
    fun createTechnicalLearning(request: TechnicalLearningRequestDto): TechnicalLearningResponseDto {
        val technicalLearning = TechnicalLearning(
            language = request.language.trim(),
            subject = request.subject.trim(),
            text = request.text.trim(),
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )
        
        val savedTechnicalLearning = technicalLearningRepository.save(technicalLearning)
        return savedTechnicalLearning.toResponseDto()
    }
    
    /**
     * Update existing technical learning
     */
    fun updateTechnicalLearning(id: Long, request: TechnicalLearningRequestDto): TechnicalLearningResponseDto {
        val existingTechnicalLearning = technicalLearningRepository.findById(id)
            .orElseThrow { NoSuchElementException("Technical learning not found with id: $id") }
        
        val updatedTechnicalLearning = existingTechnicalLearning.copy(
            language = request.language.trim(),
            subject = request.subject.trim(),
            text = request.text.trim(),
            updatedAt = LocalDateTime.now()
        )
        
        val savedTechnicalLearning = technicalLearningRepository.save(updatedTechnicalLearning)
        return savedTechnicalLearning.toResponseDto()
    }
    
    /**
     * Delete technical learning by ID
     */
    fun deleteTechnicalLearning(id: Long) {
        if (!technicalLearningRepository.existsById(id)) {
            throw NoSuchElementException("Technical learning not found with id: $id")
        }
        technicalLearningRepository.deleteById(id)
    }
    
    /**
     * Search technical learnings by keyword
     */
    @Transactional(readOnly = true)
    fun searchTechnicalLearnings(keyword: String): List<TechnicalLearningSummaryDto> {
        if (keyword.isBlank()) {
            return getAllTechnicalLearnings()
        }
        
        return technicalLearningRepository.searchByKeyword(keyword.trim())
            .map { it.toSummaryDto() }
    }
    
    /**
     * Get technical learnings by language
     */
    @Transactional(readOnly = true)
    fun getTechnicalLearningsByLanguage(language: String): List<TechnicalLearningResponseDto> {
        return technicalLearningRepository.findByLanguageIgnoreCaseOrderByCreatedAtDesc(language)
            .map { it.toResponseDto() }
    }
    
    /**
     * Get all available languages
     */
    @Transactional(readOnly = true)
    fun getAllLanguages(): List<String> {
        return technicalLearningRepository.findAllDistinctLanguages()
    }
    
    /**
     * Get subjects by language
     */
    @Transactional(readOnly = true)
    fun getSubjectsByLanguage(language: String): List<String> {
        return technicalLearningRepository.findDistinctSubjectsByLanguage(language)
    }
    
    /**
     * Get statistics about technical learnings
     */
    @Transactional(readOnly = true)
    fun getStatistics(): Map<String, Any> {
        val totalCount = technicalLearningRepository.count()
        val languages = getAllLanguages()
        val languageStats = languages.associateWith { language ->
            technicalLearningRepository.countByLanguageIgnoreCase(language)
        }
        
        return mapOf(
            "totalCount" to totalCount,
            "languageCount" to languages.size,
            "languageStats" to languageStats
        )
    }
    
    // Extension functions for entity to DTO conversion
    private fun TechnicalLearning.toResponseDto(): TechnicalLearningResponseDto {
        return TechnicalLearningResponseDto(
            id = this.id!!,
            language = this.language,
            subject = this.subject,
            text = this.text,
            createdAt = this.createdAt,
            updatedAt = this.updatedAt
        )
    }
    
    private fun TechnicalLearning.toSummaryDto(): TechnicalLearningSummaryDto {
        val preview = if (this.text.length <= 150) {
            this.text
        } else {
            this.text.substring(0, 150) + "..."
        }
        
        return TechnicalLearningSummaryDto(
            id = this.id!!,
            language = this.language,
            subject = this.subject,
            textPreview = preview,
            createdAt = this.createdAt
        )
    }
}
