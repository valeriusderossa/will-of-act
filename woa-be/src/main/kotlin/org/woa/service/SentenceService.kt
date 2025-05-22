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
            else -> sentences.sortedByDescending { it.createdAt } // Default sort
        }
        
        return sortedSentences.map { it.toResponseDto() }
    }
    



    /**
     * Get sentence by ID and increment view count.
     */
    @Transactional
    fun getSentenceById(id: Long): SentenceResponseDto {
        val sentence = sentenceRepository.findById(id)
            .orElseThrow { NoSuchElementException("Sentence not found with ID: $id") }
        

        
        return sentence.toResponseDto()
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
            createdAt = this.createdAt,
            updatedAt = this.updatedAt
        )
    }

}
