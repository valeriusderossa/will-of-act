package org.woa.entity

import jakarta.persistence.*
import java.time.Duration
import java.time.LocalDate

@Entity
@Table(name = "running_exercises")
data class Running(
    @Id
    val id: String,

    @Column(nullable = false)
    val distance: Double,

    @Column(nullable = false)
    @Convert(converter = org.woa.config.DurationConverter::class)
    val time: Duration,

    @Column(nullable = false)
    val date: LocalDate
) {
    // JPA requires a no-args constructor
    constructor() : this(
        id = "",
        distance = 0.0,
        time = Duration.ZERO,
        date = LocalDate.now()
    )
}
