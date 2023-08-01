import { ModeType } from "./interface";

export const callAPI = async (apiEndpoint: string) => {
  if (!apiEndpoint) return [];
  try {
    const response = await fetch(apiEndpoint);
    const jsonData = await response.json();
    return jsonData.result.rows || [];
  } catch {}
  return [];
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

export const fetchContentByCID = async (ipfsCid: string) => {
  let res = null;
  try {
    // const ipfsBaseUrl = `${window.location.origin}/ipfs/`;
    const ipfsBaseUrl = `https://ipfs.scom.dev/ipfs/`
    res = await fetch(ipfsBaseUrl + ipfsCid);
    return await res.json();
  } catch (err) {
  }
  return res;
}
