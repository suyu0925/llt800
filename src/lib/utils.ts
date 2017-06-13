'use strict'

import * as crypto from 'crypto'
import * as debug from 'debug'
import * as qs from 'querystring'
import {
  IChargeRequest, IChargeTestRequest,
  IGetBalanceRequest, IGetPackageRequest,
  IQueryOrderRequest, IRequest
} from './request'

const error = debug('llt800:utils')

interface IQueryStringifyOption {
  encode?: boolean
  expand?: boolean
  sort?: boolean
}

export function sortObject(o: { [k: string]: any }) {
  const p = Object.create(null)
  for (const k of Object.keys(o).sort()) {
    p[k] = o[k]
  }
  return p
}

export function querystringify(json: { [k: string]: any }, option?: IQueryStringifyOption) {
  // default option
  option = option || {}
  option.encode = option.expand !== false // default to true
  option.expand = option.expand !== false // default to true
  option.sort = option.sort !== false // default to true

  if (option.sort) {
    json = sortObject(json)
  }

  // deal with nested object, convert nested object to string
  if (option.expand) {
    for (const k of Object.keys(json)) {
      if (typeof (json[k]) === 'object') {
        json[k] = JSON.stringify(json[k])
      }
    }
  }

  return qs.stringify(json, null, null, {
    encodeURIComponent: (str: string) => {
      // do not encode URI
      if (option.encode) {
        return qs.escape(str)
      } else {
        return str
      }
    }
  })
}

export function sign(req: IRequest, key: string) {
  let signStruct
  if (req.action === 'charge') {
    const chargeReq = req as IChargeRequest
    signStruct = {
      account: chargeReq.account,
      mobile: chargeReq.mobile,
      package: chargeReq.package
    }
  } else if (req.action === 'getPackage') {
    const getPackageReq = req as IGetPackageRequest
    signStruct = {
      account: getPackageReq.account,
      type: getPackageReq.type
    }
  } else if (req.action === 'getBalance') {
    const getPackageReq = req as IGetBalanceRequest
    signStruct = {
      account: getPackageReq.account
    }
  } else if (req.action === 'chargeTest') {
    const chargeTestReq = req as IChargeTestRequest
    signStruct = {
      account: chargeTestReq.account,
      mobile: chargeTestReq.mobile,
      package: chargeTestReq.package
    }
  } else if (req.action === 'queryReport') {
    const queryOrderReq = req as IQueryOrderRequest
    signStruct = {
      account: queryOrderReq.account
    }
  } else {
    const commonRequest = req as IRequest
    signStruct = {
      account: commonRequest.account
    }
    error('unknown req action: %s', req.action)
  }
  let signStr = querystringify(signStruct)
  signStr += '&key=' + key
  const md5 = crypto.createHash('md5')
  req.sign = md5.update(signStr).digest('hex')
  return req
}
