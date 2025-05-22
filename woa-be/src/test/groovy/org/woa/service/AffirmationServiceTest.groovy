package org.woa.service

import org.woa.dto.AffirmationRequestDto
import org.woa.entity.Affirmation
import org.woa.repository.AffirmationRepository
import spock.lang.Specification

import java.time.LocalDateTime

class AffirmationServiceTest extends Specification {

    AffirmationRepository affirmationRepository = Mock()
    AffirmationService affirmationService = new AffirmationService(affirmationRepository)

    def "getAllAffirmations should return all affirmations"() {
        given:
        def affirmations = [
            new Affirmation(id: 1L, text: "Test affirmation 1"),
            new Affirmation(id: 2L, text: "Test affirmation 2")
        ]
        affirmationRepository.findAll() >> affirmations

        when:
        def result = affirmationService.getAllAffirmations()

        then:
        result.size() == 2
        result[0].id == 1L
        result[0].text == "Test affirmation 1"
        result[1].id == 2L
        result[1].text == "Test affirmation 2"
    }

    def "getAffirmationById should return the affirmation if found"() {
        given:
        def affirmation = new Affirmation(id: 1L, text: "Test affirmation")
        affirmationRepository.findById(1L) >> Optional.of(affirmation)

        when:
        def result = affirmationService.getAffirmationById(1L)

        then:
        result.id == 1L
        result.text == "Test affirmation"
    }

    def "getAffirmationById should throw exception if not found"() {
        given:
        affirmationRepository.findById(1L) >> Optional.empty()

        when:
        affirmationService.getAffirmationById(1L)

        then:
        thrown(NoSuchElementException)
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
        def updatedAffirmation = new Affirmation(id: 1L, text: "Updated text", createdAt: now, updatedAt: now)
        
        affirmationRepository.findById(1L) >> Optional.of(existingAffirmation)
        
        when:
        def result = affirmationService.updateAffirmation(1L, requestDto)

        then:
        1 * affirmationRepository.save(_ as Affirmation) >> { Affirmation affirmation ->
            assert affirmation.id == 1L
            assert affirmation.text == "Updated text"
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
        thrown(NoSuchElementException)
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
        thrown(NoSuchElementException)
        0 * affirmationRepository.deleteById(_)
    }
}
