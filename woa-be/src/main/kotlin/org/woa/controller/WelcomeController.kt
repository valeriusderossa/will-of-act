package org.woa.controller

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.env.Environment
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.net.InetAddress
import java.time.LocalDateTime
import javax.sql.DataSource

@RestController
class WelcomeController(
    @Autowired private val env: Environment,
    @Autowired private val dataSource: DataSource
) {
    private val logger = LoggerFactory.getLogger(WelcomeController::class.java)
    
    @GetMapping("/")
    fun welcome(): Map<String, Any> {
        val response = mutableMapOf(
            "message" to "Welcome to Will of Act API",
            "timestamp" to LocalDateTime.now().toString(),
            "status" to "UP",
            "profiles" to env.activeProfiles.toList(),
            "hostname" to InetAddress.getLocalHost().hostName
        )
        
        try {
            val jdbcTemplate = JdbcTemplate(dataSource)
            val dbStatus = jdbcTemplate.queryForObject(
                "SELECT 'connected' as status",
                Map::class.java
            )
            response["database"] = dbStatus ?: "unknown"
        } catch (e: Exception) {
            logger.error("Error checking database connection", e)
            response["database"] = "error: ${e.message}"
        }
        
        return response
    }
    
    @GetMapping("/api/health")
    fun health(): Map<String, Any> {
        val health = mutableMapOf<String, Any>(
            "status" to "UP",
            "timestamp" to LocalDateTime.now().toString()
        )
        
        // Add component health checks
        val components = mutableMapOf<String, Any>()
        
        try {
            val jdbcTemplate = JdbcTemplate(dataSource)
            val dbResult = jdbcTemplate.queryForObject(
                "SELECT version() as version",
                Map::class.java
            )
            components["database"] = mapOf(
                "status" to "UP",
                "details" to (dbResult ?: mapOf<String, Any>())
            )
        } catch (e: Exception) {
            logger.error("Database health check failed", e)
            components["database"] = mapOf(
                "status" to "DOWN",
                "error" to e.message
            )
            health["status"] = "WARNING"
        }
        
        health["components"] = components
        return health
    }
}
