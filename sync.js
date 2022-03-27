const fs = require('fs');
const github = require('./github.json');
const npm = require('./npm.json');

// curl https://registry.npmjs.org/swagger-ui-dist/latest > npm.json
// curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/ke4nec/swagger-ui-electron/releases/latest > npm.json

(async () => {
  console.log(npm.version)
  console.log(github.tag_name)
  console.log(github.tag_name < npm.version)
  if (github.tag_name < npm.version) {
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
