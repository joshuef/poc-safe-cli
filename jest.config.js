module.exports = {
    coverageReporters: [ 'lcov'],
    transform : {
        "^.+\\.jsx?$" : "babel-jest"
    },
    testRegex : "(/__tests__/.spec.js|(\\.|/)(test|spec))\\.jsx?$"
}
