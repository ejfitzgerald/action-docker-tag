import {match} from 'assert'

export interface VersionInfo {
  channel: 'release' | 'rc' | 'beta' | 'alpha' | 'dev'
  major: number
  minor: number
  patch: number
  build: number
  commit: string
  dirty: boolean
}

const versionPattern = /^v(\d+)\.(\d+)\.(\d+)[-.]?(?:(alpha|beta|rc)(\d+))?(?:-\d+-g([a-f0-9]{7,})(?:-(wip|dirty))?)?$/

export function toSemVer(info: VersionInfo): string {
  const base = `${info.major}.${info.minor}.${info.patch}`

  let build = ''
  let preRelease = ''
  if (info.channel !== 'release') {
    const channel = info.commit !== '' ? 'dev' : info.channel

    let buildNum = 0
    if (info.commit === '' && channel !== 'dev') {
      buildNum = info.build
    }

    preRelease = `-${channel}`
    if (buildNum > 0) {
      preRelease += buildNum.toString()
    }
  }

  if (info.commit !== '') {
    build += `g${info.commit}`
  }

  // add the build
  if (build !== '') {
    build = `+${build}`
  }

  return `${base}${preRelease}${build}`
}

export function parseVersion(version: string): VersionInfo | undefined {

  // parse the version information
  const result = version.match(versionPattern)
  if (result === null) {
    return undefined
  }

  // select the channel and build
  let build = 0
  let channel: 'release' | 'rc' | 'beta' | 'alpha' | 'dev' = 'release'
  if (result[4]) {
    switch (result[4]) {
      case 'alpha':
      case 'beta':
      case 'rc':
        channel = result[4]
        build = parseInt(result[5])
        break
    }
  }

  // extract the
  const commit = result[6] ?? ''
  const dirty = !!result[7] // presence of any "-wip" or "-dirty" suffix

  // if there is any trailing version information then this is always a dev version
  if (commit !== '') {
    channel = 'dev'
    build = 0
  }

  return {
    channel,
    major: parseInt(result[1]),
    minor: parseInt(result[2]),
    patch: parseInt(result[3]),
    build,
    commit,
    dirty,
  }
}
