package org.woa.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.woa.dto.AffirmationRequestDto
import org.woa.dto.AffirmationResponseDto
import org.woa.service.AffirmationService
import java.util.*

@RestController
@RequestMapping("/api/affirmations")
class AffirmationController(private val affirmationService: AffirmationService) {

    @GetMapping
    fun getAllAffirmations(): ResponseEntity<List<AffirmationResponseDto>> {
        val affirmations = affirmationService.getAllAffirmations()
        return ResponseEntity.ok(affirmations)
    }

    @GetMapping("/{id}")
    fun getAffirmationById(@PathVariable id: Long): ResponseEntity<AffirmationResponseDto> {
        return try {
            ResponseEntity.ok(affirmationService.getAffirmationById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping
    fun createAffirmation(@RequestBody requestDto: AffirmationRequestDto): ResponseEntity<AffirmationResponseDto> {
        val createdAffirmation = affirmationService.createAffirmation(requestDto)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAffirmation)
    }

    @PutMapping("/{id}")
    fun updateAffirmation(
        @PathVariable id: Long,
        @RequestBody requestDto: AffirmationRequestDto
    ): ResponseEntity<AffirmationResponseDto> {
        return try {
            val updatedAffirmation = affirmationService.updateAffirmation(id, requestDto)
            ResponseEntity.ok(updatedAffirmation)
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteAffirmation(@PathVariable id: Long): ResponseEntity<Void> {
        return try {
            affirmationService.deleteAffirmation(id)
            ResponseEntity.noContent().build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }
}