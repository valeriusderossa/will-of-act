package org.woa.exception

import org.springframework.http.HttpStatus
import org.springframework.web.context.request.WebRequest
import spock.lang.Specification

class GlobalExceptionHandlerTest extends Specification {

    GlobalExceptionHandler exceptionHandler = new GlobalExceptionHandler()
    WebRequest webRequest = Mock()

    def setup() {
        webRequest.getDescription(false) >> "uri=/api/test"
    }

    def "should handle NoSuchElementException"() {
        given:
        def exception = new NoSuchElementException("Resource not found")

        when:
        def response = exceptionHandler.handleNoSuchElementException(exception, webRequest)

        then:
        response.statusCode == HttpStatus.NOT_FOUND
        response.body.status == 404
        response.body.error == "Not Found"
        response.body.message == "Resource not found"
        response.body.path == "/api/test"
        response.body.timestamp != null
    }

    def "should handle NoSuchElementException with null message"() {
        given:
        def exception = new NoSuchElementException()

        when:
        def response = exceptionHandler.handleNoSuchElementException(exception, webRequest)

        then:
        response.statusCode == HttpStatus.NOT_FOUND
        response.body.message == "Resource not found"
    }

    def "should handle IllegalArgumentException"() {
        given:
        def exception = new IllegalArgumentException("Invalid input")

        when:
        def response = exceptionHandler.handleIllegalArgumentException(exception, webRequest)

        then:
        response.statusCode == HttpStatus.BAD_REQUEST
        response.body.status == 400
        response.body.error == "Bad Request"
        response.body.message == "Invalid input"
        response.body.path == "/api/test"
    }

    def "should handle IllegalArgumentException with null message"() {
        given:
        def exception = new IllegalArgumentException()

        when:
        def response = exceptionHandler.handleIllegalArgumentException(exception, webRequest)

        then:
        response.statusCode == HttpStatus.BAD_REQUEST
        response.body.message == "Invalid request"
    }

    def "should handle general Exception"() {
        given:
        def exception = new RuntimeException("Unexpected error")

        when:
        def response = exceptionHandler.handleGeneralException(exception, webRequest)

        then:
        response.statusCode == HttpStatus.INTERNAL_SERVER_ERROR
        response.body.status == 500
        response.body.error == "Internal Server Error"
        response.body.message == "Unexpected error"
        response.body.path == "/api/test"
    }

    def "should handle general Exception with null message"() {
        given:
        def exception = new RuntimeException()

        when:
        def response = exceptionHandler.handleGeneralException(exception, webRequest)

        then:
        response.statusCode == HttpStatus.INTERNAL_SERVER_ERROR
        response.body.message == "An unexpected error occurred"
    }
}
