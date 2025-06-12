package org.woa.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.woa.entity.Gym
import java.time.LocalDate

@Repository
interface GymRepository : JpaRepository<Gym, String> {
    
    fun findByDateBetweenOrderByDateDesc(startDate: LocalDate, endDate: LocalDate): List<Gym>
    
    fun findByPartOfBodyIgnoreCaseOrderByDateDesc(partOfBody: String): List<Gym>
    
    fun findByNameContainingIgnoreCaseOrderByDateDesc(name: String): List<Gym>
    
    @Query("SELECT g FROM Gym g WHERE g.date >= :startDate ORDER BY g.date DESC")
    fun findRecentExercises(@Param("startDate") startDate: LocalDate): List<Gym>
    
    fun findAllByOrderByDateDesc(): List<Gym>
}
