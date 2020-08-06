import * as core from '@actions/core'
import {wait} from './wait'
import {exec as execOrig} from 'child_process'
import {promisify} from 'util'

const exec = promisify(execOrig);

async function determineVersion(): Promise<string> {
  const result = await exec('git describe --tags --always --dirty=-wip')
  console.log(result)

  return ''
}

async function run(): Promise<void> {
  try {
    const [err, stdout, stderr] = await determineVersion()
    core.debug(`Version: ${stdout}`)
    // const ms: string = core.getInput('milliseconds')
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
