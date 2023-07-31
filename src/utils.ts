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
