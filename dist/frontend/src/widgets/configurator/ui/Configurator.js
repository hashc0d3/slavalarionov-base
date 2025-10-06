"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configurator = void 0;
const mobx_react_lite_1 = require("mobx-react-lite");
const configurator_store_1 = require("@/shared/store/configurator.store");
exports.Configurator = (0, mobx_react_lite_1.observer)(function Configurator() {
    const step = configurator_store_1.configuratorStore.currentStepNum;
    return (<div style={{ padding: 24 }}>
			<h1>Конфигуратор ремешков</h1>
			<p>Шаг {step} из {configurator_store_1.configuratorStore.stepsAmount}</p>

			{step === 1 && (<div>
					<h2>{configurator_store_1.configuratorStore.steps.model.title}</h2>
					<ul>
						{configurator_store_1.configuratorStore.watchModels.map((m, idx) => (<li key={m.watch_model_name} style={{ marginBottom: 8 }}>
								<label style={{ display: 'block', cursor: 'pointer' }}>
									<input type="radio" name="watch" checked={m.choosen} onChange={() => configurator_store_1.configuratorStore.chooseWatchModel(idx, 0)}/>
									{m.watch_model_name}
								</label>
							</li>))}
					</ul>
				</div>)}

			{step === 2 && (<div>
					<h2>{configurator_store_1.configuratorStore.steps.strap.title}</h2>
					<ul>
						{configurator_store_1.configuratorStore.watchStraps.map((s) => (<li key={s.attributes.watch_strap.id} style={{ marginBottom: 8 }}>
								<label style={{ display: 'block', cursor: 'pointer' }}>
									<input type="radio" name="strap" checked={s.choosen} onChange={() => configurator_store_1.configuratorStore.chooseStrapModel(s.attributes.watch_strap.id)}/>
									{s.attributes.watch_strap.strap_title} — {s.attributes.watch_strap.price} ₽
								</label>
							</li>))}
					</ul>
				</div>)}

			{step === 3 && (<div>
					<h2>{configurator_store_1.configuratorStore.steps.strapDesign.title}</h2>
					<p>Выберите цвета (моки)</p>
				</div>)}

			{step === 4 && (<div>
					<h2>{configurator_store_1.configuratorStore.steps.final.title}</h2>
					<p>Итоговая цена: {configurator_store_1.configuratorStore.totalPrice} ₽</p>
				</div>)}

			<div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
				<button onClick={() => configurator_store_1.configuratorStore.prevStep()} disabled={step === 1}>Назад</button>
				<button onClick={() => configurator_store_1.configuratorStore.nextStep()} disabled={step === configurator_store_1.configuratorStore.stepsAmount}>Далее</button>
			</div>
		</div>);
});
//# sourceMappingURL=Configurator.js.map