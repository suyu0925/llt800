'use strict'

import * as api from './lib/api'

class Llt800 {
  private readonly option: api.Option

  constructor(option: api.Option) {
    // clone option to keep a copy
    this.option = Object.assign({}, option)
  }

  public async charge(phone: string, range: api.Range, packageSize: number, outTradeNo: string) {
    return api.charge(this.option, phone, range, packageSize, outTradeNo)
  }

  public async queryOrder(outTradeNo: string) {
    return api.queryOrder(this.option, outTradeNo)
  }

  public async getBalance() {
    return api.getBalance(this.option)
  }
}

export { Option, Range, Status } from './lib/api'

export default Llt800
