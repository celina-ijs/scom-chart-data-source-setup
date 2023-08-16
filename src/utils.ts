import { DataSource, ModeType } from "./interface";

export const callAPI = async (dataSource: DataSource, queryId: string) => {
  if (!dataSource) return [];
  try {
    let apiEndpoint = '';
    switch (dataSource) {
      case DataSource.Dune:
        apiEndpoint = `/dune/query/${queryId}`;
        break;
    }
    if (!apiEndpoint) return [];
    const response = await fetch(apiEndpoint);
    const jsonData = await response.json();
    return jsonData.result.rows || [];
  } catch {}
  return [];
}

export const getExternalLink = (dataSource: DataSource, queryId: string) => {
  if (!dataSource) return '';
  let link = '';
  switch (dataSource) {
    case DataSource.Dune:
      link = `https://dune.com/queries/${queryId}`;
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
