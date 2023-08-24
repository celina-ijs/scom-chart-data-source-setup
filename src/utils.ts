import { DataSource, IFetchDataOptions, ModeType } from "./interface";

export const callAPI = async (options: IFetchDataOptions) => {
  if (!options.dataSource) return [];
  try {
    let apiEndpoint = '';
    switch (options.dataSource) {
      case DataSource.Dune:
        apiEndpoint = `/dune/query/${options.queryId}`;
        break;
      case DataSource.Custom:
        apiEndpoint = options.apiEndpoint;
        break;
    }
    if (!apiEndpoint) return [];
    const response = await fetch(apiEndpoint);
    const jsonData = await response.json();
    return jsonData.result.rows || [];
  } catch {}
  return [];
}

export const getExternalLink = (options: IFetchDataOptions) => {
  if (!options.dataSource) return '';
  let link = '';
  switch (options.dataSource) {
    case DataSource.Dune:
      link = `https://dune.com/queries/${options.queryId}`;
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
    label: 'Custom',
    value: DataSource.Custom
  }
]

export const fetchContentByCID = async (ipfsCid: string) => {
  let res = null;
  try {
    // const ipfsBaseUrl = `${window.location.origin}/ipfs/`;
    const ipfsBaseUrl = `/ipfs/`
    res = await fetch(ipfsBaseUrl + ipfsCid);
    return await res.json();
  } catch (err) {
  }
  return res;
}
