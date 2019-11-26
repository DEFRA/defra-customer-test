task default -depends Test

task Test -Description "Run node cucumber tests" {
    Exec {npm run test:chrome-api-test}
}
