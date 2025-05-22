package org.woa.service

import org.woa.dto.SentenceRequestDto
import org.woa.entity.Sentence
import org.woa.repository.SentenceRepository
import spock.lang.Specification

import java.time.LocalDateTime

class SentenceServiceTest extends Specification {

    SentenceRepository sentenceRepository = Mock()
    SentenceService sentenceService = new SentenceService(sentenceRepository)

    def "getAllSentences should return all sentences"() {
        given:
        def sentences = [
            new Sentence(id: 1L, englishText: "Hello", polishText: "Cześć"),
            new Sentence(id: 2L, englishText: "Goodbye", polishText: "Do widzenia")
        ]
        sentenceRepository.findAll() >> sentences

        when:
        def result = sentenceService.getAllSentences()

        then:
        result.size() == 2
        result[0].id == 1L
        result[0].englishText == "Hello"
        result[0].polishText == "Cześć"
    }

    def "getSentenceById should return the sentence if found"() {
        given:
        def sentence = new Sentence(id: 1L, englishText: "Hello", polishText: "Cześć")
        sentenceRepository.findById(1L) >> Optional.of(sentence)

        when:
        def result = sentenceService.getSentenceById(1L)

        then:
        result.id == 1L
        result.englishText == "Hello"
        result.polishText == "Cześć"
    }

    def "getSentenceById should throw exception if not found"() {
        given:
        sentenceRepository.findById(1L) >> Optional.empty()

        when:
        sentenceService.getSentenceById(1L)

        then:
        thrown(NoSuchElementException)
    }

    def "createSentence should save and return the sentence"() {
        given:
        def requestDto = new SentenceRequestDto("Hello", "Cześć", "həˈloʊ", "Greeting", "Beginner")
        def savedSentence = new Sentence(id: 1L, englishText: "Hello", polishText: "Cześć", pronunciation: "həˈloʊ", category: "Greeting", difficultyLevel: "Beginner")
        
        when:
        def result = sentenceService.createSentence(requestDto)

        then:
        1 * sentenceRepository.save(_ as Sentence) >> { Sentence sentence ->
            assert sentence.englishText == "Hello"
            assert sentence.polishText == "Cześć"
            return savedSentence
        }
        
        and:
        result.id == 1L
        result.englishText == "Hello"
        result.polishText == "Cześć"
    }

    def "updateSentence should update and return the sentence if found"() {
        given:
        def now = LocalDateTime.now()
        def existingSentence = new Sentence(id: 1L, englishText: "Old", polishText: "Stary", createdAt: now, updatedAt: now)
        def requestDto = new SentenceRequestDto("New", "Nowy", null, null, null)
        def updatedSentence = new Sentence(id: 1L, englishText: "New", polishText: "Nowy", createdAt: now, updatedAt: now)
        
        sentenceRepository.findById(1L) >> Optional.of(existingSentence)
        
        when:
        def result = sentenceService.updateSentence(1L, requestDto)

        then:
        1 * sentenceRepository.save(_ as Sentence) >> { Sentence sentence ->
            assert sentence.id == 1L
            assert sentence.englishText == "New"
            assert sentence.polishText == "Nowy"
            return updatedSentence
        }
        
        and:
        result.id == 1L
        result.englishText == "New"
        result.polishText == "Nowy"
    }

    def "deleteSentence should delete the sentence if it exists"() {
        given:
        sentenceRepository.existsById(1L) >> true
        
        when:
        sentenceService.deleteSentence(1L)
        
        then:
        1 * sentenceRepository.deleteById(1L)
    }
    
    def "deleteSentence should throw exception if not found"() {
        given:
        sentenceRepository.existsById(1L) >> false
        
        when:
        sentenceService.deleteSentence(1L)
        
        then:
        thrown(NoSuchElementException)
        0 * sentenceRepository.deleteById(_)
    }
}
