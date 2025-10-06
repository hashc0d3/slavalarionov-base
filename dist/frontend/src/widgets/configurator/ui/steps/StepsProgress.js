"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepsProgress = void 0;
const StepsProgress_module_css_1 = __importDefault(require("./StepsProgress.module.css"));
const mobx_react_lite_1 = require("mobx-react-lite");
const configurator_store_1 = require("@/shared/store/configurator.store");
exports.StepsProgress = (0, mobx_react_lite_1.observer)(function StepsProgress() {
    const steps = configurator_store_1.configuratorStore.steps;
    const current = configurator_store_1.configuratorStore.currentStepNum;
    const stepsAmount = configurator_store_1.configuratorStore.stepsAmount;
    const canGoTo = (id) => id <= configurator_store_1.configuratorStore.currentAvailableStep;
    const navigate = (id) => { if (canGoTo(id))
        configurator_store_1.configuratorStore.currentStepNum = id; };
    return (<div className={StepsProgress_module_css_1.default.progress}>
			<div className={StepsProgress_module_css_1.default.progressList}>
				{Object.keys(steps).map((key) => {
            const item = steps[key];
            const isCurrent = current === item.id;
            const isCompleted = item.id <= current;
            return (<button key={key} type="button" onClick={() => navigate(item.id)} className={[StepsProgress_module_css_1.default.progressItem, isCurrent ? StepsProgress_module_css_1.default.current : '', isCompleted ? StepsProgress_module_css_1.default.completed : ''].join(' ')}>
							{isCurrent && (<span className={StepsProgress_module_css_1.default.progressItemNum}>{`${item.id}/${stepsAmount}`}</span>)}
							{item.title}
						</button>);
        })}
			</div>
		</div>);
});
//# sourceMappingURL=StepsProgress.js.map