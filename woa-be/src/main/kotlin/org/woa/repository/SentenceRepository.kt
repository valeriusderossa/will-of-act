package org.woa.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.woa.entity.Sentence

@Repository
interface SentenceRepository : JpaRepository<Sentence, Long> {
    

    fun findByEnglishTextContainingIgnoreCaseOrPolishTextContainingIgnoreCase(
        englishText: String, 
        polishText: String
    ): List<Sentence>
}
