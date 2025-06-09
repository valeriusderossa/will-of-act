package org.woa.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.woa.dto.ThinkRequestDto
import org.woa.dto.ThinkResponseDto
import org.woa.entity.Think
import org.woa.repository.ThinkRepository
import java.util.*

@Service
class ThinkService(private val thinkRepository: ThinkRepository) {

    fun getAllThinks(): List<ThinkResponseDto> {
        return thinkRepository.findAll().map { it.toResponseDto() }
    }

    @Transactional
    fun getThinkById(id: Long): ThinkResponseDto {
        val think = thinkRepository.findById(id)
            .orElseThrow { NoSuchElementException("Think not found with ID: $id") }
        
        return think.toResponseDto()
    }

    @Transactional
    fun createThink(requestDto: ThinkRequestDto): ThinkResponseDto {
        val think = Think(
            text = requestDto.text
        )
        
        return thinkRepository.save(think).toResponseDto()
    }

    @Transactional
    fun updateThink(id: Long, requestDto: ThinkRequestDto): ThinkResponseDto {
        val existingThink = thinkRepository.findById(id)
            .orElseThrow { NoSuchElementException("Think not found with ID: $id") }
        
        val updatedThink = existingThink.copy(
            text = requestDto.text
        )
        
        return thinkRepository.save(updatedThink).toResponseDto()
    }

    @Transactional
    fun deleteThink(id: Long) {
        if (!thinkRepository.existsById(id)) {
            throw NoSuchElementException("Think not found with ID: $id")
        }
        thinkRepository.deleteById(id)
    }

    private fun Think.toResponseDto(): ThinkResponseDto {
        return ThinkResponseDto(
            id = this.id,
            text = this.text,
            createdAt = this.createdAt
        )
    }
}
