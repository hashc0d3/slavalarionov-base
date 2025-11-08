"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrapDesignParams = void 0;
const mobx_react_lite_1 = require("mobx-react-lite");
const configurator_store_1 = require("@/shared/store/configurator.store");
const StrapDesignParams_module_css_1 = __importDefault(require("./StrapDesignParams.module.css"));
exports.StrapDesignParams = (0, mobx_react_lite_1.observer)(function StrapDesignParams({ params, selectedStrapModel }) {
    const buckleButterfly = configurator_store_1.configuratorStore.selectedStrapModel?.attributes.watch_strap.buckle_butterfly_choosen;
    const paramConfigs = [
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
            title: 'Цвет адаптеров',
            paramName: 'adapter_color',
            colors: params.adapter_colors,
            func: (title) => configurator_store_1.configuratorStore.chooseAdapterColor(title)
        }
    ];
    return (<div className={StrapDesignParams_module_css_1.default.params}>
			{paramConfigs.map((config) => (<StrapDesignParamItem key={config.id} id={config.id} paramsAmount={paramConfigs.length} paramTitle={config.title} paramName={config.paramName} colors={config.colors} func={config.func} hasButterflyBuckle={config.hasButterflyBuckle}/>))}
		</div>);
});
const StrapDesignParamItem = (0, mobx_react_lite_1.observer)(function StrapDesignParamItem({ id, paramsAmount, paramTitle, paramName, colors, func, hasButterflyBuckle }) {
    const buckleButterfly = configurator_store_1.configuratorStore.selectedStrapModel?.attributes.watch_strap.buckle_butterfly_choosen;
    const getAdapterImageUrl = (colorTitle) => {
        const baseUrl = 'https://api.slavalarionov.store/uploads';
        const colorMapping = {
            'Серебряный': { name: 'silver', hash: '1fd6eb2557' },
            'Чёрный': { name: 'black', hash: 'dcc8a881ac' },
            'Роз. золото': { name: 'rosegold', hash: '0ac1883663' },
            'Синий': { name: 'blue', hash: '398dff917a' },
            'Зелёный': { name: 'green', hash: 'dcf0b463d9' }
        };
        const colorInfo = colorMapping[colorTitle] || { name: colorTitle.toLowerCase(), hash: '1fd6eb2557' };
        return `${baseUrl}/adapter_${colorInfo.name}_${colorInfo.hash}.png`;
    };
    return (<div className={StrapDesignParams_module_css_1.default.param}>
			<div className={StrapDesignParams_module_css_1.default.paramHead}>
				<h4 className={StrapDesignParams_module_css_1.default.paramTitle}>
					<span className={StrapDesignParams_module_css_1.default.paramTitleNum}>
						{id}/{paramsAmount}
					</span>
					<span className={StrapDesignParams_module_css_1.default.paramTitleText}>{paramTitle}</span>
				</h4>
			</div>
			
			{paramName !== 'adapter_color' && (<div className={StrapDesignParams_module_css_1.default.paramContent}>
					{colors.map((color, idx) => (<button key={idx} className={`${StrapDesignParams_module_css_1.default.paramOption} ${color.choosen ? StrapDesignParams_module_css_1.default.choosen : ''}`} onClick={() => {
                    console.log('Clicking color:', color.color_title, 'param:', paramName);
                    func(color.color_title);
                }}>
							<div className={StrapDesignParams_module_css_1.default.paramOptionColorPreview} style={{ backgroundColor: color.color_code || '#e9e9e9' }}/>
							<span className={StrapDesignParams_module_css_1.default.paramOptionTitle}>
								{color.color_title}
							</span>
						</button>))}
				</div>)}

			{paramName === 'buckle_color' && hasButterflyBuckle && (<div className={`${StrapDesignParams_module_css_1.default.paramBuckleButterfly} ${buckleButterfly ? StrapDesignParams_module_css_1.default.choosen : ''}`} onClick={() => configurator_store_1.configuratorStore.chooseBuckleButterfly()}>
					<div className={StrapDesignParams_module_css_1.default.paramBuckleButterflyInner}>
						<p className={StrapDesignParams_module_css_1.default.paramBuckleButterflyName}>
							Butterfly
						</p>
						<p className={StrapDesignParams_module_css_1.default.paramBuckleButterflyPrice}>
							+ 500 ₽
						</p>
					</div>
					<img src="https://api.slavalarionov.store/uploads/buckle_butterfly_d2b9bce6c1.png" alt="Butterfly buckle" className={StrapDesignParams_module_css_1.default.paramBuckleButterflyImage}/>
				</div>)}

			{paramName === 'adapter_color' && (<div className={StrapDesignParams_module_css_1.default.adapterParamContent}>
					{colors.map((color, idx) => (<button key={idx} className={`${StrapDesignParams_module_css_1.default.paramOption} ${StrapDesignParams_module_css_1.default.adapterParamOption} ${color.choosen ? StrapDesignParams_module_css_1.default.choosen : ''}`} onClick={() => {
                    console.log('Clicking adapter color:', color.color_title);
                    func(color.color_title);
                }}>
							<div className={StrapDesignParams_module_css_1.default.paramOptionPreviewImgInner}>
								<img src={getAdapterImageUrl(color.color_title)} alt={color.color_title} className={StrapDesignParams_module_css_1.default.paramOptionPreviewImg}/>
							</div>
							<span className={StrapDesignParams_module_css_1.default.paramOptionTitle}>
								{color.color_title}
							</span>
						</button>))}
				</div>)}
		</div>);
});
//# sourceMappingURL=StrapDesignParams.js.map