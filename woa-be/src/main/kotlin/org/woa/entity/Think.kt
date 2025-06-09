package org.woa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "thinks")
data class Think(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, columnDefinition = "TEXT")
    val text: String,

    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
