package org.woa.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.woa.entity.Running
import java.time.LocalDate

@Repository
interface RunningRepository : JpaRepository<Running, Long> {
    
    fun findByDateBetweenOrderByDateDesc(startDate: LocalDate, endDate: LocalDate): List<Running>
    
    @Query("SELECT r FROM Running r WHERE r.distance >= :minDistance ORDER BY r.date DESC")
    fun findByMinDistance(@Param("minDistance") minDistance: Double): List<Running>
    
    @Query("SELECT r FROM Running r WHERE r.date >= :startDate ORDER BY r.date DESC")
    fun findRecentRuns(@Param("startDate") startDate: LocalDate): List<Running>
    
    fun findAllByOrderByDateDesc(): List<Running>
    
    @Query("SELECT AVG(r.distance) FROM Running r WHERE r.date >= :startDate")
    fun getAverageDistanceSince(@Param("startDate") startDate: LocalDate): Double?
}
