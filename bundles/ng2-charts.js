System.registerDynamic('ng2-charts/components/charts/charts', ['@angular/core'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var core_1 = $__require('@angular/core');
    var BaseChartComponent = function () {
        function BaseChartComponent(element) {
            this.labels = [];
            this.options = { responsive: true };
            this.chartClick = new core_1.EventEmitter();
            this.chartHover = new core_1.EventEmitter();
            this.initFlag = false;
            this.element = element;
        }
        BaseChartComponent.prototype.ngOnInit = function () {
            this.ctx = this.element.nativeElement.children[0].getContext('2d');
            this.cvs = this.element.nativeElement.children[0];
            if (this.width) {
                this.cvs.width = this.width;
            }
            if (this.height) {
                this.cvs.height = this.height;
            }
            this.parent = this.element.nativeElement;
            this.initFlag = true;
            if (this.data || this.datasets) {
                this.refresh();
            }
        };
        BaseChartComponent.prototype.ngOnChanges = function (changes) {
            if (this.initFlag) {
                if (this.chart) {
                    // Check if the changes are in the data or datasets
                    if (changes.hasOwnProperty('data') || changes.hasOwnProperty('datasets')) {
                        this.chart.data.datasets = this.getDatasets();
                        this.chart.update();
                    } else {
                        this.refresh();
                    }
                }
            }
        };
        BaseChartComponent.prototype.ngOnDestroy = function () {
            if (this.chart) {
                this.chart.destroy();
                this.chart = void 0;
            }
        };
        BaseChartComponent.prototype.getChartBuilder = function (ctx /*, data:Array<any>, options:any*/) {
            var _this = this;
            var datasets = this.getDatasets();
            var options = Object.assign({}, this.options);
            if (this.legend === false) {
                options.legend = { display: false };
            }
            // hock for onHover and onClick events
            options.hover = options.hover || {};
            if (!options.hover.onHover) {
                options.hover.onHover = function (active) {
                    if (active && !active.length) {
                        return;
                    }
                    _this.chartHover.emit({ active: active });
                };
            }
            if (!options.onClick) {
                options.onClick = function (event, active) {
                    _this.chartClick.emit({ event: event, active: active });
                };
            }
            var opts = {
                type: this.chartType,
                data: {
                    labels: this.labels,
                    datasets: datasets
                },
                options: options
            };
            if (typeof Chart === 'undefined') {
                throw new Error('ng2-charts configuration issue: Embedding Chart.js lib is mandatory');
            }
            return new Chart(ctx, opts);
        };
        BaseChartComponent.prototype.getDatasets = function () {
            var _this = this;
            var datasets = void 0;
            // in case if datasets is not provided, but data is present
            if (!this.datasets || !this.datasets.length && this.data && this.data.length) {
                if (Array.isArray(this.data[0])) {
                    datasets = this.data.map(function (data, index) {
                        return { data: data, label: _this.labels[index] || "Label " + index };
                    });
                } else {
                    datasets = [{ data: this.data, label: "Label 0" }];
                }
            }
            if (this.datasets && this.datasets.length || datasets && datasets.length) {
                datasets = (this.datasets || datasets).map(function (elm, index) {
                    var newElm = Object.assign({}, elm);
                    if (_this.colors && _this.colors.length) {
                        Object.assign(newElm, _this.colors[index]);
                    } else {
                        Object.assign(newElm, getColors(_this.chartType, index, newElm.data.length));
                    }
                    return newElm;
                });
            }
            if (!datasets) {
                throw new Error("ng-charts configuration error, \n      data or datasets field are required to render char " + this.chartType);
            }
            return datasets;
        };
        BaseChartComponent.prototype.refresh = function () {
            var _this = this;
            if (this.options && this.options.responsive && this.parent.clientHeight === 0) {
                return setTimeout(function () {
                    return _this.refresh();
                }, 50);
            }
            // todo: remove this line, it is producing flickering
            this.ngOnDestroy();
            this.chart = this.getChartBuilder(this.ctx /*, data, this.options*/);
        };
        BaseChartComponent.defaultColors = [[255, 99, 132], [54, 162, 235], [255, 206, 86], [231, 233, 237], [75, 192, 192], [151, 187, 205], [220, 220, 220], [247, 70, 74], [70, 191, 189], [253, 180, 92], [148, 159, 177], [77, 83, 96]];
        BaseChartComponent.decorators = [{ type: core_1.Component, args: [{
                selector: 'base-chart',
                template: "<canvas style=\"width: 100%; height: 100%;\"></canvas>",
                styles: [":host { display: block; }"]
            }] }];
        /** @nocollapse */
        BaseChartComponent.ctorParameters = [{ type: core_1.ElementRef }];
        BaseChartComponent.propDecorators = {
            'data': [{ type: core_1.Input }],
            'datasets': [{ type: core_1.Input }],
            'labels': [{ type: core_1.Input }],
            'options': [{ type: core_1.Input }],
            'chartType': [{ type: core_1.Input }],
            'colors': [{ type: core_1.Input }],
            'legend': [{ type: core_1.Input }],
            'height': [{ type: core_1.Input }],
            'width': [{ type: core_1.Input }],
            'chartClick': [{ type: core_1.Output }],
            'chartHover': [{ type: core_1.Output }]
        };
        return BaseChartComponent;
    }();
    exports.BaseChartComponent = BaseChartComponent;
    function rgba(colour, alpha) {
        return 'rgba(' + colour.concat(alpha).join(',') + ')';
    }
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function formatLineColor(colors) {
        return {
            backgroundColor: rgba(colors, 0.4),
            borderColor: rgba(colors, 1),
            pointBackgroundColor: rgba(colors, 1),
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: rgba(colors, 0.8)
        };
    }
    function formatBarColor(colors) {
        return {
            backgroundColor: rgba(colors, 0.6),
            borderColor: rgba(colors, 1),
            hoverBackgroundColor: rgba(colors, 0.8),
            hoverBorderColor: rgba(colors, 1)
        };
    }
    function formatPieColors(colors) {
        return {
            backgroundColor: colors.map(function (color) {
                return rgba(color, 0.6);
            }),
            borderColor: colors.map(function () {
                return '#fff';
            }),
            pointBackgroundColor: colors.map(function (color) {
                return rgba(color, 1);
            }),
            pointBorderColor: colors.map(function () {
                return '#fff';
            }),
            pointHoverBackgroundColor: colors.map(function (color) {
                return rgba(color, 1);
            }),
            pointHoverBorderColor: colors.map(function (color) {
                return rgba(color, 1);
            })
        };
    }
    function formatPolarAreaColors(colors) {
        return {
            backgroundColor: colors.map(function (color) {
                return rgba(color, 0.6);
            }),
            borderColor: colors.map(function (color) {
                return rgba(color, 1);
            }),
            hoverBackgroundColor: colors.map(function (color) {
                return rgba(color, 0.8);
            }),
            hoverBorderColor: colors.map(function (color) {
                return rgba(color, 1);
            })
        };
    }
    function getRandomColor() {
        return [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)];
    }
    /**
     * Generate colors for line|bar charts
     * @param index
     * @returns {number[]|Color}
     */
    function generateColor(index) {
        return BaseChartComponent.defaultColors[index] || getRandomColor();
    }
    /**
     * Generate colors for pie|doughnut charts
     * @param count
     * @returns {Colors}
     */
    function generateColors(count) {
        var colorsArr = new Array(count);
        for (var i = 0; i < count; i++) {
            colorsArr[i] = BaseChartComponent.defaultColors[i] || getRandomColor();
        }
        return colorsArr;
    }
    /**
     * Generate colors by chart type
     * @param chartType
     * @param index
     * @param count
     * @returns {Color}
     */
    function getColors(chartType, index, count) {
        if (chartType === 'pie' || chartType === 'doughnut') {
            return formatPieColors(generateColors(count));
        }
        if (chartType === 'polarArea') {
            return formatPolarAreaColors(generateColors(count));
        }
        if (chartType === 'line' || chartType === 'radar') {
            return formatLineColor(generateColor(index));
        }
        if (chartType === 'bar' || chartType === 'horizontalBar') {
            return formatBarColor(generateColor(index));
        }
        return generateColor(index);
    }
    var ChartsModule = function () {
        function ChartsModule() {}
        ChartsModule.decorators = [{ type: core_1.NgModule, args: [{
                declarations: [BaseChartComponent],
                exports: [BaseChartComponent],
                imports: []
            }] }];
        /** @nocollapse */
        ChartsModule.ctorParameters = [];
        return ChartsModule;
    }();
    exports.ChartsModule = ChartsModule;
    return module.exports;
});
System.registerDynamic("ng2-charts/ng2-charts", ["./components/charts/charts"], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export($__require("./components/charts/charts"));
    return module.exports;
});
//# sourceMappingURL=ng2-charts.js.map