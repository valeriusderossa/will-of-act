package org.woa.config

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.annotation.Configuration
import org.springframework.context.event.EventListener
import org.springframework.core.env.Environment
import javax.sql.DataSource

/**
 * Database configuration and verification.
 */
@Configuration
class DatabaseConfig(
    private val dataSource: DataSource,
    @Autowired private val env: Environment
) {
    
    private val logger = LoggerFactory.getLogger(DatabaseConfig::class.java)
    
    /**
     * Verifies database connection on application startup.
     */
    @EventListener(ApplicationReadyEvent::class)
    fun verifyDatabaseConnection() {
        logger.info("Active profiles: ${env.activeProfiles.joinToString()}")
        
        try {
            dataSource.connection.use { connection ->
                val dbUrl = connection.metaData.url
                val dbProduct = connection.metaData.databaseProductName
                val dbVersion = connection.metaData.databaseProductVersion
                
                logger.info("Successfully connected to database:")
                logger.info("- URL: $dbUrl")
                logger.info("- Product: $dbProduct")
                logger.info("- Version: $dbVersion")
            }
        } catch (e: Exception) {
            logger.error("Failed to connect to database. Check your datasource configuration in application-${env.activeProfiles.firstOrNull() ?: "default"}.yml", e)
            // We'll log but not throw an exception to allow the application to start even with DB issues
        }
    }
}
