package org.woa.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.woa.dto.SentenceRequestDto
import org.woa.dto.SentenceResponseDto
import org.woa.service.SentenceService
import java.util.*

@RestController
@RequestMapping("/api/sentences")
class SentenceController(private val sentenceService: SentenceService) {

    @GetMapping
    fun getAllSentences(): ResponseEntity<List<SentenceResponseDto>> {
        val sentences = sentenceService.getAllSentences()
        return ResponseEntity.ok(sentences)
    }

    @GetMapping("/{id}")
    fun getSentenceById(@PathVariable id: Long): ResponseEntity<SentenceResponseDto> {
        return try {
            ResponseEntity.ok(sentenceService.getSentenceById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping
    fun createSentence(@RequestBody requestDto: SentenceRequestDto): ResponseEntity<SentenceResponseDto> {
        val createdSentence = sentenceService.createSentence(requestDto)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSentence)
    }

    @PutMapping("/{id}")
    fun updateSentence(
        @PathVariable id: Long,
        @RequestBody requestDto: SentenceRequestDto
    ): ResponseEntity<SentenceResponseDto> {
        return try {
            val updatedSentence = sentenceService.updateSentence(id, requestDto)
            ResponseEntity.ok(updatedSentence)
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteSentence(@PathVariable id: Long): ResponseEntity<Void> {
        return try {
            sentenceService.deleteSentence(id)
            ResponseEntity.noContent().build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }
}