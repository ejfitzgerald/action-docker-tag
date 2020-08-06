import * as core from '@actions/core'
import {exec as execOrig} from 'child_process'
import {promisify} from 'util'
import {generateTagListFromVersion} from './tags'

const exec = promisify(execOrig)

async function determineVersion(): Promise<string> {
  const {stdout} = await exec('git describe --tags --always --dirty=-wip')
  return stdout.trim()
}

async function buildDockerImage(
  dockerfile: string,
  context: string,
  repo: string,
  tag: string,
): Promise<void> {
  await exec(`docker build -f "${dockerfile}" -t ${repo}:${tag} "${context}"`)
  return
}

async function tagDockerImage(
  repo: string,
  orig_tag: string,
  new_tag: string,
): Promise<void> {
  const original = `${repo}:${orig_tag}`
  const destination = `${repo}:${new_tag}`

  await exec(`docker tag ${original} ${destination}`)
  return
}

async function run(): Promise<void> {
  try {

    // determine the version for the project
    const projectVersion = await determineVersion()
    core.debug(`Detected Version: ${projectVersion}`)

    // generate the set of targets for the build
    const tags = generateTagListFromVersion(projectVersion)
    if (tags.length === 0) {
      core.setFailed('Unable to generate tags for this revision')
      // return
    }

    // build the docker image
    const repo: string = core.getInput('repo', {required: true})
    const dockerfile: string = core.getInput('dockerfile') || 'Dockerfile'
    const context: string = core.getInput('context') || '.'

    core.debug(`dockerfile = ${dockerfile}`)
    core.debug(`context = ${context}`)

    // build the docker image
    await buildDockerImage(dockerfile, context, repo, tags[0])

    // core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    //
    // core.debug(new Date().toTimeString())
    // await wait(parseInt(ms, 10))
    // core.debug(new Date().toTimeString())
    //
    // core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
