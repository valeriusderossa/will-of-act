package org.woa.controller

import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.woa.dto.RunningRequestDto
import org.woa.dto.RunningResponseDto
import org.woa.dto.RunningSummaryDto
import org.woa.service.RunningService
import java.time.LocalDate
import java.util.*

@RestController
@RequestMapping("/api/running")
class RunningController(private val runningService: RunningService) {

    @GetMapping
    fun getAllRunningExercises(): ResponseEntity<List<RunningResponseDto>> {
        val exercises = runningService.getAllRunningExercises()
        return ResponseEntity.ok(exercises)
    }

    @GetMapping("/summary")
    fun getAllRunningSummaries(): ResponseEntity<List<RunningSummaryDto>> {
        val summaries = runningService.getAllRunningSummaries()
        return ResponseEntity.ok(summaries)
    }

    @GetMapping("/{id}")
    fun getRunningExerciseById(@PathVariable id: String): ResponseEntity<RunningResponseDto> {
        return try {
            ResponseEntity.ok(runningService.getRunningExerciseById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/date-range")
    fun getRunningExercisesByDateRange(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) startDate: LocalDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) endDate: LocalDate
    ): ResponseEntity<List<RunningResponseDto>> {
        val exercises = runningService.getRunningExercisesByDateRange(startDate, endDate)
        return ResponseEntity.ok(exercises)
    }

    @GetMapping("/min-distance")
    fun getRunningExercisesByMinDistance(@RequestParam minDistance: Double): ResponseEntity<List<RunningResponseDto>> {
        val exercises = runningService.getRunningExercisesByMinDistance(minDistance)
        return ResponseEntity.ok(exercises)
    }

    @GetMapping("/recent")
    fun getRecentRunningExercises(@RequestParam(defaultValue = "30") days: Int): ResponseEntity<List<RunningResponseDto>> {
        val exercises = runningService.getRecentRunningExercises(days)
        return ResponseEntity.ok(exercises)
    }

    @GetMapping("/average-distance")
    fun getAverageDistanceSince(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) startDate: LocalDate
    ): ResponseEntity<Map<String, Double>> {
        val averageDistance = runningService.getAverageDistanceSince(startDate)
        return ResponseEntity.ok(mapOf("averageDistance" to averageDistance))
    }

    @PostMapping
    fun createRunningExercise(@RequestBody requestDto: RunningRequestDto): ResponseEntity<RunningResponseDto> {
        val createdExercise = runningService.createRunningExercise(requestDto)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExercise)
    }

    @PutMapping("/{id}")
    fun updateRunningExercise(
        @PathVariable id: String,
        @RequestBody requestDto: RunningRequestDto
    ): ResponseEntity<RunningResponseDto> {
        return try {
            val updatedExercise = runningService.updateRunningExercise(id, requestDto)
            ResponseEntity.ok(updatedExercise)
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteRunningExercise(@PathVariable id: String): ResponseEntity<Void> {
        return try {
            runningService.deleteRunningExercise(id)
            ResponseEntity.noContent().build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }
}
