package com.willofact.repository

import com.willofact.entity.Learning
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface LearningRepository : JpaRepository<Learning, Long> {
    
    fun findByLanguageIgnoreCase(language: String): List<Learning>
    
    fun findByLanguageContainingIgnoreCase(language: String): List<Learning>
    
    @Query("SELECT l FROM Learning l WHERE " +
           "LOWER(l.subject) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.text) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.language) LIKE LOWER(CONCAT('%', :query, '%'))")
    fun searchLearnings(@Param("query") query: String): List<Learning>
    
    @Query("SELECT l FROM Learning l ORDER BY l.createdAt DESC")
    fun findAllOrderByCreatedAtDesc(): List<Learning>
    
    @Query("SELECT l FROM Learning l WHERE LOWER(l.language) = LOWER(:language) ORDER BY l.createdAt DESC")
    fun findByLanguageOrderByCreatedAtDesc(@Param("language") language: String): List<Learning>
    
    @Query("SELECT DISTINCT l.language FROM Learning l ORDER BY l.language")
    fun findDistinctLanguages(): List<String>
    
    @Query("SELECT COUNT(l) FROM Learning l WHERE LOWER(l.language) = LOWER(:language)")
    fun countByLanguage(@Param("language") language: String): Long
}
