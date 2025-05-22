package org.woa.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.woa.entity.Sentence

@Repository
interface SentenceRepository : JpaRepository<Sentence, Long> {
    
    /**
     * Find sentences by their category.
     */
    fun findByCategory(category: String): List<Sentence>
    
    /**
     * Find sentences by their difficulty level.
     */
    fun findByDifficultyLevel(difficultyLevel: String): List<Sentence>
    
    /**
     * Find sentences by both category and difficulty level.
     */
    fun findByCategoryAndDifficultyLevel(category: String, difficultyLevel: String): List<Sentence>
    
    /**
     * Find sentences that contain the given text in either English or Polish.
     */
    fun findByEnglishTextContainingIgnoreCaseOrPolishTextContainingIgnoreCase(
        englishText: String, 
        polishText: String
    ): List<Sentence>
}
