package org.woa.controller

import com.fasterxml.jackson.databind.ObjectMapper
import org.spockframework.spring.SpringBean
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.woa.dto.SentenceRequestDto
import org.woa.dto.SentenceResponseDto
import org.woa.service.SentenceService
import spock.lang.Specification

import java.time.LocalDateTime

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

@WebMvcTest(SentenceController.class)
@AutoConfigureMockMvc
class SentenceControllerIntegrationTest extends Specification {

    @Autowired
    private MockMvc mockMvc

    @Autowired
    private ObjectMapper objectMapper

    @SpringBean
    SentenceService sentenceService = Mock()

    def "should return all sentences"() {
        given:
        def now = LocalDateTime.now()
        def sentences = [
            new SentenceResponseDto(1L, "Hello", "Cześć", "həˈloʊ", now, now),
            new SentenceResponseDto(2L, "Goodbye", "Do widzenia", "ɡʊdˈbaɪ", now, now)
        ]
        sentenceService.getAllSentences("createdAt") >> sentences

        when:
        def result = mockMvc.perform(get("/api/sentences"))

        then:
        result.andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath('$').isArray())
            .andExpect(jsonPath('$.length()').value(2))
            .andExpect(jsonPath('$[0].id').value(1))
            .andExpect(jsonPath('$[0].englishText').value("Hello"))
            .andExpect(jsonPath('$[0].polishText').value("Cześć"))
            .andExpect(jsonPath('$[0].pronunciation').value("həˈloʊ"))
    }

    def "should create a new sentence"() {
        given:
        def now = LocalDateTime.now()
        def requestDto = new SentenceRequestDto("Hello", "Cześć", "həˈloʊ")
        def responseDto = new SentenceResponseDto(1L, "Hello", "Cześć", "həˈloʊ", now, now)
        sentenceService.createSentence(_ as SentenceRequestDto) >> responseDto

        when:
        def result = mockMvc.perform(post("/api/sentences")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(requestDto)))

        then:
        result.andExpect(status().isCreated())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath('$.id').value(1))
            .andExpect(jsonPath('$.englishText').value("Hello"))
            .andExpect(jsonPath('$.polishText').value("Cześć"))
    }

    def "should search sentences by text"() {
        given:
        def now = LocalDateTime.now()
        def sentences = [
            new SentenceResponseDto(1L, "Hello world", "Cześć świecie", "həˈloʊ wɜːrld", now, now)
        ]
        sentenceService.searchSentences("Hello") >> sentences

        when:
        def result = mockMvc.perform(get("/api/sentences/search?searchText=Hello"))

        then:
        result.andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath('$').isArray())
            .andExpect(jsonPath('$.length()').value(1))
            .andExpect(jsonPath('$[0].englishText').value("Hello world"))
    }

    def "should delete an existing sentence"() {
        when:
        def result = mockMvc.perform(delete("/api/sentences/1"))

        then:
        1 * sentenceService.deleteSentence(1L)
        result.andExpect(status().isNoContent())
    }
}
