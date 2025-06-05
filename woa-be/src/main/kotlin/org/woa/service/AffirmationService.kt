package org.woa.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.woa.dto.AffirmationRequestDto
import org.woa.dto.AffirmationResponseDto
import org.woa.entity.Affirmation
import org.woa.repository.AffirmationRepository
import java.time.LocalDateTime
import java.util.*

@Service
class AffirmationService(private val affirmationRepository: AffirmationRepository) {

    fun getAllAffirmations(sortBy: String = "createdAt"): List<AffirmationResponseDto> {
        val affirmations = affirmationRepository.findAll()

        val sortedAffirmations = when (sortBy) {
            "createdAt" -> affirmations.sortedByDescending { it.createdAt }
            "createdAtAsc" -> affirmations.sortedBy { it.createdAt }
            else -> affirmations.sortedByDescending { it.createdAt }
        }

        return sortedAffirmations.map { it.toResponseDto() }
    }

    @Transactional
    fun getAffirmationById(id: Long): AffirmationResponseDto {
        val affirmation = affirmationRepository.findById(id)
            .orElseThrow { NoSuchElementException("Affirmation not found with ID: $id") }
        return affirmation.toResponseDto()
    }

    @Transactional
    fun createAffirmation(requestDto: AffirmationRequestDto): AffirmationResponseDto {
        val affirmation = Affirmation(
            text = requestDto.text
        )

        return affirmationRepository.save(affirmation).toResponseDto()
    }

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

    @Transactional
    fun deleteAffirmation(id: Long) {
        if (!affirmationRepository.existsById(id)) {
            throw NoSuchElementException("Affirmation not found with ID: $id")
        }
        affirmationRepository.deleteById(id)
    }

    private fun Affirmation.toResponseDto(): AffirmationResponseDto {
        return AffirmationResponseDto(
            id = this.id,
            text = this.text,
            createdAt = this.createdAt,
            updatedAt = this.updatedAt
        )
    }
}
