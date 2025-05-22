package org.woa.controller

import com.fasterxml.jackson.databind.ObjectMapper
import org.spockframework.spring.SpringBean
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.woa.dto.AffirmationRequestDto
import org.woa.dto.AffirmationResponseDto
import org.woa.service.AffirmationService
import spock.lang.Specification

import java.time.LocalDateTime

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

@WebMvcTest(AffirmationController.class)
@AutoConfigureMockMvc
class AffirmationControllerIntegrationTest extends Specification {

    @Autowired
    private MockMvc mockMvc

    @Autowired
    private ObjectMapper objectMapper

    @SpringBean
    AffirmationService affirmationService = Mock()

    def "should return all affirmations"() {
        given:
        def now = LocalDateTime.now()
        def affirmations = [
            new AffirmationResponseDto(1L, "Test affirmation 1", now, now),
            new AffirmationResponseDto(2L, "Test affirmation 2", now, now)
        ]
        affirmationService.getAllAffirmations("createdAt") >> affirmations

        when:
        def result = mockMvc.perform(get("/api/affirmations"))

        then:
        result.andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath('$').isArray())
            .andExpect(jsonPath('$.length()').value(2))
            .andExpect(jsonPath('$[0].id').value(1))
            .andExpect(jsonPath('$[0].text').value("Test affirmation 1"))
            .andExpect(jsonPath('$[1].id').value(2))
            .andExpect(jsonPath('$[1].text').value("Test affirmation 2"))
    }

    def "should return all affirmations with custom sort parameter"() {
        given:
        def now = LocalDateTime.now()
        def affirmations = [
            new AffirmationResponseDto(1L, "First", now.minusDays(1), now.minusDays(1)),
            new AffirmationResponseDto(2L, "Second", now, now)
        ]
        affirmationService.getAllAffirmations("createdAtAsc") >> affirmations

        when:
        def result = mockMvc.perform(get("/api/affirmations?sortBy=createdAtAsc"))

        then:
        result.andExpect(status().isOk())
            .andExpect(jsonPath('$[0].id').value(1))
            .andExpect(jsonPath('$[0].text').value("First"))
    }

    def "should get affirmation by id when it exists"() {
        given:
        def now = LocalDateTime.now()
        def affirmation = new AffirmationResponseDto(1L, "Test affirmation", now, now)
        affirmationService.getAffirmationById(1L) >> affirmation

        when:
        def result = mockMvc.perform(get("/api/affirmations/1"))

        then:
        result.andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath('$.id').value(1))
            .andExpect(jsonPath('$.text').value("Test affirmation"))
            .andExpect(jsonPath('$.createdAt').exists())
    }

    def "should return 404 when getting non-existent affirmation"() {
        given:
        affirmationService.getAffirmationById(999L) >> { throw new NoSuchElementException("Affirmation not found with ID: 999") }

        when:
        def result = mockMvc.perform(get("/api/affirmations/999"))

        then:
        result.andExpect(status().isNotFound())
    }

    def "should create a new affirmation"() {
        given:
        def now = LocalDateTime.now()
        def requestDto = new AffirmationRequestDto("New affirmation")
        def responseDto = new AffirmationResponseDto(1L, "New affirmation", now, now)
        affirmationService.createAffirmation(_ as AffirmationRequestDto) >> responseDto

        when:
        def result = mockMvc.perform(post("/api/affirmations")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(requestDto)))

        then:
        result.andExpect(status().isCreated())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath('$.id').value(1))
            .andExpect(jsonPath('$.text').value("New affirmation"))
    }

    def "should handle malformed JSON when creating affirmation"() {
        when:
        def result = mockMvc.perform(post("/api/affirmations")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{invalid json}"))

        then:
        result.andExpect(status().isBadRequest())
    }

    def "should update an existing affirmation"() {
        given:
        def now = LocalDateTime.now()
        def requestDto = new AffirmationRequestDto("Updated affirmation")
        def responseDto = new AffirmationResponseDto(1L, "Updated affirmation", now, now)
        affirmationService.updateAffirmation(1L, _ as AffirmationRequestDto) >> responseDto

        when:
        def result = mockMvc.perform(put("/api/affirmations/1")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(requestDto)))

        then:
        result.andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath('$.id').value(1))
            .andExpect(jsonPath('$.text').value("Updated affirmation"))
    }

    def "should return 404 when updating non-existent affirmation"() {
        given:
        def requestDto = new AffirmationRequestDto("Updated affirmation")
        affirmationService.updateAffirmation(999L, _ as AffirmationRequestDto) >> { 
            throw new NoSuchElementException("Affirmation not found with ID: 999") 
        }

        when:
        def result = mockMvc.perform(put("/api/affirmations/999")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(requestDto)))

        then:
        result.andExpect(status().isNotFound())
    }
    
    def "should delete an existing affirmation"() {
        when:
        def result = mockMvc.perform(delete("/api/affirmations/1"))
        
        then:
        1 * affirmationService.deleteAffirmation(1L)
        result.andExpect(status().isNoContent())
    }
    
    def "should return 404 when deleting non-existent affirmation"() {
        given:
        affirmationService.deleteAffirmation(999L) >> { 
            throw new NoSuchElementException("Affirmation not found with ID: 999") 
        }
        
        when:
        def result = mockMvc.perform(delete("/api/affirmations/999"))
        
        then:
        result.andExpect(status().isNotFound())
    }

    def "should handle invalid path parameter"() {
        when:
        def result = mockMvc.perform(get("/api/affirmations/invalid"))

        then:
        result.andExpect(status().isBadRequest())
    }

    def "should return empty array when no affirmations exist"() {
        given:
        affirmationService.getAllAffirmations("createdAt") >> []

        when:
        def result = mockMvc.perform(get("/api/affirmations"))

        then:
        result.andExpect(status().isOk())
            .andExpect(jsonPath('$').isArray())
            .andExpect(jsonPath('$.length()').value(0))
    }
}
