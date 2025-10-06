"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionConfigurator = void 0;
const SectionConfigurator_module_css_1 = __importDefault(require("./SectionConfigurator.module.css"));
const mobx_react_lite_1 = require("mobx-react-lite");
const ConfiguratorSteps_1 = require("./steps/ConfiguratorSteps");
const ConfiguratorControls_1 = require("./controls/ConfiguratorControls");
const StepsProgress_1 = require("./steps/StepsProgress");
exports.SectionConfigurator = (0, mobx_react_lite_1.observer)(function SectionConfigurator() {
    return (<section className={SectionConfigurator_module_css_1.default.configuratorSection}>
			<div className={["container", SectionConfigurator_module_css_1.default.container, SectionConfigurator_module_css_1.default.configuratorSectionContainer].join(' ')}>
				<h2 className={SectionConfigurator_module_css_1.default.configuratorTitle}>Создай уникальный ремешок для своих Apple Watch</h2>
				<div className={SectionConfigurator_module_css_1.default.configuratorContent}>
					<StepsProgress_1.StepsProgress />
					<div className={SectionConfigurator_module_css_1.default.configuratorFixedViewLayer}></div>
					<ConfiguratorControls_1.ConfiguratorControls />
					<ConfiguratorSteps_1.ConfiguratorSteps />
				</div>
			</div>
		</section>);
});
//# sourceMappingURL=SectionConfigurator.js.map