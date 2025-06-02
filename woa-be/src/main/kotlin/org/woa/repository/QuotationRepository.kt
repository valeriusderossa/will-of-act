package org.woa.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.woa.entity.Quotation

@Repository
interface QuotationRepository : JpaRepository<Quotation, Long>
