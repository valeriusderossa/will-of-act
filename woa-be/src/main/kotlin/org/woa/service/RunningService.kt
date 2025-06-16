package org.woa.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.woa.dto.RunningRequestDto
import org.woa.dto.RunningResponseDto
import org.woa.dto.RunningSummaryDto
import org.woa.entity.Running
import org.woa.repository.RunningRepository
import java.time.LocalDate

@Service
class RunningService(private val runningRepository: RunningRepository) {

    fun getAllRunningExercises(): List<RunningResponseDto> {
        return runningRepository.findAllByOrderByDateDesc().map { it.toResponseDto() }
    }

    fun getAllRunningSummaries(): List<RunningSummaryDto> {
        return runningRepository.findAllByOrderByDateDesc().map { it.toSummaryDto() }
    }

    @Transactional
    fun getRunningExerciseById(id: Long): RunningResponseDto {
        val running = runningRepository.findById(id)
            .orElseThrow { NoSuchElementException("Running exercise not found with ID: $id") }
        
        return running.toResponseDto()
    }

    fun getRunningExercisesByDateRange(startDate: LocalDate, endDate: LocalDate): List<RunningResponseDto> {
        return runningRepository.findByDateBetweenOrderByDateDesc(startDate, endDate)
            .map { it.toResponseDto() }
    }

    fun getRunningExercisesByMinDistance(minDistance: Double): List<RunningResponseDto> {
        return runningRepository.findByMinDistance(minDistance)
            .map { it.toResponseDto() }
    }

    fun getRecentRunningExercises(days: Int = 30): List<RunningResponseDto> {
        val startDate = LocalDate.now().minusDays(days.toLong())
        return runningRepository.findRecentRuns(startDate).map { it.toResponseDto() }
    }

    fun getAverageDistanceSince(startDate: LocalDate): Double {
        return runningRepository.getAverageDistanceSince(startDate) ?: 0.0
    }

    @Transactional
    fun createRunningExercise(requestDto: RunningRequestDto): RunningResponseDto {
        val running = Running(
            distance = requestDto.distance,
            time = requestDto.time,
            date = requestDto.date
        )
        
        return runningRepository.save(running).toResponseDto()
    }

    @Transactional
    fun updateRunningExercise(id: Long, requestDto: RunningRequestDto): RunningResponseDto {
        val existingRunning = runningRepository.findById(id)
            .orElseThrow { NoSuchElementException("Running exercise not found with ID: $id") }
        
        val updatedRunning = existingRunning.copy(
            distance = requestDto.distance,
            time = requestDto.time,
            date = requestDto.date
        )
        
        return runningRepository.save(updatedRunning).toResponseDto()
    }

    @Transactional
    fun deleteRunningExercise(id: Long) {
        if (!runningRepository.existsById(id)) {
            throw NoSuchElementException("Running exercise not found with ID: $id")
        }
        runningRepository.deleteById(id)
    }

    private fun Running.toResponseDto(): RunningResponseDto {
        return RunningResponseDto(
            id = this.id,
            distance = this.distance,
            time = this.time,
            date = this.date
        )
    }

    private fun Running.toSummaryDto(): RunningSummaryDto {
        val averageSpeed = if (time.toMinutes() > 0) {
            (distance / time.toMinutes()) * 60 // km/h
        } else 0.0

        return RunningSummaryDto(
            id = this.id,
            distance = this.distance,
            time = this.time,
            date = this.date,
            averageSpeed = averageSpeed
        )
    }
}
