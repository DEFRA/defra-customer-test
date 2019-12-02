task default -depends Test

task Test -depends Install, CreateOutputDir -Description  "Run node cucumber tests" {
    Exec {npm run test:chrome-api-test}
}

task Install -Description "Adds required node modules into bin folder" {
    Exec {npm install}
}

task CreateOutputDir -Description "Adds required node modules into bin folder" {
    if(!(Test-Path "./Reports/")){
        New-Item "Reports\" -ItemType "directory"
    }
}