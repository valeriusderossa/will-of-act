package org.woa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "learnings")
data class TechnicalLearning(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @Column(nullable = false)
    val language: String,
    
    @Column(nullable = false)
    val subject: String,
    
    @Column(nullable = false, columnDefinition = "TEXT")
    val text: String,
    
    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at", nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
) {
    // JPA requires a no-args constructor
    constructor() : this(
        id = null,
        language = "",
        subject = "",
        text = "",
        createdAt = LocalDateTime.now(),
        updatedAt = LocalDateTime.now()
    )
}
