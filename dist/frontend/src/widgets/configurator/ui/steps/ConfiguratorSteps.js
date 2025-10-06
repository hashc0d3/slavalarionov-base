"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguratorSteps = void 0;
const ConfiguratorSteps_module_css_1 = __importDefault(require("./ConfiguratorSteps.module.css"));
const mobx_react_lite_1 = require("mobx-react-lite");
const configurator_store_1 = require("@/shared/store/configurator.store");
const StepsFrameColors_1 = require("./StepsFrameColors");
const react_1 = require("react");
exports.ConfiguratorSteps = (0, mobx_react_lite_1.observer)(function ConfiguratorSteps() {
    const step = configurator_store_1.configuratorStore.currentStepNum;
    const prevStepRef = (0, react_1.useRef)(step);
    const [animClass, setAnimClass] = (0, react_1.useState)(ConfiguratorSteps_module_css_1.default.fadeRightStatic);
    (0, react_1.useEffect)(() => {
        const prev = prevStepRef.current;
        const next = configurator_store_1.configuratorStore.currentStepNum;
        setAnimClass(prev > next ? ConfiguratorSteps_module_css_1.default.fadeLeftStatic : ConfiguratorSteps_module_css_1.default.fadeRightStatic);
        prevStepRef.current = next;
    }, [configurator_store_1.configuratorStore.currentStepNum]);
    return (<div className={ConfiguratorSteps_module_css_1.default.configuratorSteps}>
			{step === 1 && (<section className={[ConfiguratorSteps_module_css_1.default.section, animClass].join(' ')}>
					<div className={ConfiguratorSteps_module_css_1.default.stepInner}>
						{configurator_store_1.configuratorStore.watchModels.map((model, idx) => (<div key={model.watch_model_name} className={[ConfiguratorSteps_module_css_1.default.stepItem, model.choosen ? ConfiguratorSteps_module_css_1.default.choosen : ''].join(' ')} onClick={() => !model.choosen && configurator_store_1.configuratorStore.chooseWatchModel(idx)}>
								<img src={model.main_image || '/window.svg'} width={150} height={270} alt="" className={ConfiguratorSteps_module_css_1.default.stepItemImage}/>
								<div className={ConfiguratorSteps_module_css_1.default.stepItemInfo}>
									<div className={ConfiguratorSteps_module_css_1.default.stepItemTitle}>
										<p className={ConfiguratorSteps_module_css_1.default.stepItemTitlePart}>{model.watch_model_manufacturer}</p>
										<p className={ConfiguratorSteps_module_css_1.default.stepItemTitlePart}>{model.watch_model_name}</p>
									</div>
									<div className={ConfiguratorSteps_module_css_1.default.stepItemSizes}>
										{model.watch_sizes.map((size, id) => (<button key={size.watch_size} type="button" className={[ConfiguratorSteps_module_css_1.default.stepItemSizesItem, size.choosen ? ConfiguratorSteps_module_css_1.default.choosen : ''].join(' ')} onClick={(e) => { e.stopPropagation(); configurator_store_1.configuratorStore.chooseWatchModel(idx, id); }}>
												{size.watch_size}mm
											</button>))}
									</div>
								</div>
								{model.choosen && (<div className={ConfiguratorSteps_module_css_1.default.stepItemColors}>
										{configurator_store_1.configuratorStore.selectedWatchModelFrameColors?.map((color) => (<button key={color.color_name} className={[ConfiguratorSteps_module_css_1.default.stepItemColor, color.choosen ? ConfiguratorSteps_module_css_1.default.choosen : ''].join(' ')} onClick={(e) => { e.stopPropagation(); configurator_store_1.configuratorStore.chooseFrameColor(color.color_name); }}>
												<span className={ConfiguratorSteps_module_css_1.default.stepItemColorPreview} style={{ background: color.color_code || '#eee' }}/>
											</button>))}
									</div>)}
							</div>))}
					</div>
					<StepsFrameColors_1.StepsFrameColors />
				</section>)}

			{step === 2 && (<section className={[ConfiguratorSteps_module_css_1.default.section, animClass].join(' ')}>
					<h3>{configurator_store_1.configuratorStore.steps.strap.title}</h3>
					<ul className={ConfiguratorSteps_module_css_1.default.list}>
						{configurator_store_1.configuratorStore.watchStraps.map((s) => (<li key={s.attributes.watch_strap.id}>
								<label className={ConfiguratorSteps_module_css_1.default.item}>
									<input type="radio" name="strap" checked={s.choosen} onChange={() => configurator_store_1.configuratorStore.chooseStrapModel(s.attributes.watch_strap.id)}/>
									<span>{s.attributes.watch_strap.strap_title} — {s.attributes.watch_strap.price} ₽</span>
								</label>
							</li>))}
					</ul>
				</section>)}

			{step === 3 && (<section className={[ConfiguratorSteps_module_css_1.default.section, animClass].join(' ')}>
					<h3>{configurator_store_1.configuratorStore.steps.strapDesign.title}</h3>
					<div className={ConfiguratorSteps_module_css_1.default.pillsGrid}>
						<div>
							<p className={ConfiguratorSteps_module_css_1.default.pillTitle}>Кожа</p>
							<div className={ConfiguratorSteps_module_css_1.default.pillsRow}>
								{configurator_store_1.configuratorStore.selectedStrapModelParams?.leather_colors.map((c) => (<button key={c.color_title} className={[ConfiguratorSteps_module_css_1.default.pill, c.choosen ? ConfiguratorSteps_module_css_1.default.pillActive : ''].join(' ')} onClick={() => configurator_store_1.configuratorStore.chooseStrapLeatherColor(c.color_title)}>
										<span className={ConfiguratorSteps_module_css_1.default.pillPreview} style={{ background: c.color_code || '#e9e9e9' }}/>
										<span className={ConfiguratorSteps_module_css_1.default.pillName}>{c.color_title}</span>
									</button>))}
							</div>
						</div>
						<div>
							<p className={ConfiguratorSteps_module_css_1.default.pillTitle}>Строчка</p>
							<div className={ConfiguratorSteps_module_css_1.default.pillsRow}>
								{configurator_store_1.configuratorStore.selectedStrapModelParams?.stitching_colors.map((c) => (<button key={c.color_title} className={[ConfiguratorSteps_module_css_1.default.pill, c.choosen ? ConfiguratorSteps_module_css_1.default.pillActive : ''].join(' ')} onClick={() => configurator_store_1.configuratorStore.chooseStitchingColor(c.color_title)}>
										<span className={ConfiguratorSteps_module_css_1.default.pillPreview} style={{ background: c.color_code || '#e9e9e9' }}/>
										<span className={ConfiguratorSteps_module_css_1.default.pillName}>{c.color_title}</span>
									</button>))}
							</div>
						</div>
						<div>
							<p className={ConfiguratorSteps_module_css_1.default.pillTitle}>Край</p>
							<div className={ConfiguratorSteps_module_css_1.default.pillsRow}>
								{configurator_store_1.configuratorStore.selectedStrapModelParams?.edge_colors.map((c) => (<button key={c.color_title} className={[ConfiguratorSteps_module_css_1.default.pill, c.choosen ? ConfiguratorSteps_module_css_1.default.pillActive : ''].join(' ')} onClick={() => configurator_store_1.configuratorStore.chooseEdgeColor(c.color_title)}>
										<span className={ConfiguratorSteps_module_css_1.default.pillPreview} style={{ background: c.color_code || '#e9e9e9' }}/>
										<span className={ConfiguratorSteps_module_css_1.default.pillName}>{c.color_title}</span>
									</button>))}
							</div>
						</div>
						<div>
							<p className={ConfiguratorSteps_module_css_1.default.pillTitle}>Пряжка</p>
							<div className={ConfiguratorSteps_module_css_1.default.pillsRow}>
								{configurator_store_1.configuratorStore.selectedStrapModelParams?.buckle_colors.map((c) => (<button key={c.color_title} className={[ConfiguratorSteps_module_css_1.default.pill, c.choosen ? ConfiguratorSteps_module_css_1.default.pillActive : ''].join(' ')} onClick={() => configurator_store_1.configuratorStore.chooseBuckleColor(c.color_title)}>
										<span className={ConfiguratorSteps_module_css_1.default.pillPreview} style={{ background: c.color_code || '#e9e9e9' }}/>
										<span className={ConfiguratorSteps_module_css_1.default.pillName}>{c.color_title}</span>
									</button>))}
							</div>
						</div>
						<div>
							<p className={ConfiguratorSteps_module_css_1.default.pillTitle}>Адаптер</p>
							<div className={ConfiguratorSteps_module_css_1.default.pillsRow}>
								{configurator_store_1.configuratorStore.selectedStrapModelParams?.adapter_colors.map((c) => (<button key={c.color_title} className={[ConfiguratorSteps_module_css_1.default.pill, c.choosen ? ConfiguratorSteps_module_css_1.default.pillActive : ''].join(' ')} onClick={() => configurator_store_1.configuratorStore.chooseAdapterColor(c.color_title)}>
										<span className={ConfiguratorSteps_module_css_1.default.pillPreview} style={{ background: c.color_code || '#e9e9e9' }}/>
										<span className={ConfiguratorSteps_module_css_1.default.pillName}>{c.color_title}</span>
									</button>))}
							</div>
						</div>
					</div>
				</section>)}

			{step === 4 && (<section className={[ConfiguratorSteps_module_css_1.default.section, animClass].join(' ')}>
					<h3>{configurator_store_1.configuratorStore.steps.final.title}</h3>
					<div className={ConfiguratorSteps_module_css_1.default.finalGrid}>
						<label className={ConfiguratorSteps_module_css_1.default.finalRow}><input type="checkbox" checked={configurator_store_1.configuratorStore.steps.final.additionalOptions.initials.choosen} onChange={(e) => configurator_store_1.configuratorStore.toggleInitials(e.target.checked)}/> Инициалы (+{configurator_store_1.configuratorStore.steps.final.additionalOptions.initials.price} ₽)</label>
						<label className={ConfiguratorSteps_module_css_1.default.finalRow}><input type="checkbox" checked={configurator_store_1.configuratorStore.steps.final.additionalOptions.presentBox.choosen} onChange={(e) => configurator_store_1.configuratorStore.togglePresentBox(e.target.checked)}/> Подарочная коробка (+{configurator_store_1.configuratorStore.steps.final.additionalOptions.presentBox.price} ₽)</label>
						<label className={ConfiguratorSteps_module_css_1.default.finalRow}><input type="checkbox" checked={configurator_store_1.configuratorStore.steps.final.additionalOptions.postCard.choosen} onChange={(e) => configurator_store_1.configuratorStore.togglePostCard(e.target.checked)}/> Открытка (+{configurator_store_1.configuratorStore.steps.final.additionalOptions.postCard.price} ₽)</label>
						<div className={ConfiguratorSteps_module_css_1.default.promoRow}>
							<input placeholder="Промокод" value={configurator_store_1.configuratorStore.promoCode || ''} onChange={(e) => configurator_store_1.configuratorStore.updatePromoCodeValue(e.target.value)}/>
							<button onClick={() => configurator_store_1.configuratorStore.applyPromo(configurator_store_1.configuratorStore.promoCode || '')}>Применить</button>
							{configurator_store_1.configuratorStore.promoAccepted && <span>Скидка применена</span>}
						</div>
						<div className={ConfiguratorSteps_module_css_1.default.totalBox}>Итого: {configurator_store_1.configuratorStore.totalPriceWithDiscount} ₽</div>
					</div>
				</section>)}
		</div>);
});
//# sourceMappingURL=ConfiguratorSteps.js.map