"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrapDesignStep = void 0;
const mobx_react_lite_1 = require("mobx-react-lite");
const configurator_store_1 = require("@/shared/store/configurator.store");
const StrapDesignStep_module_css_1 = __importDefault(require("./StrapDesignStep.module.css"));
const StrapDesignPreview_1 = require("./StrapDesignPreview");
const StrapDesignParams_1 = require("./StrapDesignParams");
exports.StrapDesignStep = (0, mobx_react_lite_1.observer)(function StrapDesignStep() {
    const selectedStrapModel = configurator_store_1.configuratorStore.selectedStrapModel;
    const selectedStrapModelParams = configurator_store_1.configuratorStore.selectedStrapModelParams;
    if (!selectedStrapModel || !selectedStrapModelParams) {
        return null;
    }
    const strapData = selectedStrapModel.attributes.watch_strap;
    return (<div className={StrapDesignStep_module_css_1.default.step}>
			<div className={StrapDesignStep_module_css_1.default.stepContent}>
				<StrapDesignPreview_1.StrapDesignPreview className={StrapDesignStep_module_css_1.default.stepColumn} layout="grid"/>
				<div className={StrapDesignStep_module_css_1.default.stepRightColumn}>
					<h3 className={StrapDesignStep_module_css_1.default.stepTitle}>
						Ваш ремешок {strapData.strap_title}
					</h3>
					<p className={StrapDesignStep_module_css_1.default.stepPrice}>{strapData.price} ₽</p>
					<div className={StrapDesignStep_module_css_1.default.stepDescription}>
						<p className={StrapDesignStep_module_css_1.default.stepDescriptionText} dangerouslySetInnerHTML={{ __html: strapData.strap_description || '' }}/>
					</div>
					<StrapDesignParams_1.StrapDesignParams params={selectedStrapModelParams} selectedStrapModel={strapData}/>
					<button className={StrapDesignStep_module_css_1.default.stepNextStepBtn} disabled={!configurator_store_1.configuratorStore.nextStepReady} onClick={() => configurator_store_1.configuratorStore.nextStep()}>
						Далее {configurator_store_1.configuratorStore.currentStepNum + 1}/{configurator_store_1.configuratorStore.stepsAmount}
					</button>
				</div>
			</div>
		</div>);
});
//# sourceMappingURL=StrapDesignStep.js.map