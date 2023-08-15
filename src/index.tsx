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
import { DataSource, IConfigData, IFileData } from './interface';
import { ModeType } from './interface';
import { callAPI, modeOptions, fetchContentByCID, dataSourceOptions } from './utils'
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
  private queryIdInput: Input
  private captureBtn: Button
  private downloadBtn: Button
  private mdAlert: Alert
  private fileNameLb: Label
  private pnlUpload: VStack
  private pnlFile: VStack
  private pnlDataSource: VStack
  private pnlQueryId: VStack
  private pnlLoading: VStack

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

  async onCustomDataChanged(data: IConfigData) {
  }

  private renderUI() {
    this.updateMode()
    this.queryIdInput.value = this.data.queryId ?? ''
    this.captureBtn.enabled = !!this.queryIdInput.value
  }

  private onModeChanged() {
    this.data.mode = (this.modeSelect.selectedItem as IComboItem).value as ModeType
    this.updateMode()
    this.onCustomDataChanged(this.data);
  }

  private onDataSourceChanged() {
    this.data.dataSource = (this.comboDataSource.selectedItem as IComboItem).value as DataSource
    this.onCustomDataChanged(this.data);
  }

  private async updateMode() {
    const findedMode = modeOptions.find((mode) => mode.value === this.data.mode)
    if (findedMode) this.modeSelect.selectedItem = findedMode
    const isSnapshot = this.data.mode === ModeType.SNAPSHOT
    this.pnlDataSource.visible = !isSnapshot
    this.pnlQueryId.visible = !isSnapshot
    this.pnlUpload.visible = isSnapshot
    this.pnlFile.visible = isSnapshot
    this.fileNameLb.caption = `${this.data.file?.cid || ''}`
  }

  private async updateChartData() {
    const data = this.data.dataSource ? await callAPI(this.data.dataSource, this.data.queryId) : [];
    this._data.chartData = JSON.stringify(data, null, 4);
  }

  private onUpdateQueryId() {
    this.data.queryId = this.queryIdInput.value ?? ''
    this.captureBtn.enabled = !!this.data.queryId
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
        chartData = JSON.stringify(this.data.dataSource ? await callAPI(this.data.dataSource, this.data.queryId) : [], null, 4);
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

  init() {
    super.init()
    const queryId = this.getAttribute('queryId', true)
    const mode = this.getAttribute('mode', true, ModeType.LIVE)
    const dataSource = this.getAttribute('dataSource', true, DataSource.Dune);
    const file = this.getAttribute('file', true)
    const chartData = this.getAttribute('chartData', true)
    this.onCustomDataChanged = this.getAttribute('onCustomDataChanged', true);
    this.data = {mode, dataSource, queryId, file, chartData}
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
          <i-vstack id='pnlQueryId' gap='10px'>
            <i-hstack gap={4}>
              <i-label caption='Query ID'></i-label>
              <i-label caption='*' font={{ color: '#ff0000' }}></i-label>
            </i-hstack>
            <i-hstack verticalAlignment='center' gap='0.5rem'>
              <i-input
                id='queryIdInput'
                height={42}
                width='100%'
                onChanged={this.onUpdateQueryId}
              ></i-input>
              <i-button
                id='captureBtn'
                height={42}
                caption='Capture Snapshot'
                background={{ color: Theme.colors.primary.main }}
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
            <i-button
              id='downloadBtn'
              margin={{ top: 10 }}
              height={42}
              width='100%'
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
          </i-vstack>
        </i-vstack>
        <i-alert id='mdAlert'></i-alert>
      </i-panel>
    )
  }
}
