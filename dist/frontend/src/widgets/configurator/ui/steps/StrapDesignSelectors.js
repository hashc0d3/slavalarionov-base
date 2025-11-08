"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrapDesignSelectors = void 0;
const mobx_react_lite_1 = require("mobx-react-lite");
const configurator_store_1 = require("@/shared/store/configurator.store");
const StrapDesignSelectors_module_css_1 = __importDefault(require("./StrapDesignSelectors.module.css"));
exports.StrapDesignSelectors = (0, mobx_react_lite_1.observer)(function StrapDesignSelectors({ params, selectedStrapModel }) {
    const buckleButterfly = configurator_store_1.configuratorStore.selectedStrapModel?.attributes.watch_strap.buckle_butterfly_choosen;
    const selectorConfigs = [
        {
            id: 1,
            title: 'Цвет кожи',
            paramName: 'leather_color',
            colors: params.leather_colors,
            func: (title) => configurator_store_1.configuratorStore.chooseStrapLeatherColor(title)
        },
        {
            id: 2,
            title: 'Цвет строчки',
            paramName: 'stitching_color',
            colors: params.stitching_colors,
            func: (title) => configurator_store_1.configuratorStore.chooseStitchingColor(title)
        },
        {
            id: 3,
            title: 'Цвет края',
            paramName: 'edge_color',
            colors: params.edge_colors,
            func: (title) => configurator_store_1.configuratorStore.chooseEdgeColor(title)
        },
        {
            id: 4,
            title: 'Цвет пряжки',
            paramName: 'buckle_color',
            colors: params.buckle_colors,
            func: (title) => configurator_store_1.configuratorStore.chooseBuckleColor(title),
            hasButterflyBuckle: params.has_buckle_butterfly
        },
        {
            id: 5,
            title: 'Цвет адаптера',
            paramName: 'adapter_color',
            colors: params.adapter_colors,
            func: (title) => configurator_store_1.configuratorStore.chooseAdapterColor(title)
        }
    ];
    return (<div className={StrapDesignSelectors_module_css_1.default.selectors}>
			{selectorConfigs.map((config) => (<StrapDesignSelector key={config.id} paramTitle={config.title} paramName={config.paramName} colors={config.colors} func={config.func} hasButterflyBuckle={config.hasButterflyBuckle}/>))}
		</div>);
});
const StrapDesignSelector = (0, mobx_react_lite_1.observer)(function StrapDesignSelector({ paramTitle, paramName, colors, func, hasButterflyBuckle }) {
    const selectedColor = colors.find((c) => c.choosen);
    return (<div className={StrapDesignSelectors_module_css_1.default.selector}>
			<div className={StrapDesignSelectors_module_css_1.default.selectorContent}>
				<div className={StrapDesignSelectors_module_css_1.default.selectorColorSwatch} style={{ backgroundColor: selectedColor?.color_code || '#e9e9e9' }}/>
				<span className={StrapDesignSelectors_module_css_1.default.selectorText}>{paramTitle}</span>
				<svg className={StrapDesignSelectors_module_css_1.default.selectorArrow} viewBox="0 0 12 7" fill="none">
					<path d="M6 5.47458L11.2332 0.624569C11.2754 0.584638 11.3254 0.55307 11.3805 0.53169C11.4356 0.51031 11.4945 0.499544 11.554 0.500015C11.6135 0.500485 11.6722 0.512183 11.7269 0.534431C11.7816 0.556679 11.8311 0.589036 11.8726 0.629629C11.9141 0.670221 11.9467 0.718244 11.9685 0.770918C11.9904 0.823592 12.0011 0.879871 11.9999 0.936499C11.9988 0.993126 11.9859 1.04898 11.9619 1.10082C11.938 1.15266 11.9035 1.19947 11.8604 1.23853L6.31362 6.37867C6.22966 6.45647 6.11714 6.5 6 6.5C5.88286 6.5 5.77034 6.45647 5.68638 6.37867L0.139579 1.23853C0.0965156 1.19947 0.0620146 1.15266 0.0380697 1.10082C0.0141248 1.04898 0.00121305 0.993126 8.10432e-05 0.936498C-0.00105097 0.879871 0.00961875 0.823591 0.0314751 0.770917C0.0533304 0.718243 0.0859356 0.670221 0.127407 0.629628C0.168878 0.589035 0.218389 0.556678 0.273076 0.53443C0.327763 0.512182 0.386539 0.500485 0.446004 0.500014C0.505468 0.499544 0.564441 0.51031 0.619509 0.53169C0.674576 0.553069 0.724645 0.584638 0.766818 0.624569L6 5.47458Z" fill="#A9A9A9"/>
				</svg>
			</div>
			<select className={StrapDesignSelectors_module_css_1.default.selectorSelect} value={selectedColor?.color_title || ''} onChange={(e) => func(e.target.value)}>
				<option value="" disabled>
					{paramTitle}
				</option>
				{colors.map((color, idx) => (<option key={idx} value={color.color_title}>
						{color.color_title}
					</option>))}
			</select>
		</div>);
});
//# sourceMappingURL=StrapDesignSelectors.js.map