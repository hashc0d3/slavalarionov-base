"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguratorSteps = void 0;
const ConfiguratorSteps_module_css_1 = __importDefault(require("./ConfiguratorSteps.module.css"));
const mobx_react_lite_1 = require("mobx-react-lite");
const configurator_store_1 = require("@/shared/store/configurator.store");
const StepsFrameColors_1 = require("./StepsFrameColors");
const StrapModelStep_1 = require("./StrapModelStep");
const StrapDesignStep_1 = require("./StrapDesignStep");
const FinalStep_1 = require("./FinalStep");
const react_1 = require("react");
exports.ConfiguratorSteps = (0, mobx_react_lite_1.observer)(function ConfiguratorSteps() {
    const step = configurator_store_1.configuratorStore.currentStepNum;
    const prevStepRef = (0, react_1.useRef)(step);
    const [animClass, setAnimClass] = (0, react_1.useState)(ConfiguratorSteps_module_css_1.default.fadeRightStatic);
    (0, react_1.useEffect)(() => {
        const prev = prevStepRef.current;
        const next = configurator_store_1.configuratorStore.currentStepNum;
        setAnimClass(prev > next ? ConfiguratorSteps_module_css_1.default.fadeLeftStatic : ConfiguratorSteps_module_css_1.default.fadeRightStatic);
        prevStepRef.current = next;
    }, [configurator_store_1.configuratorStore.currentStepNum]);
    return (<div className={ConfiguratorSteps_module_css_1.default.configuratorSteps}>
			{step === 1 && (<section className={[ConfiguratorSteps_module_css_1.default.section, animClass].join(' ')}>
					<div className={ConfiguratorSteps_module_css_1.default.stepInner}>
						{configurator_store_1.configuratorStore.watchModels.map((model, idx) => (<div key={model.watch_model_name} className={[ConfiguratorSteps_module_css_1.default.stepItem, model.choosen ? ConfiguratorSteps_module_css_1.default.choosen : ''].join(' ')} onClick={() => !model.choosen && configurator_store_1.configuratorStore.chooseWatchModel(idx)}>
								<img src={model.main_image || '/window.svg'} width={150} height={270} alt="" className={ConfiguratorSteps_module_css_1.default.stepItemImage}/>
								<div className={ConfiguratorSteps_module_css_1.default.stepItemInfo}>
									<div className={ConfiguratorSteps_module_css_1.default.stepItemTitle}>
										<p className={ConfiguratorSteps_module_css_1.default.stepItemTitlePart}>{model.watch_model_manufacturer}</p>
										<p className={ConfiguratorSteps_module_css_1.default.stepItemTitlePart}>{model.watch_model_name}</p>
									</div>
									<div className={ConfiguratorSteps_module_css_1.default.stepItemSizes}>
										{model.watch_sizes.map((size, id) => (<button key={size.watch_size} type="button" className={[ConfiguratorSteps_module_css_1.default.stepItemSizesItem, size.choosen ? ConfiguratorSteps_module_css_1.default.choosen : ''].join(' ')} onClick={(e) => { e.stopPropagation(); configurator_store_1.configuratorStore.chooseWatchModel(idx, id); }}>
												{size.watch_size}mm
											</button>))}
									</div>
								</div>
								{model.choosen && (<div className={ConfiguratorSteps_module_css_1.default.stepItemColors}>
										{configurator_store_1.configuratorStore.selectedWatchModelFrameColors?.map((color) => (<button key={color.color_name} className={[ConfiguratorSteps_module_css_1.default.stepItemColor, color.choosen ? ConfiguratorSteps_module_css_1.default.choosen : ''].join(' ')} onClick={(e) => { e.stopPropagation(); configurator_store_1.configuratorStore.chooseFrameColor(color.color_name); }}>
												<span className={ConfiguratorSteps_module_css_1.default.stepItemColorPreview} style={{ background: color.color_code || '#eee' }}/>
											</button>))}
									</div>)}
							</div>))}
					</div>
					<StepsFrameColors_1.StepsFrameColors />
				</section>)}

			{step === 2 && (<section className={[ConfiguratorSteps_module_css_1.default.section, animClass].join(' ')}>
					<StrapModelStep_1.StrapModelStep />
				</section>)}

			{step === 3 && (<section className={[ConfiguratorSteps_module_css_1.default.section, animClass].join(' ')}>
					<StrapDesignStep_1.StrapDesignStep />
				</section>)}

			{step === 4 && (<section className={[ConfiguratorSteps_module_css_1.default.section, animClass].join(' ')}>
					<FinalStep_1.FinalStep />
				</section>)}
		</div>);
});
//# sourceMappingURL=ConfiguratorSteps.js.map