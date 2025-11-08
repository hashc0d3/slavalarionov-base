"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalStepAdditional = void 0;
const mobx_react_lite_1 = require("mobx-react-lite");
const configurator_store_1 = require("@/shared/store/configurator.store");
const FinalStepAdditional_module_css_1 = __importDefault(require("./FinalStepAdditional.module.css"));
exports.FinalStepAdditional = (0, mobx_react_lite_1.observer)(function FinalStepAdditional({ className }) {
    const additionalOptions = configurator_store_1.configuratorStore.additionalOption?.data.attributes.additional_options || [];
    const getOptionChoosen = (optionName) => {
        switch (optionName) {
            case 'initials':
                return configurator_store_1.configuratorStore.steps.final.additionalOptions.initials.choosen;
            case 'present_box':
                return configurator_store_1.configuratorStore.steps.final.additionalOptions.presentBox.choosen;
            case 'postcard':
                return configurator_store_1.configuratorStore.steps.final.additionalOptions.postCard.choosen;
            default:
                return false;
        }
    };
    const handleOptionClick = (optionId) => {
        switch (optionId) {
            case 'initials':
                configurator_store_1.configuratorStore.toggleInitials(!configurator_store_1.configuratorStore.steps.final.additionalOptions.initials.choosen);
                break;
            case 'present_box':
                configurator_store_1.configuratorStore.togglePresentBox(!configurator_store_1.configuratorStore.steps.final.additionalOptions.presentBox.choosen);
                break;
            case 'postcard':
                configurator_store_1.configuratorStore.togglePostCard(!configurator_store_1.configuratorStore.steps.final.additionalOptions.postCard.choosen);
                break;
        }
    };
    const handleInputChange = (optionId, value) => {
        switch (optionId) {
            case 'initials':
                configurator_store_1.configuratorStore.setInitialsText(value);
                break;
            case 'postcard':
                configurator_store_1.configuratorStore.setPostCardText(value);
                break;
        }
    };
    return (<div className={`${FinalStepAdditional_module_css_1.default.additional} ${className || ''}`}>
			{additionalOptions.map((option) => {
            const isChoosen = getOptionChoosen(option.option_name);
            return (<div key={option.option_name} className={`${FinalStepAdditional_module_css_1.default.additionalOption} ${isChoosen ? FinalStepAdditional_module_css_1.default.choosen : ''} ${(option.option_name === 'initials' || option.option_name === 'postcard') ? FinalStepAdditional_module_css_1.default.captionOption : ''}`}>
					<div className={FinalStepAdditional_module_css_1.default.additionalOptionField} onClick={() => handleOptionClick(option.option_name)}>
						<div className={FinalStepAdditional_module_css_1.default.additionalOptionInner}>
							<div className={FinalStepAdditional_module_css_1.default.additionalOptionTitle}>
								{option.option_title}
							</div>
							<div className={FinalStepAdditional_module_css_1.default.additionalOptionPrice}>
								+ {option.option_price}₽
							</div>
						</div>
						
						{option.option_name === 'initials' && (<input className={FinalStepAdditional_module_css_1.default.captionOptionInput} placeholder="А.А." maxLength={4} value={configurator_store_1.configuratorStore.steps.final.additionalOptions.initials.text || ''} onChange={(e) => handleInputChange(option.option_name, e.target.value)} onClick={(e) => e.stopPropagation()}/>)}
						
						{option.option_name === 'postcard' && (<textarea className={`${FinalStepAdditional_module_css_1.default.captionOptionInput} ${FinalStepAdditional_module_css_1.default.postCardInput}`} placeholder="Надпись" value={configurator_store_1.configuratorStore.steps.final.additionalOptions.postCard.text || ''} onChange={(e) => handleInputChange(option.option_name, e.target.value)} onClick={(e) => e.stopPropagation()}/>)}
						
						<div className={FinalStepAdditional_module_css_1.default.additionalOptionPlus}>+</div>
					</div>
					
					<div className={FinalStepAdditional_module_css_1.default.additionalOptionImageInner}>
						<img src={`https://api.slavalarionov.store${option.option_image.data.attributes.url}`} alt={option.option_title} className={FinalStepAdditional_module_css_1.default.additionalOptionImage}/>
					</div>
				</div>);
        })}
		</div>);
});
//# sourceMappingURL=FinalStepAdditional.js.map