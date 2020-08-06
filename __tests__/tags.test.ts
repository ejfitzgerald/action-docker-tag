import each from 'jest-each'
import {generateTagList, generateTagListFromVersion} from '../src/tags'

describe('tag generation tests', () => {
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
      ['1.2.3+ga4578d1'],
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
      ['1.2.3', '1.2', '1'],
    ],
    [
      '1.2.3-rc4+ga4578d1',
      {
        channel: 'rc',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        commit: 'a4578d1',
      },
      ['1.2.3-dev+ga4578d1'],
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
      ['1.2.3-rc4'],
    ],
    [
      '1.2.3-beta4+ga4578d1',
      {
        channel: 'beta',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        commit: 'a4578d1',
      },
      ['1.2.3-dev+ga4578d1'],
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
      ['1.2.3-beta4'],
    ],
    [
      '1.2.3-alpha4+ga4578d1',
      {
        channel: 'alpha',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        commit: 'a4578d1',
      },
      ['1.2.3-dev+ga4578d1'],
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
      ['1.2.3-alpha4'],
    ],
    [
      '1.2.3-dev4+ga4578d1',
      {
        channel: 'dev',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        commit: 'a4578d1',
      },
      ['1.2.3-dev+ga4578d1'],
    ],
    [
      '1.2.3-dev4',
      {
        channel: 'dev',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        commit: '',
      },
      ['1.2.3-dev'],
    ],
  ]).it('tags for %s', (title, info, tags) => {
    expect(generateTagList(info)).toMatchObject(tags)
  })
})

describe('end to end tag tests', () => {
  each([
    ['v0.0.3beta9-1-ga4578d1', ['0.0.3-dev+ga4578d1']],
    ['v10.12.13', ['10.12.13', '10.12', '10']],
    ['v1.2.3alpha1', ['1.2.3-alpha1']],
    ['v1.2.3rc2-1-gabcdef1', ['1.2.3-dev+gabcdef1']],
    ['v0.0.1-3-gef14a4a', ['0.0.1-dev+gef14a4a']],
    ['v0.0.10', ['0.0.10']],
    ['v0.1.10', ['0.1.10', '0.1']],
    ['v1.9.1', ['1.9.1', '1.9', '1']],
    ['foo bar is a baz', []],
  ]).it('tags for %s', (version, tags) => {
    expect(generateTagListFromVersion(version)).toMatchObject(tags)
  })
})
