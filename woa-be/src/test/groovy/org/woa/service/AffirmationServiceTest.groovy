package org.woa.service

import org.woa.dto.AffirmationRequestDto
import org.woa.entity.Affirmation
import org.woa.repository.AffirmationRepository
import spock.lang.Specification

import java.time.LocalDateTime

class AffirmationServiceTest extends Specification {

    AffirmationRepository affirmationRepository = Mock()
    AffirmationService affirmationService = new AffirmationService(affirmationRepository)

    def "getAllAffirmations should return all affirmations sorted by createdAt desc by default"() {
        given:
        def now = LocalDateTime.now()
        def affirmations = [
            new Affirmation(id: 1L, text: "First", createdAt: now.minusDays(1)),
            new Affirmation(id: 2L, text: "Second", createdAt: now)
        ]
        affirmationRepository.findAll() >> affirmations

        when:
        def result = affirmationService.getAllAffirmations()

        then:
        result.size() == 2
        result[0].id == 2L // Most recent first
        result[0].text == "Second"
        result[1].id == 1L
        result[1].text == "First"
    }

    def "getAllAffirmations should sort by createdAt ascending when specified"() {
        given:
        def now = LocalDateTime.now()
        def affirmations = [
            new Affirmation(id: 1L, text: "First", createdAt: now.minusDays(1)),
            new Affirmation(id: 2L, text: "Second", createdAt: now)
        ]
        affirmationRepository.findAll() >> affirmations

        when:
        def result = affirmationService.getAllAffirmations("createdAtAsc")

        then:
        result.size() == 2
        result[0].id == 1L // Oldest first
        result[0].text == "First"
        result[1].id == 2L
        result[1].text == "Second"
    }

    def "getAffirmationById should return the affirmation if found"() {
        given:
        def now = LocalDateTime.now()
        def affirmation = new Affirmation(id: 1L, text: "Test affirmation", createdAt: now, updatedAt: now)
        affirmationRepository.findById(1L) >> Optional.of(affirmation)

        when:
        def result = affirmationService.getAffirmationById(1L)

        then:
        result.id == 1L
        result.text == "Test affirmation"
        result.createdAt == now
        result.updatedAt == now
    }

    def "getAffirmationById should throw exception if not found"() {
        given:
        affirmationRepository.findById(1L) >> Optional.empty()

        when:
        affirmationService.getAffirmationById(1L)

        then:
        def ex = thrown(NoSuchElementException)
        ex.message == "Affirmation not found with ID: 1"
    }

    def "createAffirmation should save and return the affirmation"() {
        given:
        def requestDto = new AffirmationRequestDto("New affirmation")
        def savedAffirmation = new Affirmation(id: 1L, text: "New affirmation")
        
        when:
        def result = affirmationService.createAffirmation(requestDto)

        then:
        1 * affirmationRepository.save(_ as Affirmation) >> { Affirmation affirmation ->
            assert affirmation.text == "New affirmation"
            assert affirmation.id == null // New entity
            return savedAffirmation
        }
        
        and:
        result.id == 1L
        result.text == "New affirmation"
    }

    def "updateAffirmation should update and return the affirmation if found"() {
        given:
        def now = LocalDateTime.now()
        def existingAffirmation = new Affirmation(id: 1L, text: "Old text", createdAt: now, updatedAt: now)
        def requestDto = new AffirmationRequestDto("Updated text")
        def updatedAffirmation = new Affirmation(id: 1L, text: "Updated text", createdAt: now, updatedAt: now.plusMinutes(1))
        
        affirmationRepository.findById(1L) >> Optional.of(existingAffirmation)
        
        when:
        def result = affirmationService.updateAffirmation(1L, requestDto)

        then:
        1 * affirmationRepository.save(_ as Affirmation) >> { Affirmation affirmation ->
            assert affirmation.id == 1L
            assert affirmation.text == "Updated text"
            assert affirmation.createdAt == now // Should preserve original creation time
            assert affirmation.updatedAt.isAfter(now) // Should update timestamp
            return updatedAffirmation
        }
        
        and:
        result.id == 1L
        result.text == "Updated text"
    }

    def "updateAffirmation should throw exception if not found"() {
        given:
        def requestDto = new AffirmationRequestDto("Updated text")
        affirmationRepository.findById(1L) >> Optional.empty()
        
        when:
        affirmationService.updateAffirmation(1L, requestDto)

        then:
        def ex = thrown(NoSuchElementException)
        ex.message == "Affirmation not found with ID: 1"
        0 * affirmationRepository.save(_)
    }
    
    def "deleteAffirmation should delete the affirmation if it exists"() {
        given:
        affirmationRepository.existsById(1L) >> true
        
        when:
        affirmationService.deleteAffirmation(1L)
        
        then:
        1 * affirmationRepository.deleteById(1L)
    }
    
    def "deleteAffirmation should throw exception if not found"() {
        given:
        affirmationRepository.existsById(1L) >> false
        
        when:
        affirmationService.deleteAffirmation(1L)
        
        then:
        def ex = thrown(NoSuchElementException)
        ex.message == "Affirmation not found with ID: 1"
        0 * affirmationRepository.deleteById(_)
    }

    def "should handle empty repository"() {
        given:
        affirmationRepository.findAll() >> []

        when:
        def result = affirmationService.getAllAffirmations()

        then:
        result.isEmpty()
    }

    def "should handle invalid sort parameter"() {
        given:
        def affirmations = [new Affirmation(id: 1L, text: "Test")]
        affirmationRepository.findAll() >> affirmations

        when:
        def result = affirmationService.getAllAffirmations("invalidSort")

        then:
        result.size() == 1
        // Should default to createdAt desc
    }
}
