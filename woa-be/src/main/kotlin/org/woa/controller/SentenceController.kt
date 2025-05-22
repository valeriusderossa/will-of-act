package org.woa.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.woa.dto.SentenceRequestDto
import org.woa.dto.SentenceResponseDto
import org.woa.dto.SentenceSummaryDto
import org.woa.service.SentenceService
import java.util.*

@RestController
@RequestMapping("/api/sentences")
class SentenceController(private val sentenceService: SentenceService) {

    @GetMapping
    fun getAllSentences(
        @RequestParam(required = false, defaultValue = "createdAt") sortBy: String
    ): ResponseEntity<List<SentenceResponseDto>> {
        val sentences = sentenceService.getAllSentences(sortBy)
        return ResponseEntity.ok(sentences)
    }
    
    @GetMapping("/summaries")
    fun getAllSentenceSummaries(
        @RequestParam(required = false, defaultValue = "createdAt") sortBy: String
    ): ResponseEntity<List<SentenceSummaryDto>> {
        val summaries = sentenceService.getAllSentenceSummaries(sortBy)
        return ResponseEntity.ok(summaries)
    }

    @GetMapping("/{id}")
    fun getSentenceById(@PathVariable id: Long): ResponseEntity<SentenceResponseDto> {
        return try {
            ResponseEntity.ok(sentenceService.getSentenceById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/random")
    fun getRandomSentence(): ResponseEntity<SentenceResponseDto> {
        return try {
            ResponseEntity.ok(sentenceService.getRandomSentence())
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/category/{category}")
    fun getSentencesByCategory(@PathVariable category: String): ResponseEntity<List<SentenceResponseDto>> {
        val sentences = sentenceService.getSentencesByCategory(category)
        return ResponseEntity.ok(sentences)
    }

    @GetMapping("/difficulty/{difficultyLevel}")
    fun getSentencesByDifficultyLevel(@PathVariable difficultyLevel: String): ResponseEntity<List<SentenceResponseDto>> {
        val sentences = sentenceService.getSentencesByDifficultyLevel(difficultyLevel)
        return ResponseEntity.ok(sentences)
    }

    @GetMapping("/search")
    fun searchSentences(@RequestParam searchText: String): ResponseEntity<List<SentenceResponseDto>> {
        val sentences = sentenceService.searchSentences(searchText)
        return ResponseEntity.ok(sentences)
    }

    @GetMapping("/category/{category}/difficulty/{difficultyLevel}")
    fun getSentencesByCategoryAndDifficultyLevel(
        @PathVariable category: String,
        @PathVariable difficultyLevel: String
    ): ResponseEntity<List<SentenceResponseDto>> {
        val sentences = sentenceService.getSentencesByCategoryAndDifficultyLevel(category, difficultyLevel)
        return ResponseEntity.ok(sentences)
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
