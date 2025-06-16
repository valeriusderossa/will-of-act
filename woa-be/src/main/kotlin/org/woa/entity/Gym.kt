package org.woa.entity

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "gym_exercises")
data class Gym(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,

    @Column(nullable = false)
    val name: String,

    @Column(nullable = false)
    val partOfBody: String,

    @Column(nullable = false)
    val date: LocalDate,

    @ElementCollection
    @CollectionTable(
        name = "gym_sets",
        joinColumns = [JoinColumn(name = "gym_exercise_id")]
    )
    val sets: List<SetEntry>
) {
    // JPA requires a no-args constructor
    constructor() : this(
        id = null,
        name = "",
        partOfBody = "",
        date = LocalDate.now(),
        sets = emptyList()
    )
}
