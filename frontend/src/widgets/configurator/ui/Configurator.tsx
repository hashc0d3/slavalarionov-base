"use client"

import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'

export const Configurator = observer(function Configurator() {
	const step = configuratorStore.currentStepNum

	return (
		<div style={{ padding: 24 }}>
			<h1>Конфигуратор ремешков</h1>
			<p>Шаг {step} из {configuratorStore.stepsAmount}</p>

			{step === 1 && (
				<div>
					<h2>{configuratorStore.steps.model.title}</h2>
					<ul>
						{configuratorStore.watchModels.map((m, idx) => (
							<li key={m.watch_model_name} style={{ marginBottom: 8 }}>
								<label style={{ display: 'block', cursor: 'pointer' }}>
									<input
										type="radio"
										name="watch"
										checked={m.choosen}
										onChange={() => configuratorStore.chooseWatchModel(idx, 0)}
									/>
									{m.watch_model_name}
								</label>
							</li>
						))}
					</ul>
				</div>
			)}

		{step === 2 && (
			<div>
				<h2>{configuratorStore.steps.strap.title}</h2>
				<ul>
					{configuratorStore.availableWatchStraps.map((s) => (
							<li key={s.attributes.watch_strap.id} style={{ marginBottom: 8 }}>
								<label style={{ display: 'block', cursor: 'pointer' }}>
									<input
										type="radio"
										name="strap"
										checked={s.choosen}
										onChange={() => configuratorStore.chooseStrapModel(s.attributes.watch_strap.id)}
									/>
									{s.attributes.watch_strap.strap_title} — {s.attributes.watch_strap.price} ₽
								</label>
							</li>
						))}
					</ul>
				</div>
			)}

			{step === 3 && (
				<div>
					<h2>{configuratorStore.steps.strapDesign.title}</h2>
					<p>Выберите цвета (моки)</p>
				</div>
			)}

			{step === 4 && (
				<div>
					<h2>{configuratorStore.steps.final.title}</h2>
					<p>Итоговая цена: {configuratorStore.totalPrice} ₽</p>
				</div>
			)}

			<div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
				<button onClick={() => configuratorStore.prevStep()} disabled={step === 1}>Назад</button>
				<button onClick={() => configuratorStore.nextStep()} disabled={step === configuratorStore.stepsAmount}>Далее</button>
			</div>
		</div>
	)
})
