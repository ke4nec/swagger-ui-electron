const fs = require('fs');
const github = require('./github.json');
const npm = require('./npm.json');

// curl https://registry.npmjs.org/swagger-ui-dist/latest > npm.json
// curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/ke4nec/swagger-ui-electron/releases/latest > npm.json

(async () => {
  console.log(npm.version)
  console.log(github.tag_name)
  console.log(github.tag_name < npm.version)
  
  const tagName = parseInt(github.tag_name.split('.').join(''))
  const version = parseInt(npm.version.split('.').join(''))
  
  if (isNaN(tagName) || isNaN(version)) {
    process.exit(0)
  }
  
  if (tagName < version) {
    try {
      fs.writeFileSync('./ver.txt', npm.version)
    } catch (err) {
      console.error(err)
    }

    process.exit(0)
  } else {
    process.exit(1)
  }
})()
