package org.woa.entity

import jakarta.persistence.Embeddable

@Embeddable
data class SetEntry(
    val reps: Int,
    val weight: Double
) {
    // JPA requires a no-args constructor
    constructor() : this(
        reps = 0,
        weight = 0.0
    )
}
