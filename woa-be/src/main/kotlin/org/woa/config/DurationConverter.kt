package org.woa.config

import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter
import java.time.Duration

@Converter(autoApply = true)
class DurationConverter : AttributeConverter<Duration, Long> {
    
    override fun convertToDatabaseColumn(duration: Duration?): Long? {
        return duration?.toSeconds()
    }
    
    override fun convertToEntityAttribute(seconds: Long?): Duration? {
        return seconds?.let { Duration.ofSeconds(it) }
    }
}
