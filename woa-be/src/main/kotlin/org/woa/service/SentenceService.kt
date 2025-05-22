package org.woa.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.woa.dto.SentenceRequestDto
import org.woa.dto.SentenceResponseDto
import org.woa.dto.SentenceSummaryDto
import org.woa.entity.Sentence
import org.woa.repository.SentenceRepository
import java.time.LocalDateTime
import java.util.*

@Service
class SentenceService(private val sentenceRepository: SentenceRepository) {

    /**
     * Get all sentences.
     */
    fun getAllSentences(sortBy: String = "createdAt"): List<SentenceResponseDto> {
        val sentences = sentenceRepository.findAll()
        
        // Apply sorting
        val sortedSentences = when (sortBy) {
            "createdAt" -> sentences.sortedByDescending { it.createdAt }
            "createdAtAsc" -> sentences.sortedBy { it.createdAt }
            "viewCount" -> sentences.sortedByDescending { it.viewCount }
            "viewCountAsc" -> sentences.sortedBy { it.viewCount }
            else -> sentences.sortedByDescending { it.createdAt } // Default sort
        }
        
        return sortedSentences.map { it.toResponseDto() }
    }
    
    /**
     * Get all sentence summaries (lighter version for list views).
     */
    fun getAllSentenceSummaries(sortBy: String = "createdAt"): List<SentenceSummaryDto> {
        val sentences = sentenceRepository.findAll()
        
        // Apply sorting
        val sortedSentences = when (sortBy) {
            "createdAt" -> sentences.sortedByDescending { it.createdAt }
            "createdAtAsc" -> sentences.sortedBy { it.createdAt }
            "viewCount" -> sentences.sortedByDescending { it.viewCount }
            "viewCountAsc" -> sentences.sortedBy { it.viewCount }
            else -> sentences.sortedByDescending { it.createdAt } // Default sort
        }
        
        return sortedSentences.map { it.toSummaryDto() }
    }

    /**
     * Get sentence by ID and increment view count.
     */
    @Transactional
    fun getSentenceById(id: Long): SentenceResponseDto {
        val sentence = sentenceRepository.findById(id)
            .orElseThrow { NoSuchElementException("Sentence not found with ID: $id") }
        
        // Increment view count
        val updatedSentence = sentence.copy(
            viewCount = sentence.viewCount + 1
        )
        
        return sentenceRepository.save(updatedSentence).toResponseDto()
    }

    /**
     * Create a new sentence.
     */
    @Transactional
    fun createSentence(requestDto: SentenceRequestDto): SentenceResponseDto {
        val sentence = Sentence(
            englishText = requestDto.englishText,
            polishText = requestDto.polishText,
            pronunciation = requestDto.pronunciation,
            category = requestDto.category,
            difficultyLevel = requestDto.difficultyLevel,
            viewCount = 0
        )
        
        return sentenceRepository.save(sentence).toResponseDto()
    }

    /**
     * Update an existing sentence.
     */
    @Transactional
    fun updateSentence(id: Long, requestDto: SentenceRequestDto): SentenceResponseDto {
        val existingSentence = sentenceRepository.findById(id)
            .orElseThrow { NoSuchElementException("Sentence not found with ID: $id") }
        
        val updatedSentence = existingSentence.copy(
            englishText = requestDto.englishText,
            polishText = requestDto.polishText,
            pronunciation = requestDto.pronunciation,
            category = requestDto.category,
            difficultyLevel = requestDto.difficultyLevel,
            updatedAt = LocalDateTime.now()
        )
        
        return sentenceRepository.save(updatedSentence).toResponseDto()
    }

    /**
     * Delete a sentence by ID.
     */
    @Transactional
    fun deleteSentence(id: Long) {
        if (!sentenceRepository.existsById(id)) {
            throw NoSuchElementException("Sentence not found with ID: $id")
        }
        sentenceRepository.deleteById(id)
    }

    /**
     * Get a random sentence and increment its view count.
     */
    @Transactional
    fun getRandomSentence(): SentenceResponseDto {
        val sentences = sentenceRepository.findAll()
        if (sentences.isEmpty()) {
            throw NoSuchElementException("No sentences found")
        }
        
        val randomSentence = sentences.random()
        
        // Increment view count
        val updatedSentence = randomSentence.copy(
            viewCount = randomSentence.viewCount + 1
        )
        
        return sentenceRepository.save(updatedSentence).toResponseDto()
    }

    /**
     * Get sentences by category.
     */
    fun getSentencesByCategory(category: String): List<SentenceResponseDto> {
        return sentenceRepository.findByCategory(category).map { it.toResponseDto() }
    }

    /**
     * Get sentences by difficulty level.
     */
    fun getSentencesByDifficultyLevel(difficultyLevel: String): List<SentenceResponseDto> {
        return sentenceRepository.findByDifficultyLevel(difficultyLevel).map { it.toResponseDto() }
    }

    /**
     * Get sentences by category and difficulty level.
     */
    fun getSentencesByCategoryAndDifficultyLevel(category: String, difficultyLevel: String): List<SentenceResponseDto> {
        return sentenceRepository.findByCategoryAndDifficultyLevel(category, difficultyLevel).map { it.toResponseDto() }
    }

    /**
     * Search sentences by text in English or Polish.
     */
    fun searchSentences(searchText: String): List<SentenceResponseDto> {
        return sentenceRepository.findByEnglishTextContainingIgnoreCaseOrPolishTextContainingIgnoreCase(
            searchText, searchText
        ).map { it.toResponseDto() }
    }

    /**
     * Extension function to convert Entity to ResponseDto.
     */
    private fun Sentence.toResponseDto(): SentenceResponseDto {
        return SentenceResponseDto(
            id = this.id,
            englishText = this.englishText,
            polishText = this.polishText,
            pronunciation = this.pronunciation,
            viewCount = this.viewCount,
            category = this.category,
            difficultyLevel = this.difficultyLevel,
            createdAt = this.createdAt,
            updatedAt = this.updatedAt
        )
    }
    
    /**
     * Extension function to convert Entity to SummaryDto.
     */
    private fun Sentence.toSummaryDto(): SentenceSummaryDto {
        return SentenceSummaryDto(
            id = this.id,
            englishText = this.englishText,
            polishText = this.polishText,
            category = this.category,
            difficultyLevel = this.difficultyLevel,
            createdAt = this.createdAt
        )
    }
}
