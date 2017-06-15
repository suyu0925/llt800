'use strict'

import * as debug from 'debug'
import { Type as OperatorType } from 'mobile-operator'
import * as qs from 'querystring'
import * as request from 'request'
import * as utils from './utils'

const error = debug('llt800:request')

export interface Option {
  url: string
  account: string
  key: string
}

// 0漫游流量，1非漫游流量，不带该参数时默认为0
export enum Range {
  Roaming = 0,
  NoRoaming = 1
}

export enum Status {
  Charging = 2,
  QueryFailed = 3,
  Done = 4,
  ChargeFailed = 5,
  Unknown = 7
}

export interface IRequest {
  account: string // 参与签名
  action: 'charge' | 'getPackage' | 'getBalance' | 'chargeTest' | 'queryReport'
  sign: string // MD5签名
  v: '1.1' // 1.1 固定值
}

export interface IChargeRequest extends IRequest {
  action: 'charge'
  mobile: string // 参与签名
  package: number // 参与签名
  range?: Range
  outTradeNo?: string // 商户系统内部的订单号,64个字符内、可包含字母，可为空
}

export interface IGetPackageRequest extends IRequest {
  action: 'getPackage'
  type: OperatorType // 0:不指定, 1:移动, 2:联通, 3:电信
  range?: Range
}

export interface IGetBalanceRequest extends IRequest {
  action: 'getBalance'
}

export interface IChargeTestRequest extends IRequest {
  action: 'chargeTest'
  outTradeNo?: string
  mobile: string // 参与签名
  package: string // 参与签名
  range?: Range
}

export interface IQueryOrderRequest extends IRequest {
  action: 'queryReport'
  taskId?: number // taskId和outTracdeNo必须至少填一个
  outTradeNo?: string
  sendTime: string // yyyy-MM-dd
}

export interface IPackage {
  Type: string
  Package: string
  Name: string
  Price: string
}

export interface IReport {
  TaskId: string
  Mobile: string
  Status: Status
  ReportTime: string
  ReportCode: string
  OutTradeNo: string
}

export interface INotifyInfo extends IReport {
  Sign: string // 签名，可不验证
}

export interface IResponse {
  Code: string // 成功为0
  Message: string // 注意：启用商户订单号唯一性验证后，如果手机号码+商户订单号存在，Code会返回0，表示成功。Message提示为：商户订单号xxx已经存在
  // 但不会再新建订单，TaskID将会返回上一次相同商户订单号提交返回的TaskID。
}

export interface IChargeResponse extends IResponse {
  TaskID: string
}

export interface IGetPackageResponse extends IResponse {
  Packages: IPackage[]
}

export interface IGetBalanceResponse extends IResponse {
  Balance: number
}

export interface IChargeTestResponse extends IResponse {
  Packages: IPackage[]
}

export interface IQueryOrderResponse extends IResponse {
  Reports: IReport[]
}

export async function getBalance(option: Option, getBalanceReq: IGetBalanceRequest) {
  utils.sign(getBalanceReq, option.key)
  const params = qs.stringify(getBalanceReq)
  return new Promise((resolve, reject) => {
    request({
      json: true,
      method: 'get',
      url: option.url + '?' + params
    }, (err, res, body: IGetBalanceResponse) => {
      if (err || res.statusCode !== 200) {
        reject(new Error('charge connect failed'))
      } else {
        if (body.Code !== '0') {
          error('getBalance body: %j', body)
          reject(new Error(body.Message))
        } else {
          resolve(body.Balance)
        }
      }
    })
  }) as Promise<number>
}

export async function charge(option: Option, chargeReq: IChargeRequest) {
  utils.sign(chargeReq, option.key)
  const params = qs.stringify(chargeReq)
  return new Promise((resolve, reject) => {
    request({
      json: true,
      method: 'get',
      url: option.url + '?' + params
    }, (err, res, body: IChargeResponse) => {
      if (err || res.statusCode !== 200) {
        reject(new Error('charge connect failed'))
      } else {
        if (body.Code !== '0' || body.TaskID === '0' || !body.TaskID) {
          error('charge body: %j', body)
          reject(new Error(body.Message))
        } else {
          resolve(body.TaskID)
        }
      }
    })
  }) as Promise<string>
}

export async function queryOrder(option: Option, queryOrderReq: IQueryOrderRequest) {
  utils.sign(queryOrderReq, option.key)
  const params = qs.stringify(queryOrderReq)
  return new Promise((resolve, reject) => {
    request({
      json: true,
      method: 'get',
      url: option.url + '?' + params
    }, (err, res, body: IQueryOrderResponse) => {
      if (err || res.statusCode !== 200) {
        error('queryOrder connect failed: %s %d', err, res.statusCode)
        reject(new Error('queryOrder connect failed'))
      } else {
        if (body.Code !== '0' && body.Code !== '005') {
          error('queryOrder body: %j', body)
          reject(new Error(body.Message))
        } else {
          resolve(body.Reports)
        }
      }
    })
  }) as Promise<IReport[]>
}

export function parseCallback(option: Option, data: object) {
  // turn infos to a array forced
  if (!Array.isArray(data)) {
    data = [data]
  }

  // static cast to IReport[]
  const reports: IReport[] = data as IReport[]

  // check the report simplely
  if (!reports[0].Status) {
    return null
  }

  return reports
}
