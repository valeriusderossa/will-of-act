package org.woa.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.woa.entity.TechnicalLearning

@Repository
interface TechnicalLearningRepository : JpaRepository<TechnicalLearning, Long> {
    
    /**
     * Find all technical learnings by language
     */
    fun findByLanguageIgnoreCaseOrderByCreatedAtDesc(language: String): List<TechnicalLearning>
    
    /**
     * Find all technical learnings by subject containing keyword
     */
    fun findBySubjectContainingIgnoreCaseOrderByCreatedAtDesc(subject: String): List<TechnicalLearning>
    
    /**
     * Search technical learnings by keyword in language, subject, or text
     */
    @Query("""
        SELECT tl FROM TechnicalLearning tl 
        WHERE LOWER(tl.language) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(tl.subject) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(tl.text) LIKE LOWER(CONCAT('%', :keyword, '%'))
        ORDER BY tl.createdAt DESC
    """)
    fun searchByKeyword(@Param("keyword") keyword: String): List<TechnicalLearning>
    
    /**
     * Get all languages that have technical learnings
     */
    @Query("SELECT DISTINCT tl.language FROM TechnicalLearning tl ORDER BY tl.language")
    fun findAllDistinctLanguages(): List<String>
    
    /**
     * Get all subjects for a specific language
     */
    @Query("SELECT DISTINCT tl.subject FROM TechnicalLearning tl WHERE LOWER(tl.language) = LOWER(:language) ORDER BY tl.subject")
    fun findDistinctSubjectsByLanguage(@Param("language") language: String): List<String>
    
    /**
     * Count technical learnings by language
     */
    fun countByLanguageIgnoreCase(language: String): Long
}
