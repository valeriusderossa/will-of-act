package org.woa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * Entity representing an affirmation.
 * Simplified version with just the text content and some metrics.
 */
@Entity
@Table(name = "affirmations")
data class Affirmation(
    /**
     * Unique identifier for the affirmation.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    /**
     * The text content of the affirmation.
     */
    @Column(nullable = false)
    val text: String,

    /**
     * Timestamp when the affirmation was created.
     */
    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    /**
     * Timestamp when the affirmation was last updated.
     */
    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
)
