package org.woa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * Entity representing a sentence in English and Polish with pronunciation.
 */
@Entity
@Table(name = "sentences")
data class Sentence(
    /**
     * Unique identifier for the sentence.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    /**
     * The sentence text in English.
     */
    @Column(nullable = false)
    val englishText: String,

    /**
     * The sentence text in Polish.
     */
    @Column(nullable = false)
    val polishText: String,

    /**
     * Pronunciation guide for the sentence (using IPA or other phonetic notation).
     */
    @Column(nullable = true)
    val pronunciation: String? = null,

    /**
     * Number of times this sentence has been viewed.
     */
    @Column(nullable = false)
    val viewCount: Int = 0,
    
    /**
     * Optional category or tag for the sentence.
     */
    @Column(nullable = true)
    val category: String? = null,
    
    /**
     * Optional difficulty level (e.g., "beginner", "intermediate", "advanced").
     */
    @Column(nullable = true)
    val difficultyLevel: String? = null,
    
    /**
     * Timestamp when the sentence was created.
     */
    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    /**
     * Timestamp when the sentence was last updated.
     */
    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
)
