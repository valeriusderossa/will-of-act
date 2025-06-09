package org.woa.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.woa.dto.ThinkRequestDto
import org.woa.dto.ThinkResponseDto
import org.woa.service.ThinkService
import java.util.*

@RestController
@RequestMapping("/api/thinks")
class ThinkController(private val thinkService: ThinkService) {

    @GetMapping
    fun getAllThinks(): ResponseEntity<List<ThinkResponseDto>> {
        val thinks = thinkService.getAllThinks()
        return ResponseEntity.ok(thinks)
    }

    @GetMapping("/{id}")
    fun getThinkById(@PathVariable id: Long): ResponseEntity<ThinkResponseDto> {
        return try {
            ResponseEntity.ok(thinkService.getThinkById(id))
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping
    fun createThink(@RequestBody requestDto: ThinkRequestDto): ResponseEntity<ThinkResponseDto> {
        val createdThink = thinkService.createThink(requestDto)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdThink)
    }

    @PutMapping("/{id}")
    fun updateThink(
        @PathVariable id: Long,
        @RequestBody requestDto: ThinkRequestDto
    ): ResponseEntity<ThinkResponseDto> {
        return try {
            val updatedThink = thinkService.updateThink(id, requestDto)
            ResponseEntity.ok(updatedThink)
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteThink(@PathVariable id: Long): ResponseEntity<Void> {
        return try {
            thinkService.deleteThink(id)
            ResponseEntity.noContent().build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }
}
