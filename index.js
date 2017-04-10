const fs = require('fs')
const readPkg = require('read-pkg')
const path = require('path')

module.exports = (testResults) => {

  const results = testResults.testResults
  const suites = results.map(function(a) {return a.testResults})
  const packagedData = readPkg.sync(process.cwd())
  const resultSet = []

  suites.forEach(function(suite) {

    Object.keys(suite).forEach(function(testName){
      const test = suite[testName]
      const testCase = {}

      testCase.test_purpose = 'unit test'
      testCase.test_suite_name = test.fullName
      testCase.test_case = test.title
      testCase.test_status = test.status

      if (test.failureMessages.length != 0) {
        testCase.error_description = test.failureMessages
      }

      testCase.test_duration = test.duration

      testCase.project_name = packagedData.name
      testCase.project_version = packagedData.version
      // testCase.build_number
      // testCase.branch_name

      resultSet.push(testCase)
    })
    return resultSet
  })

// get timestamp
  function timeStamp () {
    const now = new Date()
    const date = [now.getUTCFullYear(), now.getUTCDate(), now.getUTCMonth() + 1]
    const time = [now.getUTCHours(), now.getUTCMinutes(), now.getUTCMilliseconds()]
    return date.join('') + '-' + time.join('')
  }

// Create directory or use already excisted
  function getDir() {
    const dir = './reports'
    try {
      if (!fs.existsSync(dir)) {
        console.log('Creating ' + dir + ' directory')
        fs.mkdirSync(dir)
      } else
      console.log('Directory ' + dir + ' is exist')
      return dir
    } catch(e) {
    if (e) throw e;
    }
  }

  const testResultsString = JSON.stringify(resultSet)
  const fileName = 'unitTest' + '_' + packagedData.name + '_' + packagedData.version + '_' + 'build' + '-' + '1' + '_' + timeStamp() + '.json'

  const filepath = path.join(getDir(), fileName)

  fs.writeFile(filepath, testResultsString, (err) => {
    if (err) {
      console.warn('Unable to write test results JSON', err)
    }
    return 1
  })

  return 0
}
