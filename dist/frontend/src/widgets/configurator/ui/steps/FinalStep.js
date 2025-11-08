"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalStep = void 0;
const mobx_react_lite_1 = require("mobx-react-lite");
const configurator_store_1 = require("@/shared/store/configurator.store");
const FinalStep_module_css_1 = __importDefault(require("./FinalStep.module.css"));
const FinalStepMain_1 = require("./FinalStepMain");
const FinalStepAdditional_1 = require("./FinalStepAdditional");
const FinalStepTotal_1 = require("./FinalStepTotal");
exports.FinalStep = (0, mobx_react_lite_1.observer)(function FinalStep() {
    const totalPrice = configurator_store_1.configuratorStore.totalPriceWithDiscount;
    const readyDate = configurator_store_1.configuratorStore.closestReadyDate;
    const handlePay = () => {
        configurator_store_1.configuratorStore.showOrderPopup();
    };
    return (<div className={FinalStep_module_css_1.default.step}>
			<FinalStepMain_1.FinalStepMain className={FinalStep_module_css_1.default.stepMain}/>
			<FinalStepAdditional_1.FinalStepAdditional className={FinalStep_module_css_1.default.stepAdditional}/>
			<FinalStepTotal_1.FinalStepTotal className={FinalStep_module_css_1.default.stepTotal} totalPrice={totalPrice} readyDate={readyDate} onPay={handlePay}/>
		</div>);
});
//# sourceMappingURL=FinalStep.js.map