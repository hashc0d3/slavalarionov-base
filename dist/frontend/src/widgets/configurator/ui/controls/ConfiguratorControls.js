"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguratorControls = void 0;
const ConfiguratorControls_module_css_1 = __importDefault(require("./ConfiguratorControls.module.css"));
const mobx_react_lite_1 = require("mobx-react-lite");
const configurator_store_1 = require("@/shared/store/configurator.store");
const StrapDesignSelectors_1 = require("../steps/StrapDesignSelectors");
exports.ConfiguratorControls = (0, mobx_react_lite_1.observer)(function ConfiguratorControls() {
    const isFinal = configurator_store_1.configuratorStore.currentStepNum === configurator_store_1.configuratorStore.stepsAmount;
    const currentStep = configurator_store_1.configuratorStore.currentStepNum;
    return (<div className={ConfiguratorControls_module_css_1.default.configuratorControls}>
			<div>
				{currentStep > 1 && (<div className={ConfiguratorControls_module_css_1.default.selectsContainer}>
						
						<div className={ConfiguratorControls_module_css_1.default.selectWrapper}>
							<select className={ConfiguratorControls_module_css_1.default.select} value={configurator_store_1.configuratorStore.steps.model.modelName || ''} onChange={(e) => configurator_store_1.configuratorStore.updateSelectedModel(e.target.value)}>
								{configurator_store_1.configuratorStore.watchModels.map((model) => (<option key={model.watch_model_name} value={model.watch_model_name}>
										{model.watch_model_name}
									</option>))}
							</select>
							<svg className={ConfiguratorControls_module_css_1.default.selectArrow} viewBox="0 0 12 7" fill="none">
								<path d="M6 5.47458L11.2332 0.624569C11.2754 0.584638 11.3254 0.55307 11.3805 0.53169C11.4356 0.51031 11.4945 0.499544 11.554 0.500015C11.6135 0.500485 11.6722 0.512183 11.7269 0.534431C11.7816 0.556679 11.8311 0.589036 11.8726 0.629629C11.9141 0.670221 11.9467 0.718244 11.9685 0.770918C11.9904 0.823592 12.0011 0.879871 11.9999 0.936499C11.9988 0.993126 11.9859 1.04898 11.9619 1.10082C11.938 1.15266 11.9035 1.19947 11.8604 1.23853L6.31362 6.37867C6.22966 6.45647 6.11714 6.5 6 6.5C5.88286 6.5 5.77034 6.45647 5.68638 6.37867L0.139579 1.23853C0.0965156 1.19947 0.0620146 1.15266 0.0380697 1.10082C0.0141248 1.04898 0.00121305 0.993126 8.10432e-05 0.936498C-0.00105097 0.879871 0.00961875 0.823591 0.0314751 0.770917C0.0533304 0.718243 0.0859356 0.670221 0.127407 0.629628C0.168878 0.589035 0.218389 0.556678 0.273076 0.53443C0.327763 0.512182 0.386539 0.500485 0.446004 0.500014C0.505468 0.499544 0.564441 0.51031 0.619509 0.53169C0.674576 0.553069 0.724645 0.584638 0.766818 0.624569L6 5.47458Z" fill="#A9A9A9"/>
							</svg>
						</div>
						
						
						{configurator_store_1.configuratorStore.selectedWatchModelAllSizes && (<div className={ConfiguratorControls_module_css_1.default.selectWrapper}>
								<select className={ConfiguratorControls_module_css_1.default.select} value={configurator_store_1.configuratorStore.steps.model.modelSize || ''} onChange={(e) => configurator_store_1.configuratorStore.updateWatchModelSize(e.target.value)}>
									{configurator_store_1.configuratorStore.selectedWatchModelAllSizes.map((size) => (<option key={size.watch_size} value={size.watch_size}>
											{size.watch_size}mm
										</option>))}
								</select>
								<svg className={ConfiguratorControls_module_css_1.default.selectArrow} viewBox="0 0 12 7" fill="none">
									<path d="M6 5.47458L11.2332 0.624569C11.2754 0.584638 11.3254 0.55307 11.3805 0.53169C11.4356 0.51031 11.4945 0.499544 11.554 0.500015C11.6135 0.500485 11.6722 0.512183 11.7269 0.534431C11.7816 0.556679 11.8311 0.589036 11.8726 0.629629C11.9141 0.670221 11.9467 0.718244 11.9685 0.770918C11.9904 0.823592 12.0011 0.879871 11.9999 0.936499C11.9988 0.993126 11.9859 1.04898 11.9619 1.10082C11.938 1.15266 11.9035 1.19947 11.8604 1.23853L6.31362 6.37867C6.22966 6.45647 6.11714 6.5 6 6.5C5.88286 6.5 5.77034 6.45647 5.68638 6.37867L0.139579 1.23853C0.0965156 1.19947 0.0620146 1.15266 0.0380697 1.10082C0.0141248 1.04898 0.00121305 0.993126 8.10432e-05 0.936498C-0.00105097 0.879871 0.00961875 0.823591 0.0314751 0.770917C0.0533304 0.718243 0.0859356 0.670221 0.127407 0.629628C0.168878 0.589035 0.218389 0.556678 0.273076 0.53443C0.327763 0.512182 0.386539 0.500485 0.446004 0.500014C0.505468 0.499544 0.564441 0.51031 0.619509 0.53169C0.674576 0.553069 0.724645 0.584638 0.766818 0.624569L6 5.47458Z" fill="#A9A9A9"/>
								</svg>
							</div>)}
						
						
						{configurator_store_1.configuratorStore.selectedWatchModelFrameColors && (<div className={ConfiguratorControls_module_css_1.default.selectWrapper}>
								<select className={ConfiguratorControls_module_css_1.default.select} value={configurator_store_1.configuratorStore.selectedFrameColor?.color_name || ''} onChange={(e) => configurator_store_1.configuratorStore.updateSelectedFrameColor(e.target.value)}>
									{configurator_store_1.configuratorStore.selectedWatchModelFrameColors.map((color) => (<option key={color.color_name} value={color.color_name}>
											{color.color_name}
										</option>))}
								</select>
								<svg className={ConfiguratorControls_module_css_1.default.selectArrow} viewBox="0 0 12 7" fill="none">
									<path d="M6 5.47458L11.2332 0.624569C11.2754 0.584638 11.3254 0.55307 11.3805 0.53169C11.4356 0.51031 11.4945 0.499544 11.554 0.500015C11.6135 0.500485 11.6722 0.512183 11.7269 0.534431C11.7816 0.556679 11.8311 0.589036 11.8726 0.629629C11.9141 0.670221 11.9467 0.718244 11.9685 0.770918C11.9904 0.823592 12.0011 0.879871 11.9999 0.936499C11.9988 0.993126 11.9859 1.04898 11.9619 1.10082C11.938 1.15266 11.9035 1.19947 11.8604 1.23853L6.31362 6.37867C6.22966 6.45647 6.11714 6.5 6 6.5C5.88286 6.5 5.77034 6.45647 5.68638 6.37867L0.139579 1.23853C0.0965156 1.19947 0.0620146 1.15266 0.0380697 1.10082C0.0141248 1.04898 0.00121305 0.993126 8.10432e-05 0.936498C-0.00105097 0.879871 0.00961875 0.823591 0.0314751 0.770917C0.0533304 0.718243 0.0859356 0.670221 0.127407 0.629628C0.168878 0.589035 0.218389 0.556678 0.273076 0.53443C0.327763 0.512182 0.386539 0.500485 0.446004 0.500014C0.505468 0.499544 0.564441 0.51031 0.619509 0.53169C0.674576 0.553069 0.724645 0.584638 0.766818 0.624569L6 5.47458Z" fill="#A9A9A9"/>
								</svg>
							</div>)}
						
						
						{currentStep >= 3 && configurator_store_1.configuratorStore.watchStraps && configurator_store_1.configuratorStore.watchStraps.length > 0 && (<div className={ConfiguratorControls_module_css_1.default.selectWrapper}>
								<select className={ConfiguratorControls_module_css_1.default.select} value={configurator_store_1.configuratorStore.selectedStrapModel?.attributes.watch_strap.id || ''} onChange={(e) => configurator_store_1.configuratorStore.chooseStrapModel(Number(e.target.value))}>
									{configurator_store_1.configuratorStore.watchStraps.map((strap) => (<option key={strap.attributes.watch_strap.id} value={strap.attributes.watch_strap.id}>
											{strap.attributes.watch_strap.strap_title}
										</option>))}
								</select>
								<svg className={ConfiguratorControls_module_css_1.default.selectArrow} viewBox="0 0 12 7" fill="none">
									<path d="M6 5.47458L11.2332 0.624569C11.2754 0.584638 11.3254 0.55307 11.3805 0.53169C11.4356 0.51031 11.4945 0.499544 11.554 0.500015C11.6135 0.500485 11.6722 0.512183 11.7269 0.534431C11.7816 0.556679 11.8311 0.589036 11.8726 0.629629C11.9141 0.670221 11.9467 0.718244 11.9685 0.770918C11.9904 0.823592 12.0011 0.879871 11.9999 0.936499C11.9988 0.993126 11.9859 1.04898 11.9619 1.10082C11.938 1.15266 11.9035 1.19947 11.8604 1.23853L6.31362 6.37867C6.22966 6.45647 6.11714 6.5 6 6.5C5.88286 6.5 5.77034 6.45647 5.68638 6.37867L0.139579 1.23853C0.0965156 1.19947 0.0620146 1.15266 0.0380697 1.10082C0.0141248 1.04898 0.00121305 0.993126 8.10432e-05 0.936498C-0.00105097 0.879871 0.00961875 0.823591 0.0314751 0.770917C0.0533304 0.718243 0.0859356 0.670221 0.127407 0.629628C0.168878 0.589035 0.218389 0.556678 0.273076 0.53443C0.327763 0.512182 0.386539 0.500485 0.446004 0.500014C0.505468 0.499544 0.564441 0.51031 0.619509 0.53169C0.674576 0.553069 0.724645 0.584638 0.766818 0.624569L6 5.47458Z" fill="#A9A9A9"/>
								</svg>
							</div>)}
						
						
						{currentStep >= 4 && configurator_store_1.configuratorStore.selectedStrapModelParams && (<StrapDesignSelectors_1.StrapDesignSelectors params={configurator_store_1.configuratorStore.selectedStrapModelParams} selectedStrapModel={configurator_store_1.configuratorStore.selectedStrapModel?.attributes.watch_strap}/>)}
					</div>)}
			</div>
			<nav className={ConfiguratorControls_module_css_1.default.configuratorControlsNav}>
				<button className={[ConfiguratorControls_module_css_1.default.btn, ConfiguratorControls_module_css_1.default.btnGhost].join(' ')} onClick={() => configurator_store_1.configuratorStore.prevStep()} disabled={configurator_store_1.configuratorStore.currentStepNum === 1}>Назад</button>
				{!isFinal ? (<button className={[ConfiguratorControls_module_css_1.default.btn, ConfiguratorControls_module_css_1.default.btnPrimary].join(' ')} onClick={() => configurator_store_1.configuratorStore.nextStep()} disabled={!configurator_store_1.configuratorStore.nextStepReady}>Далее</button>) : (<button className={[ConfiguratorControls_module_css_1.default.btn, ConfiguratorControls_module_css_1.default.btnPrimary].join(' ')} onClick={() => configurator_store_1.configuratorStore.showOrderPopup()}>
						Перейти к оформлению
					</button>)}
			</nav>
		</div>);
});
//# sourceMappingURL=ConfiguratorControls.js.map