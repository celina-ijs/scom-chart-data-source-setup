import {
  Module,
  customModule,
  Container,
  ControlElement,
  customElements,
  Styles,
  ComboBox,
  Input,
  Button,
  IComboItem,
  application,
  Alert,
  Label,
  Upload,
  VStack
} from '@ijstech/components'
import './index.css'
import { DataSource, IConfigData, IFetchDataOptions, IFileData } from './interface';
import { ModeType } from './interface';
import { callAPI, modeOptions, fetchContentByCID, dataSourceOptions, getExternalLink } from './utils'
import { comboBoxStyle, uploadStyle } from './index.css';
const Theme = Styles.Theme.ThemeVars

export {
  fetchContentByCID,
  callAPI,
  ModeType,
  DataSource
}

interface ScomChartDataElement extends ControlElement {
  mode?: ModeType;
  dataSource?: DataSource;
  apiEndpoint? : string;
  queryId?: string;
  file?: IFileData;
  onCustomDataChanged?: (data: IConfigData) => Promise<void>;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-chart-data-source-setup']: ScomChartDataElement
    }
  }
}

@customModule
@customElements('i-scom-chart-data-source-setup')
export default class ScomChartDataSourceSetup extends Module {
  private _data: IConfigData

  private modeSelect: ComboBox
  private comboDataSource: ComboBox
  private endpointInput: Input
  private captureBtn: Button
  private downloadBtn: Button
  private mdAlert: Alert
  private fileNameLb: Label
  private pnlUpload: VStack
  private pnlFile: VStack
  private pnlDataSource: VStack
  private pnlEndpoint: VStack
  private pnlLoading: VStack
  private lbEndpointCaption: Label

  constructor(parent?: Container, options?: any) {
    super(parent, options)
  }

