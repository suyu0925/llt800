'use strict'

// load .env before import debug module
import * as dotenv from 'dotenv'
dotenv.config()

import * as debug from 'debug'
import * as moment from 'moment'
import { default as Llt800, Option, Range } from '../src/index'

const log = debug('test:charge')

const option: Option = {
  account: process.env.account,
  key: process.env.key,
  url: process.env.url
}
const chargeEnable = process.env.charge === 'true'

describe('charge', () => {
  let llt800: Llt800

  beforeAll(() => {
    llt800 = new Llt800(option)
  })

  test('charge', async () => {
    if (chargeEnable) {
      const taskId = await llt800.charge('18021070048', Range.NoRoaming, 5,
        moment().format('YYYY-MM-DD HH:mm:ss') + Math.floor(Math.random() * 1000))
      log('taskId: %s', taskId)
      expect(taskId).not.toBeNull()
    } else {
      log('skip charge test')
    }
  })
})
