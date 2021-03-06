import {parseVersion, toSemVer, VersionInfo} from '../src/version'
import each from 'jest-each'

describe('basic parsing tests', () => {
  each([
    [
      'v0.0.3beta9-1-ga4578d1',
      {
        channel: 'dev',
        major: 0,
        minor: 0,
        patch: 3,
        build: 0,
        commit: 'a4578d1',
      },
    ],
    [
      'v10.12.13',
      {
        channel: 'release',
        major: 10,
        minor: 12,
        patch: 13,
        build: 0,
        commit: '',
      },
    ],
    [
      'v1.2.3alpha1',
      {
        channel: 'alpha',
        major: 1,
        minor: 2,
        patch: 3,
        build: 1,
        commit: '',
      },
    ],
    [
      'v1.2.3rc2-1-gabcdef1',
      {
        channel: 'dev',
        major: 1,
        minor: 2,
        patch: 3,
        build: 0,
        commit: 'abcdef1',
      },
    ],
    [
      'v0.0.1-3-gef14a4a',
      {
        channel: 'dev',
        major: 0,
        minor: 0,
        patch: 1,
        build: 0,
        commit: 'ef14a4a',
      },
    ],
    [
      'v0.9.1-rc11',
      {
        channel: 'rc',
        major: 0,
        minor: 9,
        patch: 1,
        build: 11,
        commit: '',
      },
    ],
    [
      'v0.9.1.rc11',
      {
        channel: 'rc',
        major: 0,
        minor: 9,
        patch: 1,
        build: 11,
        commit: '',
      },
    ],
    [
      'v0.9.1rc11',
      {
        channel: 'rc',
        major: 0,
        minor: 9,
        patch: 1,
        build: 11,
        commit: '',
      },
    ],
    [
      'v0.9.1-alpha11',
      {
        channel: 'alpha',
        major: 0,
        minor: 9,
        patch: 1,
        build: 11,
        commit: '',
      },
    ],
    [
      'v0.9.1alpha11',
      {
        channel: 'alpha',
        major: 0,
        minor: 9,
        patch: 1,
        build: 11,
        commit: '',
      },
    ],
    [
      'v0.9.1.alpha11',
      {
        channel: 'alpha',
        major: 0,
        minor: 9,
        patch: 1,
        build: 11,
      },
    ],
    [
      'v0.9.1-beta11',
      {
        channel: 'beta',
        major: 0,
        minor: 9,
        patch: 1,
        build: 11,
        commit: '',
      },
    ],
    [
      'v0.9.1.beta11',
      {
        channel: 'beta',
        major: 0,
        minor: 9,
        patch: 1,
        build: 11,
        commit: '',
      },
    ],
    [
      'v0.9.1beta11',
      {
        channel: 'beta',
        major: 0,
        minor: 9,
        patch: 1,
        build: 11,
        commit: '',
      },
    ],
    [
      'v0.0.3beta9-1-ga4578d1-wip',
      {
        channel: 'dev',
        major: 0,
        minor: 0,
        patch: 3,
        build: 0,
        commit: 'a4578d1',
      },
    ],
  ]).it('parse: %s', (text, expected) => {
    expect(parseVersion(text)).toMatchObject(expected)
  })
})

describe('basic formatting tests', () => {
  each([
    [
      '1.2.3+ga4578d1',
      {
        channel: 'release',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        commit: 'a4578d1',
      },
    ],
    [
      '1.2.3',
      {
        channel: 'release',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        commit: '',
      },
    ],
    [
      '1.2.3-dev+ga4578d1',
      {
        channel: 'rc',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        commit: 'a4578d1',
      },
    ],
    [
      '1.2.3-rc4',
      {
        channel: 'rc',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        commit: '',
      },
    ],
    [
      '1.2.3-dev+ga4578d1',
      {
        channel: 'beta',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        commit: 'a4578d1',
      },
    ],
    [
      '1.2.3-beta4',
      {
        channel: 'beta',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        commit: '',
      },
    ],
    [
      '1.2.3-dev+ga4578d1',
      {
        channel: 'alpha',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        commit: 'a4578d1',
      },
    ],
    [
      '1.2.3-alpha4',
      {
        channel: 'alpha',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        commit: '',
      },
    ],
    [
      '1.2.3-dev+ga4578d1',
      {
        channel: 'dev',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        commit: 'a4578d1',
      },
    ],
    [
      '1.2.3-dev', // sort of invalid case
      {
        channel: 'dev',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        commit: '',
      },
    ],
  ]).it('format: %s', (text, info) => {
    expect(toSemVer(info)).toBe(text)
  })
})
