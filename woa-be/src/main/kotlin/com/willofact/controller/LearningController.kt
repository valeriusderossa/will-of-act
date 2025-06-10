package com.willofact.controller

import com.willofact.dto.LearningRequest
import com.willofact.dto.LearningResponse
import com.willofact.service.LearningService
import jakarta.validation.Valid
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/learnings")
@CrossOrigin(origins = ["http://localhost:4200"])
class LearningController(
    private val learningService: LearningService
) {
    private val logger = LoggerFactory.getLogger(LearningController::class.java)

    @GetMapping
    fun getAllLearnings(): ResponseEntity<List<LearningResponse>> {
        logger.info("GET /api/learnings - Fetching all learnings")
        val learnings = learningService.getAllLearnings()
        logger.info("Returning {} learnings", learnings.size)
        return ResponseEntity.ok(learnings)
    }

    @GetMapping("/{id}")
    fun getLearningById(@PathVariable id: Long): ResponseEntity<LearningResponse> {
        logger.info("GET /api/learnings/{} - Fetching learning by id", id)
        val learning = learningService.getLearningById(id)
        return ResponseEntity.ok(learning)
    }

    @PostMapping
    fun createLearning(@Valid @RequestBody request: LearningRequest): ResponseEntity<LearningResponse> {
        logger.info("POST /api/learnings - Creating new learning")
        val learning = learningService.createLearning(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(learning)
    }

    @PutMapping("/{id}")
    fun updateLearning(
        @PathVariable id: Long,
        @Valid @RequestBody request: LearningRequest
    ): ResponseEntity<LearningResponse> {
        logger.info("PUT /api/learnings/{} - Updating learning", id)
        val learning = learningService.updateLearning(id, request)
        return ResponseEntity.ok(learning)
    }

    @DeleteMapping("/{id}")
    fun deleteLearning(@PathVariable id: Long): ResponseEntity<Void> {
        logger.info("DELETE /api/learnings/{} - Deleting learning", id)
        learningService.deleteLearning(id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/by-language/{language}")
    fun getLearningsByLanguage(@PathVariable language: String): ResponseEntity<List<LearningResponse>> {
        logger.info("GET /api/learnings/by-language/{} - Fetching learnings by language", language)
        val learnings = learningService.getLearningsByLanguage(language)
        logger.info("Returning {} learnings for language: {}", learnings.size, language)
        return ResponseEntity.ok(learnings)
    }

    @GetMapping("/search")
    fun searchLearnings(@RequestParam("q") query: String): ResponseEntity<List<LearningResponse>> {
        logger.info("GET /api/learnings/search?q={} - Searching learnings", query)
        val learnings = learningService.searchLearnings(query)
        logger.info("Search returned {} learnings", learnings.size)
        return ResponseEntity.ok(learnings)
    }

    @GetMapping("/languages")
    fun getDistinctLanguages(): ResponseEntity<List<String>> {
        logger.info("GET /api/learnings/languages - Fetching distinct languages")
        val languages = learningService.getDistinctLanguages()
        logger.info("Returning {} distinct languages", languages.size)
        return ResponseEntity.ok(languages)
    }

    @GetMapping("/stats/languages")
    fun getLanguageStats(): ResponseEntity<Map<String, Long>> {
        logger.info("GET /api/learnings/stats/languages - Fetching language statistics")
        val stats = learningService.getLanguageStats()
        return ResponseEntity.ok(stats)
    }

    @GetMapping("/recent")
    fun getRecentLearnings(@RequestParam(defaultValue = "10") limit: Int): ResponseEntity<List<LearningResponse>> {
        logger.info("GET /api/learnings/recent?limit={} - Fetching recent learnings", limit)
        val learnings = learningService.getRecentLearnings(limit)
        logger.info("Returning {} recent learnings", learnings.size)
        return ResponseEntity.ok(learnings)
    }
}
