import { DataSource, IFetchDataOptions, ModeType } from "./interface";

export const callAPI = async (options: IFetchDataOptions) => {
  const defaultData = { metadata: { columns_name: [] }, rows: [] };
  if (!options.dataSource) return defaultData;
  try {
    let apiEndpoint = '';
    switch (options.dataSource) {
      case DataSource.Dune:
        apiEndpoint = `/dune/query/${options.queryId}`;
        break;
      case DataSource.Flipside:
        apiEndpoint = `/flipside/query/${options.queryId}`;
        break;
      case DataSource.Custom:
        apiEndpoint = options.apiEndpoint;
        break;
    }
    if (!apiEndpoint) return defaultData;
    const response = await fetch(apiEndpoint);
    const jsonData = await response.json();
    if (DataSource.Custom && apiEndpoint.includes('flipsidecrypto')) {
      let result = { rows: [], metadata: { column_names: [] } };
      if (jsonData?.length) {
        result = {
          metadata: { column_names: Object.keys(jsonData[0]) },
          rows: jsonData
        }
      }
      return result;
    }
    return jsonData.result || defaultData;
  } catch { }
  return defaultData;
}

export const getExternalLink = (options: IFetchDataOptions) => {
  if (!options.dataSource) return '';
  let link = '';
  switch (options.dataSource) {
    case DataSource.Dune:
      link = `https://dune.com/queries/${options.queryId}`;
      break;
    case DataSource.Flipside:
      link = `https://api.flipsidecrypto.com/api/v2/queries/${options.queryId}/data/latest`;
      break;
    case DataSource.Custom:
      link = options.apiEndpoint;
      break;
  }
  return link;
}

export const modeOptions = [
  {
    label: 'Live',
    value: ModeType.LIVE
  },
  {
    label: 'Snapshot',
    value: ModeType.SNAPSHOT
  }
]

export const dataSourceOptions = [
  {
    label: 'Dune',
    value: DataSource.Dune
  },
  {
    label: 'Flipside',
    value: DataSource.Flipside
  },
  {
    label: 'Custom',
    value: DataSource.Custom
  }
]

export const fetchContentByCID = async (ipfsCid: string) => {
  let res = null;
  try {
    const ipfsBaseUrl = `/ipfs/`;
    res = await fetch(ipfsBaseUrl + ipfsCid);
    const jsonData = await res.json();
    if (Array.isArray(jsonData)) {
      return { metadata: { column_names: Object.keys(jsonData[0] || {}) }, rows: jsonData }
    }
    return jsonData;
  } catch (err) {
  }
  return res;
}
