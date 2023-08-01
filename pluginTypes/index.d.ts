/// <amd-module name="@scom/scom-chart-data-source-setup/index.css.ts" />
declare module "@scom/scom-chart-data-source-setup/index.css.ts" {
    export const comboBoxStyle: string;
    export const uploadStyle: string;
}
/// <amd-module name="@scom/scom-chart-data-source-setup/interface.ts" />
declare module "@scom/scom-chart-data-source-setup/interface.ts" {
    export enum ModeType {
        LIVE = "Live",
        SNAPSHOT = "Snapshot"
    }
    export interface IFileData {
        cid?: string;
        name?: string;
    }
    export interface IConfigData {
        mode: ModeType;
        apiEndpoint?: string;
        file?: IFileData;
        chartData?: string;
    }
}
/// <amd-module name="@scom/scom-chart-data-source-setup/utils.ts" />
declare module "@scom/scom-chart-data-source-setup/utils.ts" {
    import { ModeType } from "@scom/scom-chart-data-source-setup/interface.ts";
    export const callAPI: (apiEndpoint: string) => Promise<any>;
    export const modeOptions: {
        label: string;
        value: ModeType;
    }[];
    export const fetchContentByCID: (ipfsCid: string) => Promise<any>;
}
/// <amd-module name="@scom/scom-chart-data-source-setup" />
declare module "@scom/scom-chart-data-source-setup" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import "@scom/scom-chart-data-source-setup/index.css.ts";
    import { IConfigData, IFileData } from "@scom/scom-chart-data-source-setup/interface.ts";
    import { ModeType } from "@scom/scom-chart-data-source-setup/interface.ts";
    import { callAPI, fetchContentByCID } from "@scom/scom-chart-data-source-setup/utils.ts";
    export { fetchContentByCID, callAPI, ModeType };
    interface ScomChartDataElement extends ControlElement {
        mode?: ModeType;
        apiEndpoint?: string;
        file?: IFileData;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-chart-data-source-setup']: ScomChartDataElement;
            }
        }
    }
    export default class ScomChartDataSourceSetup extends Module {
        private _data;
        private modeSelect;
        private endpointInput;
        private captureBtn;
        private downloadBtn;
        private mdAlert;
        private fileNameLb;
        private pnlUpload;
        private pnlFile;
        private pnlEndpoint;
        private pnlLoading;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomChartDataElement, parent?: Container): Promise<ScomChartDataSourceSetup>;
        get data(): IConfigData;
        set data(value: IConfigData);
        get mode(): ModeType;
        set mode(value: ModeType);
        get apiEndpoint(): string;
        set apiEndpoint(value: string);
        get file(): IFileData;
        set file(value: IFileData);
        private renderUI;
        private onModeChanged;
        private updateMode;
        private updateChartData;
        private onUpdateEndpoint;
        private onCapture;
        private onUploadToIPFS;
        private onImportFile;
        private onExportFile;
        init(): void;
        render(): any;
    }
}
