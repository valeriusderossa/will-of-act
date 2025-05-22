package org.woa.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "sentences")
data class Sentence(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    val englishText: String,

    @Column(nullable = false)
    val polishText: String,

    @Column(nullable = true)
    val pronunciation: String? = null,

    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
)
