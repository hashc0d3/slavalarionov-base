"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepsFrameColors = void 0;
const StepsFrameColors_module_css_1 = __importDefault(require("./StepsFrameColors.module.css"));
const mobx_react_lite_1 = require("mobx-react-lite");
const configurator_store_1 = require("@/shared/store/configurator.store");
exports.StepsFrameColors = (0, mobx_react_lite_1.observer)(function StepsFrameColors() {
    const colors = configurator_store_1.configuratorStore.selectedWatchModelFrameColors;
    if (colors === null) {
        return (<div className={StepsFrameColors_module_css_1.default.root}>
				<div className={StepsFrameColors_module_css_1.default.inner}>
					<div className={[StepsFrameColors_module_css_1.default.item, StepsFrameColors_module_css_1.default.emptyItem].join(' ')}>
						<div className={StepsFrameColors_module_css_1.default.itemPreview}></div>
						<p className={StepsFrameColors_module_css_1.default.itemName}>Цвет часов</p>
					</div>
				</div>
			</div>);
    }
    if (!colors?.length)
        return null;
    return (<div className={StepsFrameColors_module_css_1.default.root}>
			<div className={StepsFrameColors_module_css_1.default.inner}>
				<div className={StepsFrameColors_module_css_1.default.itemsRow}>
					{colors.map((color) => (<button key={color.color_name} type="button" className={[StepsFrameColors_module_css_1.default.item, color.choosen ? StepsFrameColors_module_css_1.default.choosen : ''].join(' ')} onClick={() => configurator_store_1.configuratorStore.chooseFrameColor(color.color_name)}>
							<div className={StepsFrameColors_module_css_1.default.itemPreview} style={{ background: color.color_code || '#e9e9e9' }}/>
							<p className={StepsFrameColors_module_css_1.default.itemName}>{color.color_name}</p>
						</button>))}
				</div>
			</div>
		</div>);
});
//# sourceMappingURL=StepsFrameColors.js.map