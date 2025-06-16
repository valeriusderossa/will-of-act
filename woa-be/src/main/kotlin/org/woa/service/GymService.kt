package org.woa.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.woa.dto.*
import org.woa.entity.Gym
import org.woa.entity.SetEntry
import org.woa.repository.GymRepository
import java.time.LocalDate

@Service
class GymService(private val gymRepository: GymRepository) {

    fun getAllGymExercises(): List<GymResponseDto> {
        return gymRepository.findAllByOrderByDateDesc().map { it.toResponseDto() }
    }

    fun getAllGymSummaries(): List<GymSummaryDto> {
        return gymRepository.findAllByOrderByDateDesc().map { it.toSummaryDto() }
    }

    @Transactional
    fun getGymExerciseById(id: Long): GymResponseDto {
        val gym = gymRepository.findById(id)
            .orElseThrow { NoSuchElementException("Gym exercise not found with ID: $id") }
        
        return gym.toResponseDto()
    }

    fun getGymExercisesByDateRange(startDate: LocalDate, endDate: LocalDate): List<GymResponseDto> {
        return gymRepository.findByDateBetweenOrderByDateDesc(startDate, endDate)
            .map { it.toResponseDto() }
    }

    fun getGymExercisesByBodyPart(partOfBody: String): List<GymResponseDto> {
        return gymRepository.findByPartOfBodyIgnoreCaseOrderByDateDesc(partOfBody)
            .map { it.toResponseDto() }
    }

    fun searchGymExercisesByName(name: String): List<GymResponseDto> {
        return gymRepository.findByNameContainingIgnoreCaseOrderByDateDesc(name)
            .map { it.toResponseDto() }
    }

    fun getRecentGymExercises(days: Int = 30): List<GymResponseDto> {
        val startDate = LocalDate.now().minusDays(days.toLong())
        return gymRepository.findRecentExercises(startDate).map { it.toResponseDto() }
    }

    @Transactional
    fun createGymExercise(requestDto: GymRequestDto): GymResponseDto {
        val gym = Gym(
            id = null, // Let the database generate the ID
            name = requestDto.name,
            partOfBody = requestDto.partOfBody,
            date = requestDto.date,
            sets = requestDto.sets.map { SetEntry(it.reps, it.weight) }
        )
        
        return gymRepository.save(gym).toResponseDto()
    }

    @Transactional
    fun updateGymExercise(id: Long, requestDto: GymRequestDto): GymResponseDto {
        val existingGym = gymRepository.findById(id)
            .orElseThrow { NoSuchElementException("Gym exercise not found with ID: $id") }
        
        val updatedGym = existingGym.copy(
            name = requestDto.name,
            partOfBody = requestDto.partOfBody,
            date = requestDto.date,
            sets = requestDto.sets.map { SetEntry(it.reps, it.weight) }
        )
        
        return gymRepository.save(updatedGym).toResponseDto()
    }

    @Transactional
    fun deleteGymExercise(id: Long) {
        if (!gymRepository.existsById(id)) {
            throw NoSuchElementException("Gym exercise not found with ID: $id")
        }
        gymRepository.deleteById(id)
    }

    private fun Gym.toResponseDto(): GymResponseDto {
        return GymResponseDto(
            id = this.id ?: 0L, // Handle null case, though it should not happen for persisted entities
            name = this.name,
            partOfBody = this.partOfBody,
            date = this.date,
            sets = this.sets.map { SetEntryDto(it.reps, it.weight) }
        )
    }

    private fun Gym.toSummaryDto(): GymSummaryDto {
        val totalSets = this.sets.size
        val totalReps = this.sets.sumOf { it.reps }
        val maxWeight = this.sets.maxOfOrNull { it.weight } ?: 0.0
        val avgWeight = if (this.sets.isNotEmpty()) this.sets.map { it.weight }.average() else 0.0

        return GymSummaryDto(
            id = this.id ?: 0L, // Handle null case, though it should not happen for persisted entities
            name = this.name,
            partOfBody = this.partOfBody,
            date = this.date,
            totalSets = totalSets,
            totalReps = totalReps,
            maxWeight = maxWeight,
            avgWeight = avgWeight
        )
    }
}
