'use strict'

// load .env before import debug module
import * as dotenv from 'dotenv'
dotenv.config()

import * as debug from 'debug'
import { default as Llt800, Option } from '../src/index'

const log = debug('test:getBalance')

const option: Option = {
  account: process.env.account,
  key: process.env.key,
  url: process.env.url
}

describe('getBalance', () => {
  let llt800: Llt800

  beforeAll(() => {
    llt800 = new Llt800(option)
  })

  test('getBalance', async () => {
    const balance = await llt800.getBalance()
    log('balance: %d', balance)
    expect(balance).toBeGreaterThanOrEqual(0)
  })
})
