task default -depends Test

task Test -depends Install -Description  "Run node cucumber tests" {
    Exec {npm run test:chrome-api-test}
}

task Install -Description "Adds required node modules into bin folder" {
    Exec {npm install}
}

