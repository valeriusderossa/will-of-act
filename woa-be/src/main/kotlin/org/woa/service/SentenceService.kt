package org.woa.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.woa.dto.SentenceRequestDto
import org.woa.dto.SentenceResponseDto
import org.woa.entity.Sentence
import org.woa.repository.SentenceRepository
import java.time.LocalDateTime
import java.util.*

@Service
class SentenceService(private val sentenceRepository: SentenceRepository) {

    fun getAllSentences(): List<SentenceResponseDto> {
        return sentenceRepository.findAll().map { it.toResponseDto() }
    }

    @Transactional
    fun getSentenceById(id: Long): SentenceResponseDto {
        val sentence = sentenceRepository.findById(id)
            .orElseThrow { NoSuchElementException("Sentence not found with ID: $id") }
        
        return sentence.toResponseDto()
    }

    @Transactional
    fun createSentence(requestDto: SentenceRequestDto): SentenceResponseDto {
        val sentence = Sentence(
            englishText = requestDto.englishText,
            polishText = requestDto.polishText,
            pronunciation = requestDto.pronunciation,
        )
        
        return sentenceRepository.save(sentence).toResponseDto()
    }

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

    @Transactional
    fun deleteSentence(id: Long) {
        if (!sentenceRepository.existsById(id)) {
            throw NoSuchElementException("Sentence not found with ID: $id")
        }
        sentenceRepository.deleteById(id)
    }

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