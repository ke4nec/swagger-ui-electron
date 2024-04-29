const fs = require('fs');
const github = require('./github.json');
const npm = require('./npm.json');

// curl https://registry.npmjs.org/swagger-ui-dist/latest > npm.json
// curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/ke4nec/swagger-ui-electron/releases/latest > npm.json

(async () => {
  console.log(npm.version)
  console.log(github.tag_name)
  // console.log(github.tag_name < npm.version)
  
  const tagNames = github.tag_name.split('.')
  const versions = npm.version.split('.')

  for (let i = 0; i < Math.min(tagNames.length, versions.length); i++) {
    const ver1 = parseInt(tagNames[i])
    const ver2 = parseInt(versions[i])
    if (isNaN(ver1) || isNaN(ver2)) {
      process.exit(0)
    }

    if (ver1 < ver2) {
      try {
        console.log('need update')
        fs.writeFileSync('./ver.txt', npm.version)
      } catch (err) {
        console.error(err)
      }

      process.exit(0)
    }
  }

  process.exit(1)
})()
