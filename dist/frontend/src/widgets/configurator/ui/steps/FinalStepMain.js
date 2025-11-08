"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalStepMain = void 0;
const mobx_react_lite_1 = require("mobx-react-lite");
const configurator_store_1 = require("@/shared/store/configurator.store");
const FinalStepMain_module_css_1 = __importDefault(require("./FinalStepMain.module.css"));
const StrapDesignPreview_1 = require("./StrapDesignPreview");
exports.FinalStepMain = (0, mobx_react_lite_1.observer)(function FinalStepMain({ className }) {
    const handleDownloadRender = () => {
        console.log('Downloading render...');
    };
    const additionalOption = configurator_store_1.configuratorStore.additionalOption;
    return (<div className={`${FinalStepMain_module_css_1.default.main} ${className || ''}`}>
			<div className={FinalStepMain_module_css_1.default.mainData}>
				<h3 className={FinalStepMain_module_css_1.default.mainTitle}>
					{additionalOption?.data.attributes.title || 'Ремешок почти готов!'}
				</h3>
				<p className={FinalStepMain_module_css_1.default.mainDescription}>
					{additionalOption?.data.attributes.description || 'Вы создали уникальный ремешок и он просто прекрасен! Сейчас вы можете добавить инициалы (2-3 буквы на русском или английском языке), добавить подарочную упаковку и подписать открытку, которую мы приложим к этому ремешку.'}
				</p>
				<div className={FinalStepMain_module_css_1.default.mainLoadRender} onClick={handleDownloadRender}>
					<button className={FinalStepMain_module_css_1.default.mainLoadRenderBtn}>+</button>
					<p className={FinalStepMain_module_css_1.default.mainLoadRenderText}>
						Скачайте рендер вашего будущего ремешка
					</p>
				</div>
			</div>
			<div className={FinalStepMain_module_css_1.default.mainDesign}>
				<StrapDesignPreview_1.StrapDesignPreview className={FinalStepMain_module_css_1.default.mainDesignPreview} variant="final" layout="flex"/>
			</div>
		</div>);
});
//# sourceMappingURL=FinalStepMain.js.map