  static async create(options?: ScomChartDataElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  get data() {
    return this._data
  }
  set data(value: IConfigData) {
    this._data = value
    this.renderUI()
  }

  get mode() {
    return this._data.mode
  }
  set mode(value: ModeType) {
    this._data.mode = value
    this.updateMode()
  }

  get dataSource() {
    return this._data.dataSource
  }
  set dataSource(value: DataSource) {
    this._data.dataSource = value
  }

  get queryId() {
    return this._data.queryId
  }
  set queryId(value: string) {
    this._data.queryId = value
  }

  get file() {
    return this._data.file
  }
  set file(value: IFileData) {
    this._data.file = value
  }

  private get fetchDataOptions(): IFetchDataOptions {
    return {
      dataSource: this.data.dataSource,
      queryId: this.data.queryId,
      apiEndpoint: this.data.apiEndpoint
    }
  }
  
  async onCustomDataChanged(data: IConfigData) {
  }

  private renderUI() {
    this.updateMode()
    if (this.data.dataSource === DataSource.Dune) {
      this.endpointInput.value = this.data.queryId ?? ''
    }
    else if (this.data.dataSource === DataSource.Custom) {
      this.endpointInput.value = this.data.apiEndpoint ?? ''
    }
    this.captureBtn.enabled = !!this.endpointInput.value
  }

  private onModeChanged() {
    this.data.mode = (this.modeSelect.selectedItem as IComboItem).value as ModeType
    this.updateMode()
    this.onCustomDataChanged(this.data);
  }

  private onDataSourceChanged() {
    this.data.dataSource = (this.comboDataSource.selectedItem as IComboItem).value as DataSource;
    if (this.data.dataSource === DataSource.Dune) {
      this.lbEndpointCaption.caption = 'Query ID'
    }
    else if (this.data.dataSource === DataSource.Custom) {
      this.lbEndpointCaption.caption = 'API Endpoint'
    }
    this.onCustomDataChanged(this.data);
  }

  private async updateMode() {
    const modeOption = modeOptions.find((mode) => mode.value === this.data.mode)
    if (modeOption) this.modeSelect.selectedItem = modeOption
    const dataSourceOption = dataSourceOptions.find((dataSource) => dataSource.value === this.data.dataSource)
    if (dataSourceOption) this.comboDataSource.selectedItem = dataSourceOption
    if (this.data.dataSource === DataSource.Dune) {
      this.lbEndpointCaption.caption = 'Query ID'
    }
    else if (this.data.dataSource === DataSource.Custom) {
      this.lbEndpointCaption.caption = 'API Endpoint'
    }
    const isSnapshot = this.data.mode === ModeType.SNAPSHOT
    this.pnlDataSource.visible = !isSnapshot
    this.pnlEndpoint.visible = !isSnapshot
    this.pnlUpload.visible = isSnapshot
    this.pnlFile.visible = isSnapshot
    this.fileNameLb.caption = `${this.data.file?.cid || ''}`
  }

  private async updateChartData() {
    const data = this.data.dataSource ? await callAPI(this.fetchDataOptions) : [];
    this._data.chartData = JSON.stringify(data, null, 4);
  }

  private onUpdateEndpoint() {
    if (this.data.dataSource === DataSource.Dune) {
      this.data.queryId = this.endpointInput.value ?? '';
      this.data.apiEndpoint = '';
    }
    else if (this.data.dataSource === DataSource.Custom) {
      this.data.apiEndpoint = this.endpointInput.value ?? '';
      this.data.queryId = '';
    }
    this.captureBtn.enabled = !!this.data.queryId || !!this.data.apiEndpoint;
    this.onCustomDataChanged(this.data);
  }

  private async onCapture() {
    // this.captureBtn.rightIcon.spin = true
    // this.captureBtn.rightIcon.visible = true
    if (this.pnlLoading) this.pnlLoading.visible = true
    this.mode = ModeType.SNAPSHOT
    try {
      await this.updateChartData()
      if (this._data.chartData?.length)
        await this.onUploadToIPFS()
    } catch(err) {
    }
    finally {
      // this.captureBtn.rightIcon.spin = false
      // this.captureBtn.rightIcon.visible = false
      if (this.pnlLoading) this.pnlLoading.visible = false
    }
  }

  private async onUploadToIPFS() {
    const result = (await application.uploadData('chart_data.json', this.data.chartData)).data?.links?.[0]
    if (result) {
      this._data.file = { cid: result.cid, name: result.name }
      this.fileNameLb.caption = `${result.cid || ''}`
      this.mdAlert.status = 'success'
      this.mdAlert.status = 'Success'
      this.mdAlert.content = 'Upload successfully!'
      this.mdAlert.showModal();
      this.onCustomDataChanged(this.data);
    }
    else {
      this.mdAlert.status = 'error'
      this.mdAlert.status = 'Error'
      this.mdAlert.content = 'Upload failed!'
      this.mdAlert.showModal();
    }
  }

  private async onImportFile(target: Upload, files: File[]) {
    const self = this
    if (files && files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.readAsText(file, 'UTF-8')
      reader.onload = async (event) => {
        self._data.chartData = event.target?.result as string
        if (this.pnlLoading) this.pnlLoading.visible = true
        target.clear()
        if (self._data.chartData) await this.onUploadToIPFS()
        if (this.pnlLoading) this.pnlLoading.visible = false
      };
    }
  }

  private async onExportFile() {
    this.downloadBtn.rightIcon.spin = true
    this.downloadBtn.rightIcon.visible = true
    try {
      let chartData = this.data.chartData;
      if (this.data.mode === ModeType.LIVE) {
        chartData = JSON.stringify(this.data.dataSource ? await callAPI(this.fetchDataOptions) : [], null, 4);
      }
      const blob = new Blob([chartData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chart_data.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch(err) {
    } finally {
      this.downloadBtn.rightIcon.spin = false
      this.downloadBtn.rightIcon.visible = false
    }

  }

  openLink() {
    if (!this.data.dataSource || (!this.data.queryId && !this.data.apiEndpoint)) return;
    const link = getExternalLink(this.fetchDataOptions);
    window.open(link, "_blank");
  }

  init() {
    super.init()
    const queryId = this.getAttribute('queryId', true)
    const apiEndpoint = this.getAttribute('apiEndpoint', true)
    const mode = this.getAttribute('mode', true, ModeType.LIVE)
    const dataSource = this.getAttribute('dataSource', true, DataSource.Dune);
    const file = this.getAttribute('file', true)
    const chartData = this.getAttribute('chartData', true)
    this.onCustomDataChanged = this.getAttribute('onCustomDataChanged', true);
    this.data = {mode, dataSource, queryId, apiEndpoint, file, chartData}
  }

  render() {
    return (
      <i-panel>
        <i-vstack
          id='pnlLoading'
          visible={false}
          width='100%' height="100%"
          class='i-loading-overlay'
        >
          <i-vstack
            class='i-loading-spinner'
            horizontalAlignment='center'
            verticalAlignment='center'
          >
            <i-icon
              class='i-loading-spinner_icon'
              name='spinner'
              width={24}
              height={24}
              fill={Theme.colors.primary.main}
            />
            <i-label
              caption='Loading...'
              font={{ color: Theme.colors.primary.main, size: '1rem' }}
              class='i-loading-spinner_text'
            />
          </i-vstack>
        </i-vstack>
        <i-vstack gap='10px'>
          <i-vstack gap='10px'>
            <i-label caption='Mode'></i-label>
            <i-combo-box
              id='modeSelect'
              items={modeOptions}
              selectedItem={modeOptions[0]}
              height={42}
              width='100%'
              class={comboBoxStyle}
              onChanged={this.onModeChanged}
            ></i-combo-box>
          </i-vstack>
          <i-vstack id='pnlDataSource' gap='10px'>
            <i-hstack gap={4}>
              <i-label caption='Data Source'></i-label>
              <i-label caption='*' font={{ color: '#ff0000' }}></i-label>
            </i-hstack>
            <i-combo-box
              id='comboDataSource'
              items={dataSourceOptions}
              selectedItem={dataSourceOptions[0]}
              height={42}
              width='100%'
              class={comboBoxStyle}
              onChanged={this.onDataSourceChanged}
            ></i-combo-box>
          </i-vstack>
          <i-vstack id='pnlEndpoint' gap='10px'>
            <i-hstack gap={4}>
              <i-label id="lbEndpointCaption" caption='Query ID'></i-label>
              <i-label caption='*' font={{ color: '#ff0000' }}></i-label>
            </i-hstack>
            <i-hstack verticalAlignment='center' gap='0.5rem'>
              <i-input
                id='endpointInput'
                height={42}
                width='100%'
                onChanged={this.onUpdateEndpoint}
              ></i-input>
              <i-icon
                id="btnOpenLink"
                name="external-link-alt" fill={Theme.text.primary}
                opacity={0.5}
                width={25} height={25}
                border={{ width: 1, style: 'solid', color: Theme.colors.secondary.light, radius: 4 }}
                class="pointer"
                onClick={this.openLink}
              ></i-icon>
            </i-hstack>
          </i-vstack>
          <i-vstack id='pnlFile' gap={10}>
            <i-label caption='File Path'></i-label>
            <i-label id='fileNameLb' caption=''></i-label>
          </i-vstack>
          <i-vstack id='pnlUpload' gap='10px'>
            <i-label caption='Upload'></i-label>
            <i-upload
              width='100%'
              onChanged={this.onImportFile}
              class={uploadStyle}
            ></i-upload>
          </i-vstack>
          <i-vstack gap='10px'>
            <i-hstack verticalAlignment='center' gap='0.5rem' width="100%">
              <i-button
                id='captureBtn'
                height={42}
                width="50%"
                caption='Capture Snapshot'
                icon={{ name: 'camera', fill: Theme.colors.primary.contrastText }}
                background={{ color: '#4CAF50' }} //FIXME: use theme
                font={{ color: Theme.colors.primary.contrastText }}
                rightIcon={{
                  name: 'spinner',
                  spin: false,
                  fill: Theme.colors.primary.contrastText,
                  width: 16,
                  height: 16,
                  visible: false,
                }}
                class='capture-btn'
                enabled={false}
                onClick={this.onCapture}
              ></i-button>
              <i-button
                id='downloadBtn'
                height={42}
                width="50%"
                icon={{ name: 'download', fill: Theme.colors.primary.contrastText }}
                background={{ color: '#1E88E5' }} //FIXME: use theme
                font={{ color: Theme.colors.primary.contrastText }}
                rightIcon={{
                  name: 'spinner',
                  spin: false,
                  fill: Theme.colors.primary.contrastText,
                  width: 16,
                  height: 16,
                  visible: false,
                }}
                caption='Download File'
                onClick={this.onExportFile}
              ></i-button>
            </i-hstack>
          </i-vstack>
        </i-vstack>
        <i-alert id='mdAlert'></i-alert>
      </i-panel>
    )
  }
}
