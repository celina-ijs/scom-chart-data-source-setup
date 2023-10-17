export enum ModeType {
  LIVE = "Live",
  SNAPSHOT = "Snapshot"
}

export enum DataSource {
  Dune = "Dune",
  Flipside = "Flipside",
  Custom = "Custom"
}

export enum ChartType {
  Counter = "scom-counter",
  Table = "scom-table",
  Pie = "scom-pie-chart",
  Bar = "scom-bar-chart",
  Line = "scom-line-chart",
  Area = "scom-area-chart",
  Scatter = "scom-scatter-chart",
  Mixed = "scom-mixed-chart"
}

export interface IFileData {
  cid?: string,
  name?: string
}

export interface IConfigData {
  chartType?: ChartType;
  isChartTypeChanged?: boolean;
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
