package org.woa.controller

import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.woa.dto.GymRequestDto
import org.woa.dto.GymResponseDto
import org.woa.dto.GymSummaryDto
import org.woa.service.GymService
import java.time.LocalDate
import java.util.*

@RestController
@RequestMapping("/api/gym")
class GymController(private val gymService: GymService) {

    @GetMapping
    fun getAllGymExercises(): ResponseEntity<List<GymResponseDto>> {
        val exercises = gymService.getAllGymExercises()
        return ResponseEntity.ok(exercises)
    }

    @GetMapping("/summary")
    fun getAllGymSummaries(): ResponseEntity<List<GymSummaryDto>> {
        val summaries = gymService.getAllGymSummaries()
        return ResponseEntity.ok(summaries)
    }

    @GetMapping("/{id}")
    fun getGymExerciseById(@PathVariable id: String): ResponseEntity<GymResponseDto> {
        return try {
            ResponseEntity.ok(gymService.getGymExerciseById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/date-range")
    fun getGymExercisesByDateRange(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) startDate: LocalDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) endDate: LocalDate
    ): ResponseEntity<List<GymResponseDto>> {
        val exercises = gymService.getGymExercisesByDateRange(startDate, endDate)
        return ResponseEntity.ok(exercises)
    }

    @GetMapping("/body-part/{partOfBody}")
    fun getGymExercisesByBodyPart(@PathVariable partOfBody: String): ResponseEntity<List<GymResponseDto>> {
        val exercises = gymService.getGymExercisesByBodyPart(partOfBody)
        return ResponseEntity.ok(exercises)
    }

    @GetMapping("/search")
    fun searchGymExercisesByName(@RequestParam name: String): ResponseEntity<List<GymResponseDto>> {
        val exercises = gymService.searchGymExercisesByName(name)
        return ResponseEntity.ok(exercises)
    }

    @GetMapping("/recent")
    fun getRecentGymExercises(@RequestParam(defaultValue = "30") days: Int): ResponseEntity<List<GymResponseDto>> {
        val exercises = gymService.getRecentGymExercises(days)
        return ResponseEntity.ok(exercises)
    }

    @PostMapping
    fun createGymExercise(@RequestBody requestDto: GymRequestDto): ResponseEntity<GymResponseDto> {
        val createdExercise = gymService.createGymExercise(requestDto)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExercise)
    }

    @PutMapping("/{id}")
    fun updateGymExercise(
        @PathVariable id: String,
        @RequestBody requestDto: GymRequestDto
    ): ResponseEntity<GymResponseDto> {
        return try {
            val updatedExercise = gymService.updateGymExercise(id, requestDto)
            ResponseEntity.ok(updatedExercise)
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteGymExercise(@PathVariable id: String): ResponseEntity<Void> {
        return try {
            gymService.deleteGymExercise(id)
            ResponseEntity.noContent().build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }
}
