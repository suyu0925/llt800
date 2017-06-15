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

export interface IReport {
  TaskId: string
  Mobile: string
  Status: Status
  ReportTime: string
  ReportCode: string
  OutTradeNo: string
}

export default class Llt800 {
  private readonly option: Option

  constructor(option: Option)

  public charge(phone: string, range: Range, packageSize: number, outTradeNo: string): Promise<string>

  public queryOrder(outTradeNo: string): Promise<IReport[]>

  public getBalance(): Promise<number>

  public parseCallback(option: Option, data: object): IReport[]
}
