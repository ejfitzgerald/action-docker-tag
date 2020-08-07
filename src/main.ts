import * as core from '@actions/core'
import {generateTagListFromVersion} from './tags'
import {exec, ExecOptions} from '@actions/exec'

async function determineVersion(): Promise<string> {
  let execOutput = ''
  const options: ExecOptions = {}
  options.listeners = {
    stdout: (data: Buffer) => {
      execOutput += data.toString()
    },
  }
  await exec('git', ['describe', '--tags', '--always', '--dirty=-wip'], options)

  return execOutput.trim()
}

async function buildDockerImage(
  dockerfile: string,
  context: string,
  repo: string,
  tag: string,
  target: string,
): Promise<void> {
  const args = ['build', '-f', dockerfile, '-t', `${repo}:${tag}`]

  if (target !== '') {
    args.push(...['--target', target])
  }
  args.push(context)

  await exec('docker', args)
  return
}

async function tagDockerImage(
  repo: string,
  orig_tag: string,
  new_tag: string,
): Promise<void> {
  const original = `${repo}:${orig_tag}`
  const destination = `${repo}:${new_tag}`

  await exec('docker', ['tag', original, destination])
  return
}

async function pushDockerImage(repo: string, tag: string): Promise<void> {
  const imageRef = `${repo}:${tag}`

  await exec('docker', ['push', imageRef])
  return
}

async function run(): Promise<void> {
  try {
    // determine the version for the project
    const projectVersion = await determineVersion()
    core.info(`Detected Version: ${projectVersion}`)

    // generate the set of targets for the build
    const tags = generateTagListFromVersion(projectVersion)
    if (tags.length === 0) {
      core.setFailed(
        `Unable to generate tags for this revision: ${projectVersion}`,
      )
      return
    }

    core.info(`Tags to generate: ${tags}`)

    // build the docker image
    const repo: string = core.getInput('repo', {required: true})
    const dockerfile: string = core.getInput('dockerfile') || 'Dockerfile'
    const context: string = core.getInput('context') || '.'
    const target: string = core.getInput('target') || ''

    // build the docker image
    await buildDockerImage(dockerfile, context, repo, tags[0], target)

    // tag the remaining images
    for (let i = 1; i < tags.length; ++i) {
      await tagDockerImage(repo, tags[0], tags[i])
    }

    // push the images
    for (const tag of tags) {
      await pushDockerImage(repo, tag)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
