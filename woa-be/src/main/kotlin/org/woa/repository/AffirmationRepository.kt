package org.woa.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.woa.entity.Affirmation

/**
 * Repository interface for accessing and manipulating Affirmation entities.
 */
@Repository
interface AffirmationRepository : JpaRepository<Affirmation, Long>
