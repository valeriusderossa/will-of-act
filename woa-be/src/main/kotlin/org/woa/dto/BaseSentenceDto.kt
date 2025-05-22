package org.woa.dto

sealed class BaseSentenceDto {
    abstract val englishText: String
    abstract val polishText: String
}
