'use strict'

// load .env before import debug module
import * as dotenv from 'dotenv'
dotenv.config()

import * as debug from 'debug'
import { default as Llt800, Option } from '../src/index'

const log = debug('test:queryOrder')

const option: Option = {
  account: process.env.account,
  key: process.env.key,
  url: process.env.url
}

describe('queryOrder', () => {
  let llt800: Llt800

  beforeAll(() => {
    llt800 = new Llt800(option)
  })

  test('queryOrder', async () => {
    const report = await llt800.queryOrder('2017-06-13 19:32:54945')
    log('report: %j', report)
  })

  test('queryOrder:failed order', async () => {
    const report = await llt800.queryOrder('2017-06-13 19:33:08240')
    log('report: %j', report)
  })

  test('queryOrder:not exist', async () => {
    const report = await llt800.queryOrder('not exist')
    log('report: %j', report)
  })
})
