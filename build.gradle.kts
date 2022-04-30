@file:Suppress("DSL_SCOPE_VIOLATION")

import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.jlleitschuh.gradle.ktlint.KtlintBasePlugin
import org.jlleitschuh.gradle.ktlint.KtlintExtension

plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.ktlint)
}

group = "me.ghostbear"
version = "1.3.3"

tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = JavaVersion.VERSION_17.toString()
}

tasks.build {
    dependsOn(tasks.ktlintFormat)
}

allprojects {
    apply<KtlintBasePlugin>()
    configure<KtlintExtension> {
        ignoreFailures.set(true)
        outputColorName.set("RED")
    }
}
