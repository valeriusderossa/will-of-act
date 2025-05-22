package org.woa.repository

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager
import org.woa.entity.Sentence
import spock.lang.Specification

@DataJpaTest
class SentenceRepositoryTest extends Specification {

    @Autowired
    TestEntityManager entityManager

    @Autowired
    SentenceRepository sentenceRepository

    def "should find sentences by English text containing ignore case"() {
        given:
        def sentence1 = new Sentence(englishText: "Hello World", polishText: "Cześć Świecie")
        def sentence2 = new Sentence(englishText: "Good Morning", polishText: "Dzień Dobry")
        def sentence3 = new Sentence(englishText: "hello friend", polishText: "cześć przyjacielu")
        
        entityManager.persist(sentence1)
        entityManager.persist(sentence2)
        entityManager.persist(sentence3)
        entityManager.flush()

        when:
        def results = sentenceRepository.findByEnglishTextContainingIgnoreCaseOrPolishTextContainingIgnoreCase("hello", "hello")

        then:
        results.size() == 2
        results*.englishText.containsAll(["Hello World", "hello friend"])
    }

    def "should find sentences by Polish text containing ignore case"() {
        given:
        def sentence1 = new Sentence(englishText: "Hello", polishText: "Cześć Świecie")
        def sentence2 = new Sentence(englishText: "Good Morning", polishText: "Dzień Dobry")
        def sentence3 = new Sentence(englishText: "Goodbye", polishText: "cześć na razie")
        
        entityManager.persist(sentence1)
        entityManager.persist(sentence2)
        entityManager.persist(sentence3)
        entityManager.flush()

        when:
        def results = sentenceRepository.findByEnglishTextContainingIgnoreCaseOrPolishTextContainingIgnoreCase("cześć", "cześć")

        then:
        results.size() == 2
        results*.polishText.containsAll(["Cześć Świecie", "cześć na razie"])
    }

    def "should return empty list when no matches found"() {
        given:
        def sentence = new Sentence(englishText: "Hello", polishText: "Cześć")
        entityManager.persist(sentence)
        entityManager.flush()

        when:
        def results = sentenceRepository.findByEnglishTextContainingIgnoreCaseOrPolishTextContainingIgnoreCase("xyz", "xyz")

        then:
        results.isEmpty()
    }

    def "should find sentences with mixed case search"() {
        given:
        def sentence = new Sentence(englishText: "HELLO WORLD", polishText: "cześć świecie")
        entityManager.persist(sentence)
        entityManager.flush()

        when:
        def results = sentenceRepository.findByEnglishTextContainingIgnoreCaseOrPolishTextContainingIgnoreCase("hello", "hello")

        then:
        results.size() == 1
        results[0].englishText == "HELLO WORLD"
    }

    def "should find sentences by partial match"() {
        given:
        def sentence = new Sentence(englishText: "How are you today?", polishText: "Jak się masz dzisiaj?")
        entityManager.persist(sentence)
        entityManager.flush()

        when:
        def results = sentenceRepository.findByEnglishTextContainingIgnoreCaseOrPolishTextContainingIgnoreCase("are", "are")

        then:
        results.size() == 1
        results[0].englishText == "How are you today?"
    }
}
