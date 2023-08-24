export enum ModeType {
  LIVE = "Live",
  SNAPSHOT = "Snapshot"
}

export enum DataSource {
  Dune = "Dune",
  Custom = "Custom"
}

export interface IFileData {
  cid?: string,
  name?: string
}

export interface IConfigData {
  mode: ModeType;
  dataSource: DataSource;
  apiEndpoint?: string;
  queryId?: string;
  file?: IFileData;
  chartData?: string;
}

export interface IFetchDataOptions {
  dataSource: DataSource;
  queryId?: string;
  apiEndpoint?: string;
}
