"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrapModelStep = void 0;
const StrapModelStep_module_css_1 = __importDefault(require("./StrapModelStep.module.css"));
const mobx_react_lite_1 = require("mobx-react-lite");
const configurator_store_1 = require("@/shared/store/configurator.store");
exports.StrapModelStep = (0, mobx_react_lite_1.observer)(function StrapModelStep() {
    const isUltra = configurator_store_1.configuratorStore.selectedWatchModel?.model_name.toLowerCase().includes('ultra');
    return (<div className={StrapModelStep_module_css_1.default.step}>
			<div className={StrapModelStep_module_css_1.default.stepWrapper}>
				{configurator_store_1.configuratorStore.watchStraps.map((strap) => (<div key={strap.attributes.watch_strap.id} className={[StrapModelStep_module_css_1.default.item, strap.choosen ? StrapModelStep_module_css_1.default.choosen : ''].join(' ')} onClick={() => configurator_store_1.configuratorStore.chooseStrapModel(strap.attributes.watch_strap.id)}>
						<div className={StrapModelStep_module_css_1.default.itemImageInner}>
							<img src={!isUltra
                ? strap.attributes.watch_strap.preview_image || '/window.svg'
                : strap.attributes.watch_strap.ultra_preview_image || '/window.svg'} width={150} height={185} alt="" className={StrapModelStep_module_css_1.default.itemImage}/>
						</div>
					<h4 className={StrapModelStep_module_css_1.default.itemTitle}>
						{strap.attributes.watch_strap.strap_title}
					</h4>
					<p className={StrapModelStep_module_css_1.default.itemDescription}>
						{strap.attributes.watch_strap.strap_short_description || strap.attributes.watch_strap.strap_description}
					</p>
						<p className={StrapModelStep_module_css_1.default.itemPrice}>
							{strap.attributes.watch_strap.price}₽
						</p>
						{strap.choosen && (<button className={StrapModelStep_module_css_1.default.itemNextBtn} onClick={() => configurator_store_1.configuratorStore.nextStep()}>
								Далее {configurator_store_1.configuratorStore.currentStepNum + 1}/{configurator_store_1.configuratorStore.stepsAmount}
							</button>)}
					</div>))}
			</div>
		</div>);
});
//# sourceMappingURL=StrapModelStep.js.map