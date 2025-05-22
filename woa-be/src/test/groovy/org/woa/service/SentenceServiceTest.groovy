package org.woa.service

import org.woa.dto.SentenceRequestDto
import org.woa.entity.Sentence
import org.woa.repository.SentenceRepository
import spock.lang.Specification

import java.time.LocalDateTime

class SentenceServiceTest extends Specification {

    SentenceRepository sentenceRepository = Mock()
    SentenceService sentenceService = new SentenceService(sentenceRepository)

    def "getAllSentences should return all sentences sorted by createdAt desc by default"() {
        given:
        def now = LocalDateTime.now()
        def sentences = [
            new Sentence(id: 1L, englishText: "Hello", polishText: "Cześć", createdAt: now.minusDays(1)),
            new Sentence(id: 2L, englishText: "Goodbye", polishText: "Do widzenia", createdAt: now)
        ]
        sentenceRepository.findAll() >> sentences

        when:
        def result = sentenceService.getAllSentences()

        then:
        result.size() == 2
        result[0].id == 2L // Most recent first
        result[0].englishText == "Goodbye"
        result[0].polishText == "Do widzenia"
        result[1].id == 1L
        result[1].englishText == "Hello"
        result[1].polishText == "Cześć"
    }

    def "getAllSentences should sort by createdAt ascending when specified"() {
        given:
        def now = LocalDateTime.now()
        def sentences = [
            new Sentence(id: 1L, englishText: "Hello", polishText: "Cześć", createdAt: now.minusDays(1)),
            new Sentence(id: 2L, englishText: "Goodbye", polishText: "Do widzenia", createdAt: now)
        ]
        sentenceRepository.findAll() >> sentences

        when:
        def result = sentenceService.getAllSentences("createdAtAsc")

        then:
        result.size() == 2
        result[0].id == 1L // Oldest first
        result[1].id == 2L
    }

    def "getSentenceById should return the sentence if found"() {
        given:
        def now = LocalDateTime.now()
        def sentence = new Sentence(
            id: 1L, 
            englishText: "Hello", 
            polishText: "Cześć", 
            pronunciation: "həˈloʊ",
            createdAt: now,
            updatedAt: now
        )
        sentenceRepository.findById(1L) >> Optional.of(sentence)

        when:
        def result = sentenceService.getSentenceById(1L)

        then:
        result.id == 1L
        result.englishText == "Hello"
        result.polishText == "Cześć"
        result.pronunciation == "həˈloʊ"
        result.createdAt == now
        result.updatedAt == now
    }

    def "getSentenceById should throw exception if not found"() {
        given:
        sentenceRepository.findById(1L) >> Optional.empty()

        when:
        sentenceService.getSentenceById(1L)

        then:
        def ex = thrown(NoSuchElementException)
        ex.message == "Sentence not found with ID: 1"
    }

    def "createSentence should save and return the sentence"() {
        given:
        def requestDto = new SentenceRequestDto("Hello", "Cześć", "həˈloʊ")
        def savedSentence = new Sentence(id: 1L, englishText: "Hello", polishText: "Cześć", pronunciation: "həˈloʊ")
        
        when:
        def result = sentenceService.createSentence(requestDto)

        then:
        1 * sentenceRepository.save(_ as Sentence) >> { Sentence sentence ->
            assert sentence.englishText == "Hello"
            assert sentence.polishText == "Cześć"
            assert sentence.pronunciation == "həˈloʊ"
            assert sentence.id == null // New entity
            return savedSentence
        }
        
        and:
        result.id == 1L
        result.englishText == "Hello"
        result.polishText == "Cześć"
        result.pronunciation == "həˈloʊ"
    }

    def "createSentence should handle null pronunciation"() {
        given:
        def requestDto = new SentenceRequestDto("Hello", "Cześć", null)
        def savedSentence = new Sentence(id: 1L, englishText: "Hello", polishText: "Cześć", pronunciation: null)
        
        when:
        def result = sentenceService.createSentence(requestDto)

        then:
        1 * sentenceRepository.save(_ as Sentence) >> { Sentence sentence ->
            assert sentence.pronunciation == null
            return savedSentence
        }
        
        and:
        result.pronunciation == null
    }

    def "updateSentence should update and return the sentence if found"() {
        given:
        def now = LocalDateTime.now()
        def existingSentence = new Sentence(id: 1L, englishText: "Old", polishText: "Stary", createdAt: now, updatedAt: now)
        def requestDto = new SentenceRequestDto("New", "Nowy", "nuː")
        def updatedSentence = new Sentence(id: 1L, englishText: "New", polishText: "Nowy", pronunciation: "nuː", createdAt: now, updatedAt: now.plusMinutes(1))
        
        sentenceRepository.findById(1L) >> Optional.of(existingSentence)
        
        when:
        def result = sentenceService.updateSentence(1L, requestDto)

        then:
        1 * sentenceRepository.save(_ as Sentence) >> { Sentence sentence ->
            assert sentence.id == 1L
            assert sentence.englishText == "New"
            assert sentence.polishText == "Nowy"
            assert sentence.pronunciation == "nuː"
            assert sentence.createdAt == now // Should preserve original creation time
            assert sentence.updatedAt.isAfter(now) // Should update timestamp
            return updatedSentence
        }
        
        and:
        result.id == 1L
        result.englishText == "New"
        result.polishText == "Nowy"
        result.pronunciation == "nuː"
    }

    def "updateSentence should throw exception if not found"() {
        given:
        def requestDto = new SentenceRequestDto("New", "Nowy", null)
        sentenceRepository.findById(1L) >> Optional.empty()
        
        when:
        sentenceService.updateSentence(1L, requestDto)

        then:
        def ex = thrown(NoSuchElementException)
        ex.message == "Sentence not found with ID: 1"
        0 * sentenceRepository.save(_)
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
        def ex = thrown(NoSuchElementException)
        ex.message == "Sentence not found with ID: 1"
        0 * sentenceRepository.deleteById(_)
    }

    def "searchSentences should return sentences matching search text"() {
        given:
        def sentences = [
            new Sentence(id: 1L, englishText: "Hello world", polishText: "Cześć świecie"),
            new Sentence(id: 2L, englishText: "Good morning", polishText: "Dzień dobry")
        ]
        sentenceRepository.findByEnglishTextContainingIgnoreCaseOrPolishTextContainingIgnoreCase("Hello", "Hello") >> [sentences[0]]

        when:
        def result = sentenceService.searchSentences("Hello")

        then:
        result.size() == 1
        result[0].id == 1L
        result[0].englishText == "Hello world"
        result[0].polishText == "Cześć świecie"
    }

    def "searchSentences should return empty list when no matches found"() {
        given:
        sentenceRepository.findByEnglishTextContainingIgnoreCaseOrPolishTextContainingIgnoreCase("xyz", "xyz") >> []

        when:
        def result = sentenceService.searchSentences("xyz")

        then:
        result.isEmpty()
    }

    def "should handle empty repository"() {
        given:
        sentenceRepository.findAll() >> []

        when:
        def result = sentenceService.getAllSentences()

        then:
        result.isEmpty()
    }

    def "should handle invalid sort parameter"() {
        given:
        def sentences = [new Sentence(id: 1L, englishText: "Test", polishText: "Test")]
        sentenceRepository.findAll() >> sentences

        when:
        def result = sentenceService.getAllSentences("invalidSort")

        then:
        result.size() == 1
        // Should default to createdAt desc
    }
}
