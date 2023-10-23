var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-chart-data-source-setup/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uploadStyle = exports.comboBoxStyle = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    components_1.Styles.cssRule('i-scom-chart-data-source-setup', {
        $nest: {
            'i-input > input': {
                padding: '0.5rem 1rem'
            },
            '.capture-btn': {
                whiteSpace: 'nowrap'
            }
        }
    });
    exports.comboBoxStyle = components_1.Styles.style({
        width: '100% !important',
        $nest: {
            '.selection': {
                width: '100% !important',
                maxWidth: '100%',
                padding: '0.5rem 1rem',
                color: Theme.input.fontColor,
                backgroundColor: Theme.input.background,
                borderRadius: 0
            },
            '.selection input': {
                color: 'inherit',
                backgroundColor: 'inherit',
                padding: 0
            },
            '.selection:focus-within': {
                backgroundColor: `darken(${Theme.input.background}, 20%)`
            },
            '> .icon-btn:hover': {
                backgroundColor: 'transparent'
            }
        }
    });
    exports.uploadStyle = components_1.Styles.style({
        height: 'auto',
        width: '100%',
        margin: 0,
        $nest: {
            '> .i-upload-wrapper': {
                marginBottom: 0
            }
        }
    });
});
define("@scom/scom-chart-data-source-setup/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartType = exports.DataSource = exports.ModeType = void 0;
    ///<amd-module name='@scom/scom-chart-data-source-setup/interface.ts'/> 
    var ModeType;
    (function (ModeType) {
        ModeType["LIVE"] = "Live";
        ModeType["SNAPSHOT"] = "Snapshot";
    })(ModeType = exports.ModeType || (exports.ModeType = {}));
    var DataSource;
    (function (DataSource) {
        DataSource["Dune"] = "Dune";
        DataSource["Flipside"] = "Flipside";
        DataSource["Custom"] = "Custom";
    })(DataSource = exports.DataSource || (exports.DataSource = {}));
    var ChartType;
    (function (ChartType) {
        ChartType["Counter"] = "scom-counter";
        ChartType["Table"] = "scom-table";
        ChartType["Pie"] = "scom-pie-chart";
        ChartType["Bar"] = "scom-bar-chart";
        ChartType["Line"] = "scom-line-chart";
        ChartType["Area"] = "scom-area-chart";
        ChartType["Scatter"] = "scom-scatter-chart";
        ChartType["Mixed"] = "scom-mixed-chart";
    })(ChartType = exports.ChartType || (exports.ChartType = {}));
});
define("@scom/scom-chart-data-source-setup/utils.ts", ["require", "exports", "@scom/scom-chart-data-source-setup/interface.ts"], function (require, exports, interface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fetchContentByCID = exports.chartOptions = exports.dataSourceOptions = exports.modeOptions = exports.getExternalLink = exports.callAPI = void 0;
    const callAPI = async (options) => {
        const defaultData = { metadata: { columns_name: [] }, rows: [] };
        if (!options.dataSource)
            return defaultData;
        try {
            let apiEndpoint = '';
            switch (options.dataSource) {
                case interface_1.DataSource.Dune:
                    apiEndpoint = `/dune/query/${options.queryId}`;
                    break;
                case interface_1.DataSource.Flipside:
                    apiEndpoint = `/flipside/query/${options.queryId}`;
                    break;
                case interface_1.DataSource.Custom:
                    apiEndpoint = options.apiEndpoint;
                    break;
            }
            if (!apiEndpoint)
                return defaultData;
            const response = await fetch(apiEndpoint);
            const jsonData = await response.json();
            if (interface_1.DataSource.Custom && apiEndpoint.includes('flipsidecrypto')) {
                let result = { rows: [], metadata: { column_names: [] } };
                if (jsonData?.length) {
                    result = {
                        metadata: { column_names: Object.keys(jsonData[0]) },
                        rows: jsonData
                    };
                }
                return result;
            }
            return jsonData.result || defaultData;
        }
        catch { }
        return defaultData;
    };
    exports.callAPI = callAPI;
    const getExternalLink = (options) => {
        if (!options.dataSource)
            return '';
        let link = '';
        switch (options.dataSource) {
            case interface_1.DataSource.Dune:
                link = `https://dune.com/queries/${options.queryId}`;
                break;
            case interface_1.DataSource.Flipside:
                link = `https://api.flipsidecrypto.com/api/v2/queries/${options.queryId}/data/latest`;
                break;
            case interface_1.DataSource.Custom:
                link = options.apiEndpoint;
                break;
        }
        return link;
    };
    exports.getExternalLink = getExternalLink;
    exports.modeOptions = [
        {
            label: 'Live',
            value: interface_1.ModeType.LIVE
        },
        {
            label: 'Snapshot',
            value: interface_1.ModeType.SNAPSHOT
        }
    ];
    exports.dataSourceOptions = [
        {
            label: 'Dune',
            value: interface_1.DataSource.Dune
        },
        {
            label: 'Flipside',
            value: interface_1.DataSource.Flipside
        },
        {
            label: 'Custom',
            value: interface_1.DataSource.Custom
        }
    ];
    exports.chartOptions = [
        {
            label: 'Counter',
            value: interface_1.ChartType.Counter
        },
        {
            label: 'Table',
            value: interface_1.ChartType.Table
        },
        {
            label: 'Pie Chart',
            value: interface_1.ChartType.Pie
        },
        {
            label: 'Bar Chart',
            value: interface_1.ChartType.Bar
        },
        {
            label: 'Line Chart',
            value: interface_1.ChartType.Line
        },
        {
            label: 'Area Chart',
            value: interface_1.ChartType.Area
        },
        {
            label: 'Scatter Chart',
            value: interface_1.ChartType.Scatter
        },
        {
            label: 'Mixed Chart',
            value: interface_1.ChartType.Mixed
        }
    ];
    const fetchContentByCID = async (ipfsCid) => {
        let res = null;
        try {
            const ipfsBaseUrl = `/ipfs/`;
            res = await fetch(ipfsBaseUrl + ipfsCid);
            const jsonData = await res.json();
            if (Array.isArray(jsonData)) {
                return { metadata: { column_names: Object.keys(jsonData[0] || {}) }, rows: jsonData };
            }
            return jsonData;
        }
        catch (err) {
        }
        return res;
    };
    exports.fetchContentByCID = fetchContentByCID;
});
define("@scom/scom-chart-data-source-setup", ["require", "exports", "@ijstech/components", "@scom/scom-chart-data-source-setup/interface.ts", "@scom/scom-chart-data-source-setup/interface.ts", "@scom/scom-chart-data-source-setup/utils.ts", "@scom/scom-chart-data-source-setup/index.css.ts", "@scom/scom-chart-data-source-setup/index.css.ts"], function (require, exports, components_2, interface_2, interface_3, utils_1, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartType = exports.DataSource = exports.ModeType = exports.callAPI = exports.fetchContentByCID = void 0;
    Object.defineProperty(exports, "ChartType", { enumerable: true, get: function () { return interface_2.ChartType; } });
    Object.defineProperty(exports, "DataSource", { enumerable: true, get: function () { return interface_2.DataSource; } });
    Object.defineProperty(exports, "ModeType", { enumerable: true, get: function () { return interface_3.ModeType; } });
    Object.defineProperty(exports, "callAPI", { enumerable: true, get: function () { return utils_1.callAPI; } });
    Object.defineProperty(exports, "fetchContentByCID", { enumerable: true, get: function () { return utils_1.fetchContentByCID; } });
    const Theme = components_2.Styles.Theme.ThemeVars;
    let ScomChartDataSourceSetup = class ScomChartDataSourceSetup extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get data() {
            return this._data;
        }
        set data(value) {
            this._data = value;
            this.renderUI();
        }
        get mode() {
            return this._data.mode;
        }
        set mode(value) {
            this._data.mode = value;
            this.updateMode();
        }
        get dataSource() {
            return this._data.dataSource;
        }
        set dataSource(value) {
            this._data.dataSource = value;
        }
        get queryId() {
            return this._data.queryId;
        }
        set queryId(value) {
            this._data.queryId = value;
        }
        get file() {
            return this._data.file;
        }
        set file(value) {
            this._data.file = value;
        }
        get fetchDataOptions() {
            return {
                dataSource: this.data.dataSource,
                queryId: this.data.queryId,
                apiEndpoint: this.data.apiEndpoint
            };
        }
        async onCustomDataChanged(data) {
        }
        async onCustomChartTypeChanged(value) {
        }
        renderUI() {
            this.updateMode();
            if ([interface_2.DataSource.Dune, interface_2.DataSource.Flipside].includes(this.data.dataSource)) {
                this.endpointInput.value = this.data.queryId ?? '';
            }
            else if (this.data.dataSource === interface_2.DataSource.Custom) {
                this.endpointInput.value = this.data.apiEndpoint ?? '';
            }
            this.captureBtn.enabled = !!this.endpointInput.value;
            if (this.isChartTypeShown) {
                this.chartSelect.selectedItem = utils_1.chartOptions.find((opt) => opt.value === this.data.chartType);
                this.currentChartType = this.data.chartType;
            }
        }
        onChartChanged() {
            const type = this.chartSelect.selectedItem.value;
            if (!this.isChartTypeShown || this.currentChartType === type)
                return;
            this.currentChartType = type;
            this.onCustomChartTypeChanged(type);
        }
        onModeChanged() {
            this.data.mode = this.modeSelect.selectedItem.value;
            this.updateMode();
            this.onCustomDataChanged(this.data);
        }
        onDataSourceChanged() {
            this.data.dataSource = this.comboDataSource.selectedItem.value;
            if ([interface_2.DataSource.Dune, interface_2.DataSource.Flipside].includes(this.data.dataSource)) {
                this.lbEndpointCaption.caption = 'Query ID';
            }
            else if (this.data.dataSource === interface_2.DataSource.Custom) {
                this.lbEndpointCaption.caption = 'API Endpoint';
            }
            this.onCustomDataChanged(this.data);
        }
        async updateMode() {
            const modeOption = utils_1.modeOptions.find((mode) => mode.value === this.data.mode);
            if (modeOption)
                this.modeSelect.selectedItem = modeOption;
            const dataSourceOption = utils_1.dataSourceOptions.find((dataSource) => dataSource.value === this.data.dataSource);
            if (dataSourceOption)
                this.comboDataSource.selectedItem = dataSourceOption;
            if ([interface_2.DataSource.Dune, interface_2.DataSource.Flipside].includes(this.data.dataSource)) {
                this.lbEndpointCaption.caption = 'Query ID';
            }
            else if (this.data.dataSource === interface_2.DataSource.Custom) {
                this.lbEndpointCaption.caption = 'API Endpoint';
            }
            const isSnapshot = this.data.mode === interface_3.ModeType.SNAPSHOT;
            this.pnlDataSource.visible = !isSnapshot;
            this.pnlEndpoint.visible = !isSnapshot;
            this.pnlUpload.visible = isSnapshot;
            this.pnlFile.visible = isSnapshot;
            this.fileNameLb.caption = `${this.data.file?.cid || ''}`;
        }
        async updateChartData() {
            const data = this.data.dataSource ? await (0, utils_1.callAPI)(this.fetchDataOptions) : [];
            this._data.chartData = JSON.stringify(data, null, 4);
        }
        onUpdateEndpoint() {
            if ([interface_2.DataSource.Dune, interface_2.DataSource.Flipside].includes(this.data.dataSource)) {
                this.data.queryId = this.endpointInput.value ?? '';
                this.data.apiEndpoint = '';
            }
            else if (this.data.dataSource === interface_2.DataSource.Custom) {
                this.data.apiEndpoint = this.endpointInput.value ?? '';
                this.data.queryId = '';
            }
            this.captureBtn.enabled = !!this.data.queryId || !!this.data.apiEndpoint;
            this.onCustomDataChanged(this.data);
        }
        async onCapture() {
            // this.captureBtn.rightIcon.spin = true
            // this.captureBtn.rightIcon.visible = true
            if (this.pnlLoading)
                this.pnlLoading.visible = true;
            this.mode = interface_3.ModeType.SNAPSHOT;
            try {
                await this.updateChartData();
                if (this._data.chartData?.length)
                    await this.onUploadToIPFS();
            }
            catch (err) {
            }
            finally {
                // this.captureBtn.rightIcon.spin = false
                // this.captureBtn.rightIcon.visible = false
                if (this.pnlLoading)
                    this.pnlLoading.visible = false;
            }
        }
        async onUploadToIPFS() {
            const result = (await components_2.application.uploadData('chart_data.json', this.data.chartData)).data?.links?.[0];
            if (result) {
                this._data.file = { cid: result.cid, name: result.name };
                this.fileNameLb.caption = `${result.cid || ''}`;
                this.mdAlert.status = 'success';
                this.mdAlert.status = 'Success';
                this.mdAlert.content = 'Upload successfully!';
                this.mdAlert.showModal();
                this.onCustomDataChanged(this.data);
            }
            else {
                this.mdAlert.status = 'error';
                this.mdAlert.status = 'Error';
                this.mdAlert.content = 'Upload failed!';
                this.mdAlert.showModal();
            }
        }
        async onImportFile(target, files) {
            const self = this;
            if (files && files.length > 0) {
                const file = files[0];
                const reader = new FileReader();
                reader.readAsText(file, 'UTF-8');
                reader.onload = async (event) => {
                    self._data.chartData = event.target?.result;
                    if (this.pnlLoading)
                        this.pnlLoading.visible = true;
                    target.clear();
                    if (self._data.chartData)
                        await this.onUploadToIPFS();
                    if (this.pnlLoading)
                        this.pnlLoading.visible = false;
                };
            }
        }
        async onExportFile() {
            this.downloadBtn.rightIcon.spin = true;
            this.downloadBtn.rightIcon.visible = true;
            try {
                let chartData = this.data.chartData;
                if (this.data.mode === interface_3.ModeType.LIVE) {
                    chartData = JSON.stringify(this.data.dataSource ? await (0, utils_1.callAPI)(this.fetchDataOptions) : [], null, 4);
                }
                const blob = new Blob([chartData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'chart_data.json';
                a.click();
                URL.revokeObjectURL(url);
            }
            catch (err) {
            }
            finally {
                this.downloadBtn.rightIcon.spin = false;
                this.downloadBtn.rightIcon.visible = false;
            }
        }
        openLink() {
            if (!this.data.dataSource || (!this.data.queryId && !this.data.apiEndpoint))
                return;
            const link = (0, utils_1.getExternalLink)(this.fetchDataOptions);
            window.open(link, "_blank");
        }
        init() {
            super.init();
            this.isChartTypeShown = this.getAttribute('isChartTypeShown', true, false);
            this.vstackChartType.visible = this.isChartTypeShown;
            const chartType = this.getAttribute('chartType', true, interface_2.ChartType.Counter);
            const queryId = this.getAttribute('queryId', true);
            const apiEndpoint = this.getAttribute('apiEndpoint', true);
            const mode = this.getAttribute('mode', true, interface_3.ModeType.LIVE);
            const dataSource = this.getAttribute('dataSource', true, interface_2.DataSource.Dune);
            const file = this.getAttribute('file', true);
            const chartData = this.getAttribute('chartData', true);
            this.onCustomDataChanged = this.getAttribute('onCustomDataChanged', true);
            this.onCustomChartTypeChanged = this.getAttribute('onCustomChartTypeChanged', true);
            this.data = { chartType, mode, dataSource, queryId, apiEndpoint, file, chartData };
        }
        render() {
            return (this.$render("i-panel", null,
                this.$render("i-vstack", { id: 'pnlLoading', visible: false, width: '100%', height: "100%", class: 'i-loading-overlay' },
                    this.$render("i-vstack", { class: 'i-loading-spinner', horizontalAlignment: 'center', verticalAlignment: 'center' },
                        this.$render("i-icon", { class: 'i-loading-spinner_icon', name: 'spinner', width: '1.5rem', height: '1.5rem', fill: Theme.colors.primary.main }),
                        this.$render("i-label", { caption: 'Loading...', font: { color: Theme.colors.primary.main, size: '1rem' }, class: 'i-loading-spinner_text' }))),
                this.$render("i-vstack", { gap: '0.625rem' },
                    this.$render("i-vstack", { id: 'vstackChartType', visible: false, gap: '0.625rem' },
                        this.$render("i-label", { caption: 'Chart Type' }),
                        this.$render("i-combo-box", { id: 'chartSelect', items: utils_1.chartOptions, selectedItem: utils_1.chartOptions[0], height: '2.625rem', width: '100%', class: index_css_1.comboBoxStyle, onChanged: this.onChartChanged })),
                    this.$render("i-vstack", { gap: '0.625rem' },
                        this.$render("i-label", { caption: 'Mode' }),
                        this.$render("i-combo-box", { id: 'modeSelect', items: utils_1.modeOptions, selectedItem: utils_1.modeOptions[0], height: '2.625rem', width: '100%', class: index_css_1.comboBoxStyle, onChanged: this.onModeChanged })),
                    this.$render("i-vstack", { id: 'pnlDataSource', gap: '0.625rem' },
                        this.$render("i-hstack", { gap: '0.25rem' },
                            this.$render("i-label", { caption: 'Data Source' }),
                            this.$render("i-label", { caption: '*', font: { color: '#ff0000' } })),
                        this.$render("i-combo-box", { id: 'comboDataSource', items: utils_1.dataSourceOptions, selectedItem: utils_1.dataSourceOptions[0], height: '2.625rem', width: '100%', class: index_css_1.comboBoxStyle, onChanged: this.onDataSourceChanged })),
                    this.$render("i-vstack", { id: 'pnlEndpoint', gap: '0.625rem' },
                        this.$render("i-hstack", { gap: "0.25rem" },
                            this.$render("i-label", { id: "lbEndpointCaption", caption: 'Query ID' }),
                            this.$render("i-label", { caption: '*', font: { color: '#ff0000' } })),
                        this.$render("i-hstack", { verticalAlignment: 'center', gap: '0.5rem' },
                            this.$render("i-input", { id: 'endpointInput', height: "2.625rem", width: '100%', onChanged: this.onUpdateEndpoint }),
                            this.$render("i-icon", { id: "btnOpenLink", name: "external-link-alt", fill: Theme.text.primary, opacity: 0.5, width: "1.5rem", height: "1.5rem", border: { width: 1, style: 'solid', color: Theme.colors.secondary.light, radius: 4 }, class: "pointer", onClick: this.openLink }))),
                    this.$render("i-vstack", { id: 'pnlFile', gap: '0.625rem' },
                        this.$render("i-label", { caption: 'File Path' }),
                        this.$render("i-label", { id: 'fileNameLb', caption: '' })),
                    this.$render("i-vstack", { id: 'pnlUpload', gap: '0.625rem' },
                        this.$render("i-label", { caption: 'Upload' }),
                        this.$render("i-upload", { width: '100%', onChanged: this.onImportFile, class: index_css_1.uploadStyle })),
                    this.$render("i-vstack", { gap: '0.625rem' },
                        this.$render("i-hstack", { verticalAlignment: 'center', gap: '0.5rem', width: "100%" },
                            this.$render("i-button", { id: 'captureBtn', height: '2.625rem', width: "50%", caption: 'Capture Snapshot', icon: { name: 'camera', fill: Theme.colors.primary.contrastText }, background: { color: '#4CAF50' }, font: { color: Theme.colors.primary.contrastText }, rightIcon: {
                                    name: 'spinner',
                                    spin: false,
                                    fill: Theme.colors.primary.contrastText,
                                    width: '1rem',
                                    height: '1rem',
                                    visible: false,
                                }, class: 'capture-btn', enabled: false, onClick: this.onCapture }),
                            this.$render("i-button", { id: 'downloadBtn', height: '2.625rem', width: "50%", icon: { name: 'download', fill: Theme.colors.primary.contrastText }, background: { color: '#1E88E5' }, font: { color: Theme.colors.primary.contrastText }, rightIcon: {
                                    name: 'spinner',
                                    spin: false,
                                    fill: Theme.colors.primary.contrastText,
                                    width: '1rem',
                                    height: '1rem',
                                    visible: false,
                                }, caption: 'Download File', onClick: this.onExportFile })))),
                this.$render("i-alert", { id: 'mdAlert' })));
        }
    };
    ScomChartDataSourceSetup = __decorate([
        components_2.customModule,
        (0, components_2.customElements)('i-scom-chart-data-source-setup')
    ], ScomChartDataSourceSetup);
    exports.default = ScomChartDataSourceSetup;
});
