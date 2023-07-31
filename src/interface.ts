export enum ModeType {
  LIVE = "Live",
  SNAPSHOT = "Snapshot"
}

export interface IFileData {
  cid?: string,
  name?: string
}

export interface IConfigData {
  mode: ModeType;
  apiEndpoint?: string;
  file?: IFileData;
  chartData?: string;
}
