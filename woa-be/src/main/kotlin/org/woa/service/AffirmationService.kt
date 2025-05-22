package org.woa.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.woa.dto.AffirmationRequestDto
import org.woa.dto.AffirmationResponseDto
import org.woa.dto.AffirmationSummaryDto
import org.woa.entity.Affirmation
import org.woa.repository.AffirmationRepository
import java.time.LocalDateTime
import java.util.*

@Service
class AffirmationService(private val affirmationRepository: AffirmationRepository) {

    /**
     * Get all affirmations.
     */
    fun getAllAffirmations(sortBy: String = "createdAt"): List<AffirmationResponseDto> {
        val affirmations = affirmationRepository.findAll()
        
        // Apply sorting
        val sortedAffirmations = when (sortBy) {
            "createdAt" -> affirmations.sortedByDescending { it.createdAt }
            "createdAtAsc" -> affirmations.sortedBy { it.createdAt }
            "viewCount" -> affirmations.sortedByDescending { it.viewCount }
            "viewCountAsc" -> affirmations.sortedBy { it.viewCount }
            else -> affirmations.sortedByDescending { it.createdAt } // Default sort
        }
        
        return sortedAffirmations.map { it.toResponseDto() }
    }
    
    /**
     * Get all affirmation summaries (lighter version for list views).
     */
    fun getAllAffirmationSummaries(sortBy: String = "createdAt"): List<AffirmationSummaryDto> {
        val affirmations = affirmationRepository.findAll()
        
        // Apply sorting
        val sortedAffirmations = when (sortBy) {
            "createdAt" -> affirmations.sortedByDescending { it.createdAt }
            "createdAtAsc" -> affirmations.sortedBy { it.createdAt }
            "viewCount" -> affirmations.sortedByDescending { it.viewCount }
            "viewCountAsc" -> affirmations.sortedBy { it.viewCount }
            else -> affirmations.sortedByDescending { it.createdAt } // Default sort
        }
        
        return sortedAffirmations.map { it.toSummaryDto() }
    }

    /**
     * Get affirmation by ID and increment view count.
     */
    @Transactional
    fun getAffirmationById(id: Long): AffirmationResponseDto {
        val affirmation = affirmationRepository.findById(id)
            .orElseThrow { NoSuchElementException("Affirmation not found with ID: $id") }
        
        // Increment view count
        val updatedAffirmation = affirmation.copy(
            viewCount = affirmation.viewCount + 1
        )
        
        return affirmationRepository.save(updatedAffirmation).toResponseDto()
    }

    /**
     * Create a new affirmation.
     */
    @Transactional
    fun createAffirmation(requestDto: AffirmationRequestDto): AffirmationResponseDto {
        val affirmation = Affirmation(
            text = requestDto.text,
            viewCount = 0
        )
        
        return affirmationRepository.save(affirmation).toResponseDto()
    }

    /**
     * Update an existing affirmation.
     */
    @Transactional
    fun updateAffirmation(id: Long, requestDto: AffirmationRequestDto): AffirmationResponseDto {
        val existingAffirmation = affirmationRepository.findById(id)
            .orElseThrow { NoSuchElementException("Affirmation not found with ID: $id") }
        
        val updatedAffirmation = existingAffirmation.copy(
            text = requestDto.text,
            updatedAt = LocalDateTime.now()
        )
        
        return affirmationRepository.save(updatedAffirmation).toResponseDto()
    }

    /**
     * Delete an affirmation by ID.
     */
    @Transactional
    fun deleteAffirmation(id: Long) {
        if (!affirmationRepository.existsById(id)) {
            throw NoSuchElementException("Affirmation not found with ID: $id")
        }
        affirmationRepository.deleteById(id)
    }

    /**
     * Get a random affirmation and increment its view count.
     */
    @Transactional
    fun getRandomAffirmation(): AffirmationResponseDto {
        val affirmations = affirmationRepository.findAll()
        if (affirmations.isEmpty()) {
            throw NoSuchElementException("No affirmations found")
        }
        
        val randomAffirmation = affirmations.random()
        
        // Increment view count
        val updatedAffirmation = randomAffirmation.copy(
            viewCount = randomAffirmation.viewCount + 1
        )
        
        return affirmationRepository.save(updatedAffirmation).toResponseDto()
    }

    /**
     * Get affirmations sorted by view count (most viewed first).
     */
    fun getMostViewedAffirmations(limit: Int = 10): List<AffirmationResponseDto> {
        return affirmationRepository.findAll()
            .sortedByDescending { it.viewCount }
            .take(limit)
            .map { it.toResponseDto() }
    }

    /**
     * Extension function to convert Entity to ResponseDto.
     */
    private fun Affirmation.toResponseDto(): AffirmationResponseDto {
        return AffirmationResponseDto(
            id = this.id,
            text = this.text,
            viewCount = this.viewCount,
            createdAt = this.createdAt,
            updatedAt = this.updatedAt
        )
    }
    
    /**
     * Extension function to convert Entity to SummaryDto.
     */
    private fun Affirmation.toSummaryDto(): AffirmationSummaryDto {
        return AffirmationSummaryDto(
            id = this.id,
            text = this.text,
            viewCount = this.viewCount,
            createdAt = this.createdAt
        )
    }
}
