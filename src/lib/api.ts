'use strict'

import * as moment from 'moment'
import * as api from './api'
import * as request from './request'

export { IReport, Option, Range, Status } from './request'

export async function getBalance(option: request.Option) {
  const getBalanceRequest: request.IGetBalanceRequest = {
    account: option.account,
    action: 'getBalance',
    sign: null,
    v: '1.1'
  }
  return await request.getBalance(option, getBalanceRequest)
}

export async function charge(
  option: request.Option, phone: string, range: request.Range,
  packageSize: number, outTradeNo: string
) {
  const chargeRequest: request.IChargeRequest = {
    account: option.account,
    action: 'charge',
    mobile: phone,
    outTradeNo,
    package: packageSize,
    range,
    sign: null,
    v: '1.1'
  }
  return await request.charge(option, chargeRequest)
}

export async function queryOrder(option: request.Option, outTradeNo: string) {
  const queryOrderRequest: request.IQueryOrderRequest = {
    account: option.account,
    action: 'queryReport',
    outTradeNo,
    sendTime: moment().format('YYYY-MM-DD'),
    sign: null,
    v: '1.1'
  }
  return await request.queryOrder(option, queryOrderRequest)
}

export function parseCallback(option: request.Option, data: object) {
  return request.parseCallback(option, data)
}
