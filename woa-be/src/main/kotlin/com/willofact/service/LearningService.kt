package com.willofact.service

import com.willofact.dto.LearningRequest
import com.willofact.dto.LearningResponse
import com.willofact.entity.Learning
import com.willofact.exception.ResourceNotFoundException
import com.willofact.repository.LearningRepository
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class LearningService(
    private val learningRepository: LearningRepository
) {
    private val logger = LoggerFactory.getLogger(LearningService::class.java)

    fun getAllLearnings(): List<LearningResponse> {
        logger.info("Fetching all learnings")
        return learningRepository.findAllOrderByCreatedAtDesc()
            .map { LearningResponse.from(it) }
    }

    fun getLearningById(id: Long): LearningResponse {
        logger.info("Fetching learning by id: {}", id)
        val learning = learningRepository.findByIdOrNull(id)
            ?: throw ResourceNotFoundException("Learning not found with id: $id")
        return LearningResponse.from(learning)
    }

    fun createLearning(request: LearningRequest): LearningResponse {
        logger.info("Creating new learning for language: {}, subject: {}", request.language, request.subject)
        
        val learning = Learning(
            language = request.language.trim(),
            subject = request.subject.trim(),
            text = request.text.trim()
        )
        
        val savedLearning = learningRepository.save(learning)
        logger.info("Learning created successfully with id: {}", savedLearning.id)
        
        return LearningResponse.from(savedLearning)
    }

    fun updateLearning(id: Long, request: LearningRequest): LearningResponse {
        logger.info("Updating learning with id: {}", id)
        
        val existingLearning = learningRepository.findByIdOrNull(id)
            ?: throw ResourceNotFoundException("Learning not found with id: $id")

        val updatedLearning = existingLearning.copy(
            language = request.language.trim(),
            subject = request.subject.trim(),
            text = request.text.trim()
        )

        val savedLearning = learningRepository.save(updatedLearning)
        logger.info("Learning updated successfully with id: {}", savedLearning.id)
        
        return LearningResponse.from(savedLearning)
    }

    fun deleteLearning(id: Long) {
        logger.info("Deleting learning with id: {}", id)
        
        if (!learningRepository.existsById(id)) {
            throw ResourceNotFoundException("Learning not found with id: $id")
        }
        
        learningRepository.deleteById(id)
        logger.info("Learning deleted successfully with id: {}", id)
    }

    @Transactional(readOnly = true)
    fun getLearningsByLanguage(language: String): List<LearningResponse> {
        logger.info("Fetching learnings by language: {}", language)
        return learningRepository.findByLanguageOrderByCreatedAtDesc(language)
            .map { LearningResponse.from(it) }
    }

    @Transactional(readOnly = true)
    fun searchLearnings(query: String): List<LearningResponse> {
        logger.info("Searching learnings with query: {}", query)
        
        if (query.isBlank()) {
            return getAllLearnings()
        }
        
        return learningRepository.searchLearnings(query.trim())
            .map { LearningResponse.from(it) }
    }

    @Transactional(readOnly = true)
    fun getDistinctLanguages(): List<String> {
        logger.info("Fetching distinct languages")
        return learningRepository.findDistinctLanguages()
    }

    @Transactional(readOnly = true)
    fun getLanguageStats(): Map<String, Long> {
        logger.info("Fetching language statistics")
        val languages = learningRepository.findDistinctLanguages()
        return languages.associateWith { language ->
            learningRepository.countByLanguage(language)
        }
    }

    @Transactional(readOnly = true)
    fun getRecentLearnings(limit: Int = 10): List<LearningResponse> {
        logger.info("Fetching recent learnings with limit: {}", limit)
        return learningRepository.findAllOrderByCreatedAtDesc()
            .take(limit)
            .map { LearningResponse.from(it) }
    }
}
