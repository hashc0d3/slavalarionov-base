"use client"

import styles from './ConfiguratorControls.module.css'
import { observer } from 'mobx-react-lite'
import { configuratorStore } from '@/shared/store/configurator.store'
import { StrapDesignSelectors } from '../steps/StrapDesignSelectors'

export const ConfiguratorControls = observer(function ConfiguratorControls() {
	const isFinal = configuratorStore.currentStepNum === configuratorStore.stepsAmount
	const currentStep = configuratorStore.currentStepNum
	
	return (
		<div className={styles.configuratorControls}>
			<div>
				{currentStep > 1 && (
					<div className={styles.selectsContainer}>
						{/* Watch model select - показывать на всех шагах начиная со 2-го */}
						<div className={styles.selectWrapper}>
							<select 
								className={styles.select}
								value={configuratorStore.selectedWatchModel?.watch_model_name || ''}
								onChange={(e) => configuratorStore.updateSelectedModel(e.target.value)}
							>
								{configuratorStore.watchModels.map((model) => (
									<option key={model.watch_model_name} value={model.watch_model_name}>
										{model.watch_model_name}
									</option>
								))}
							</select>
							<svg className={styles.selectArrow} viewBox="0 0 12 7" fill="none">
								<path d="M6 5.47458L11.2332 0.624569C11.2754 0.584638 11.3254 0.55307 11.3805 0.53169C11.4356 0.51031 11.4945 0.499544 11.554 0.500015C11.6135 0.500485 11.6722 0.512183 11.7269 0.534431C11.7816 0.556679 11.8311 0.589036 11.8726 0.629629C11.9141 0.670221 11.9467 0.718244 11.9685 0.770918C11.9904 0.823592 12.0011 0.879871 11.9999 0.936499C11.9988 0.993126 11.9859 1.04898 11.9619 1.10082C11.938 1.15266 11.9035 1.19947 11.8604 1.23853L6.31362 6.37867C6.22966 6.45647 6.11714 6.5 6 6.5C5.88286 6.5 5.77034 6.45647 5.68638 6.37867L0.139579 1.23853C0.0965156 1.19947 0.0620146 1.15266 0.0380697 1.10082C0.0141248 1.04898 0.00121305 0.993126 8.10432e-05 0.936498C-0.00105097 0.879871 0.00961875 0.823591 0.0314751 0.770917C0.0533304 0.718243 0.0859356 0.670221 0.127407 0.629628C0.168878 0.589035 0.218389 0.556678 0.273076 0.53443C0.327763 0.512182 0.386539 0.500485 0.446004 0.500014C0.505468 0.499544 0.564441 0.51031 0.619509 0.53169C0.674576 0.553069 0.724645 0.584638 0.766818 0.624569L6 5.47458Z" fill="#A9A9A9"/>
							</svg>
						</div>
						
						{/* Watch size select - показывать на всех шагах начиная со 2-го */}
						{configuratorStore.selectedWatchModelAllSizes && (
							<div className={styles.selectWrapper}>
								<select 
									className={styles.select}
									value={configuratorStore.selectedWatchModelAllSizes.find(s => s.choosen)?.watch_size || ''}
									onChange={(e) => configuratorStore.updateWatchModelSize(e.target.value)}
								>
									{configuratorStore.selectedWatchModelAllSizes.map((size) => (
										<option key={size.watch_size} value={size.watch_size}>
											{size.watch_size}mm
										</option>
									))}
								</select>
								<svg className={styles.selectArrow} viewBox="0 0 12 7" fill="none">
									<path d="M6 5.47458L11.2332 0.624569C11.2754 0.584638 11.3254 0.55307 11.3805 0.53169C11.4356 0.51031 11.4945 0.499544 11.554 0.500015C11.6135 0.500485 11.6722 0.512183 11.7269 0.534431C11.7816 0.556679 11.8311 0.589036 11.8726 0.629629C11.9141 0.670221 11.9467 0.718244 11.9685 0.770918C11.9904 0.823592 12.0011 0.879871 11.9999 0.936499C11.9988 0.993126 11.9859 1.04898 11.9619 1.10082C11.938 1.15266 11.9035 1.19947 11.8604 1.23853L6.31362 6.37867C6.22966 6.45647 6.11714 6.5 6 6.5C5.88286 6.5 5.77034 6.45647 5.68638 6.37867L0.139579 1.23853C0.0965156 1.19947 0.0620146 1.15266 0.0380697 1.10082C0.0141248 1.04898 0.00121305 0.993126 8.10432e-05 0.936498C-0.00105097 0.879871 0.00961875 0.823591 0.0314751 0.770917C0.0533304 0.718243 0.0859356 0.670221 0.127407 0.629628C0.168878 0.589035 0.218389 0.556678 0.273076 0.53443C0.327763 0.512182 0.386539 0.500485 0.446004 0.500014C0.505468 0.499544 0.564441 0.51031 0.619509 0.53169C0.674576 0.553069 0.724645 0.584638 0.766818 0.624569L6 5.47458Z" fill="#A9A9A9"/>
								</svg>
							</div>
						)}
						
						{/* Frame color select - показывать на всех шагах начиная со 2-го */}
						{configuratorStore.selectedWatchModelFrameColors && (
							<div className={styles.selectWrapper}>
								<select 
									className={styles.select}
									value={configuratorStore.selectedFrameColor?.color_name || ''}
									onChange={(e) => configuratorStore.updateSelectedFrameColor(e.target.value)}
								>
									{configuratorStore.selectedWatchModelFrameColors.map((color) => (
										<option key={color.color_name} value={color.color_name}>
											{color.color_name}
										</option>
									))}
								</select>
								<svg className={styles.selectArrow} viewBox="0 0 12 7" fill="none">
									<path d="M6 5.47458L11.2332 0.624569C11.2754 0.584638 11.3254 0.55307 11.3805 0.53169C11.4356 0.51031 11.4945 0.499544 11.554 0.500015C11.6135 0.500485 11.6722 0.512183 11.7269 0.534431C11.7816 0.556679 11.8311 0.589036 11.8726 0.629629C11.9141 0.670221 11.9467 0.718244 11.9685 0.770918C11.9904 0.823592 12.0011 0.879871 11.9999 0.936499C11.9988 0.993126 11.9859 1.04898 11.9619 1.10082C11.938 1.15266 11.9035 1.19947 11.8604 1.23853L6.31362 6.37867C6.22966 6.45647 6.11714 6.5 6 6.5C5.88286 6.5 5.77034 6.45647 5.68638 6.37867L0.139579 1.23853C0.0965156 1.19947 0.0620146 1.15266 0.0380697 1.10082C0.0141248 1.04898 0.00121305 0.993126 8.10432e-05 0.936498C-0.00105097 0.879871 0.00961875 0.823591 0.0314751 0.770917C0.0533304 0.718243 0.0859356 0.670221 0.127407 0.629628C0.168878 0.589035 0.218389 0.556678 0.273076 0.53443C0.327763 0.512182 0.386539 0.500485 0.446004 0.500014C0.505468 0.499544 0.564441 0.51031 0.619509 0.53169C0.674576 0.553069 0.724645 0.584638 0.766818 0.624569L6 5.47458Z" fill="#A9A9A9"/>
								</svg>
							</div>
						)}
						
					{/* Strap model select - показывать только на шагах 3 и 4 */}
					{currentStep >= 3 && configuratorStore.availableWatchStraps && configuratorStore.availableWatchStraps.length > 0 && (
						<div className={styles.selectWrapper}>
							<select 
								className={styles.select}
								value={configuratorStore.selectedStrapModel?.attributes.watch_strap.id || ''}
								onChange={(e) => configuratorStore.chooseStrapModel(Number(e.target.value))}
							>
								{configuratorStore.availableWatchStraps.map((strap) => (
										<option key={strap.attributes.watch_strap.id} value={strap.attributes.watch_strap.id}>
											{strap.attributes.watch_strap.strap_title}
										</option>
									))}
								</select>
								<svg className={styles.selectArrow} viewBox="0 0 12 7" fill="none">
									<path d="M6 5.47458L11.2332 0.624569C11.2754 0.584638 11.3254 0.55307 11.3805 0.53169C11.4356 0.51031 11.4945 0.499544 11.554 0.500015C11.6135 0.500485 11.6722 0.512183 11.7269 0.534431C11.7816 0.556679 11.8311 0.589036 11.8726 0.629629C11.9141 0.670221 11.9467 0.718244 11.9685 0.770918C11.9904 0.823592 12.0011 0.879871 11.9999 0.936499C11.9988 0.993126 11.9859 1.04898 11.9619 1.10082C11.938 1.15266 11.9035 1.19947 11.8604 1.23853L6.31362 6.37867C6.22966 6.45647 6.11714 6.5 6 6.5C5.88286 6.5 5.77034 6.45647 5.68638 6.37867L0.139579 1.23853C0.0965156 1.19947 0.0620146 1.15266 0.0380697 1.10082C0.0141248 1.04898 0.00121305 0.993126 8.10432e-05 0.936498C-0.00105097 0.879871 0.00961875 0.823591 0.0314751 0.770917C0.0533304 0.718243 0.0859356 0.670221 0.127407 0.629628C0.168878 0.589035 0.218389 0.556678 0.273076 0.53443C0.327763 0.512182 0.386539 0.500485 0.446004 0.500014C0.505468 0.499544 0.564441 0.51031 0.619509 0.53169C0.674576 0.553069 0.724645 0.584638 0.766818 0.624569L6 5.47458Z" fill="#A9A9A9"/>
								</svg>
							</div>
						)}
						
						{/* Strap design selectors - показывать только на шаге 4 */}
						{currentStep >= 4 && configuratorStore.selectedStrapModelParams && (
							<StrapDesignSelectors 
								params={configuratorStore.selectedStrapModelParams}
								selectedStrapModel={configuratorStore.selectedStrapModel?.attributes.watch_strap}
							/>
						)}
					</div>
				)}
			</div>
			<nav className={styles.configuratorControlsNav}>
				<button className={[styles.btn, styles.btnGhost].join(' ')} onClick={() => configuratorStore.prevStep()} disabled={configuratorStore.currentStepNum === 1}>Назад</button>
				{!isFinal ? (
					<button className={[styles.btn, styles.btnPrimary].join(' ')} onClick={() => configuratorStore.nextStep()} disabled={!configuratorStore.nextStepReady}>Далее</button>
				) : (
					<button className={[styles.btn, styles.btnPrimary].join(' ')} onClick={() => configuratorStore.showOrderPopup()}>
						Перейти к оформлению
					</button>
				)}
			</nav>
		</div>
	)
})
