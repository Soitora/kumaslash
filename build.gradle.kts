@file:Suppress("DSL_SCOPE_VIOLATION")

import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.jlleitschuh.gradle.ktlint.KtlintBasePlugin
import org.jlleitschuh.gradle.ktlint.KtlintExtension

plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.ktlint)
    application
}

group = "me.ghostbear"
version = "1.0-SNAPSHOT"

dependencies {
    testImplementation(kotlin("test"))
    implementation(libs.kord.core)

    implementation(libs.kotlinx.serialization)
}

tasks.test {
    useJUnitPlatform()
}

tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = JavaVersion.VERSION_17.toString()
}

application {
    mainClass.set("KumaSlashApplicationKt")
}

tasks.jar {
    manifest.attributes["Main-Class"] = "me.ghostbear.kumaslash.KumaSlashApplicationKt"
    val dependencies = configurations
        .runtimeClasspath
        .get()
        .map(::zipTree) // OR .map { zipTree(it) }
    from(dependencies)
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
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
