package org.woa

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class WoaBeApplication

fun main(args: Array<String>) {
    runApplication<WoaBeApplication>(*args)
}
