export enum ModeType {
  LIVE = "Live",
  SNAPSHOT = "Snapshot"
}

export enum DataSource {
  Dune = "Dune",
}

export interface IFileData {
  cid?: string,
  name?: string
}

export interface IConfigData {
  mode: ModeType;
  dataSource: DataSource;
  queryId: string;
  file?: IFileData;
  chartData?: string;
}
