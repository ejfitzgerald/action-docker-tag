import {toSemVer, VersionInfo, parseVersion} from './version'

export function generateTagList(info: VersionInfo): string[] {
  const tags = [toSemVer(info)]

  if (info.channel === 'release' && info.commit === '') {
    if (info.minor !== 0) {
      tags.push(`${info.major}.${info.minor}`)

      if (info.major !== 0) {
        tags.push(`${info.major}`)
      }
    }
  }

  return tags
}

export function generateTagListFromVersion(version: string): string[] {
  const info = parseVersion(version)
  if (info === undefined) {
    return []
  }

  return generateTagList(info)
}
