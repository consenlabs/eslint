const path = require('path')
const { version } = require('../package.json')
const { constants } = require('fs')
const fs = require('fs/promises')
const packagesPath = path.join(__dirname, '../packages')

const PACKAGE_FILE_NAME = 'package.json'

const exits = path =>
  fs
    .access(path, constants.F_OK)
    .then(() => true)
    .catch(() => false)

const findPackages = packages =>
  packages.map(async package => {
    const rootPackagePath = path.join(package, PACKAGE_FILE_NAME)
    const isRootPackageExists = await exits(rootPackagePath)
    const packageStat = await fs.stat(package)

    if (isRootPackageExists) {
      return rootPackagePath
    }

    return packageStat.isDirectory()
      ? findPackages((await fs.readdir(package)).map(file => path.join(package, file)))
      : null
  })

const flatPromises = async packages => {
  const res = []

  for (const package of packages) {
    const value = await package

    res.push(Array.isArray(value) ? await flatPromises(value) : value)
  }

  return res.flat()
}

const main = async () => {
  const files = await fs.readdir(packagesPath)
  const packageJSONs = await flatPromises(
    findPackages(files.map(file => path.join(packagesPath, file))),
  )

  for (const packageJSON of packageJSONs) {
    const content = await fs.readFile(packageJSON, 'utf-8')

    await fs.writeFile(
      packageJSON,
      JSON.stringify(
        {
          ...JSON.parse(content),
          version,
        },
        null,
        2,
      ),
    )
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
