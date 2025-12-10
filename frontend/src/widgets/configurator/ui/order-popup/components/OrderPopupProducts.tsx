import { configuratorStore } from '@/shared/store/configurator.store'
import { resolveMediaUrl, getMediaBaseUrl } from '@/shared/lib/media'
import { formatCurrency } from '../utils'
import s from '../OrderPopup.module.css'

type Props = {
	productsPrice: number
	productsPriceWithDiscount: number
	getItemView1ImageUrl: (item: any) => string | null
}

export function OrderPopupProducts({ productsPrice, productsPriceWithDiscount, getItemView1ImageUrl }: Props) {
	const baseImageUrl = `${getMediaBaseUrl()}/uploads`

	const getOverlayUrl = (color: any, type: string, strapName: string) => {
		if (!color) return null
		const dynamic = resolveMediaUrl(color.images?.view1)
		if (dynamic) return dynamic
		const colorName = (color.color_title || '').toLowerCase()
		return `${baseImageUrl}/${type}_${strapName}_${colorName}_1.png`
	}

	return (
		<section className={s.section}>
			<h4 className={s.sectionTitle}>
				Ваш заказ ({configuratorStore.cartItems.length} {configuratorStore.cartItems.length === 1 ? 'товар' : 'товара'})
			</h4>
			{configuratorStore.cartItems.map((item, index) => {
				const itemStrapName = item.strapModel?.attributes?.watch_strap?.strap_title || 'Ремешок'
				const itemFrameColor = item.frameColor?.color_name || ''
				const itemLeatherColor = item.leatherColor?.color_title || ''
				const itemStitchingColor = item.stitchingColor?.color_title || ''
				const itemEdgeColor = item.edgeColor?.color_title || ''
				const itemBuckleColor = item.buckleColor?.color_title || ''
				const itemAdapterColor = item.adapterColor?.color_title || ''
				const itemModelSize = item.watchModel?.watch_sizes?.find((s: any) => s.choosen)?.watch_size || ''
				const itemPrice = item.price || 0
				
				let itemPriceWithDiscount = itemPrice
				if (configuratorStore.promoAccepted && configuratorStore.usedPromo && productsPrice > 0) {
					const discountRatio = productsPriceWithDiscount / productsPrice
					itemPriceWithDiscount = itemPrice * discountRatio
				}
					
				const itemView1Url = getItemView1ImageUrl(item)
				const strapName = item.strapModel?.attributes?.watch_strap?.strap_name || 'classic'
				
				return (
					<div key={item.id || index} className={s.productCard} style={{ marginBottom: '16px' }}>
						<div className={s.productPreview} style={{ position: 'relative' }}>
							{itemView1Url ? (
								<>
									<img 
										src={itemView1Url} 
										alt={itemStrapName}
										style={{ 
											position: 'absolute',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%, -50%)',
											width: '85%', 
											height: '85%', 
											objectFit: 'contain' 
										}}
									/>
									{item.frameColor && resolveMediaUrl(item.frameColor.view1Image) && (
										<img 
											src={resolveMediaUrl(item.frameColor.view1Image)!}
											alt=""
											style={{ 
												position: 'absolute',
												top: '50%',
												left: '50%',
												transform: 'translate(-50%, -50%)',
												width: '85%', 
												height: '85%', 
												objectFit: 'contain',
												zIndex: 1,
												pointerEvents: 'none'
											}}
										/>
									)}
									{item.leatherColor && getOverlayUrl(item.leatherColor, 'leather', strapName) && (
										<img 
											src={getOverlayUrl(item.leatherColor, 'leather', strapName)!}
											alt=""
											style={{ 
												position: 'absolute',
												top: '50%',
												left: '50%',
												transform: 'translate(-50%, -50%)',
												width: '85%', 
												height: '85%', 
												objectFit: 'contain',
												zIndex: 2,
												pointerEvents: 'none'
											}}
										/>
									)}
									{item.stitchingColor && getOverlayUrl(item.stitchingColor, 'stitching', strapName) && (
										<img 
											src={getOverlayUrl(item.stitchingColor, 'stitching', strapName)!}
											alt=""
											style={{ 
												position: 'absolute',
												top: '50%',
												left: '50%',
												transform: 'translate(-50%, -50%)',
												width: '85%', 
												height: '85%', 
												objectFit: 'contain',
												zIndex: 2,
												pointerEvents: 'none'
											}}
										/>
									)}
									{item.edgeColor && getOverlayUrl(item.edgeColor, 'edge', strapName) && (
										<img 
											src={getOverlayUrl(item.edgeColor, 'edge', strapName)!}
											alt=""
											style={{ 
												position: 'absolute',
												top: '50%',
												left: '50%',
												transform: 'translate(-50%, -50%)',
												width: '85%', 
												height: '85%', 
												objectFit: 'contain',
												zIndex: 2,
												pointerEvents: 'none'
											}}
										/>
									)}
									{item.buckleColor && getOverlayUrl(item.buckleColor, 'buckle', strapName) && (
										<img 
											src={getOverlayUrl(item.buckleColor, 'buckle', strapName)!}
											alt=""
											style={{ 
												position: 'absolute',
												top: '50%',
												left: '50%',
												transform: 'translate(-50%, -50%)',
												width: '85%', 
												height: '85%', 
												objectFit: 'contain',
												zIndex: 2,
												pointerEvents: 'none'
											}}
										/>
									)}
									{item.adapterColor && getOverlayUrl(item.adapterColor, 'adapter', strapName) && (
										<img 
											src={getOverlayUrl(item.adapterColor, 'adapter', strapName)!}
											alt=""
											style={{ 
												position: 'absolute',
												top: '50%',
												left: '50%',
												transform: 'translate(-50%, -50%)',
												width: '85%', 
												height: '85%', 
												objectFit: 'contain',
												zIndex: 2,
												pointerEvents: 'none'
											}}
										/>
									)}
								</>
							) : (
								<div style={{ 
									width: '100%', 
									height: '100%', 
									display: 'flex', 
									alignItems: 'center', 
									justifyContent: 'center',
									background: '#f5f5f5',
									color: '#999'
								}}>
									Нет изображения
								</div>
							)}
						</div>
						<div className={s.productInfo}>
							<p className={s.productName}>
								{itemStrapName} / {itemLeatherColor}
							</p>
							<ul className={s.productDetails}>
								<li>Размер корпуса: {itemModelSize} мм</li>
								{itemFrameColor && <li>Цвет часов: {itemFrameColor}</li>}
								<li>Цвет адаптеров: {itemAdapterColor}</li>
								<li>Цвет пряжки: {itemBuckleColor}</li>
								<li>Цвет строчки: {itemStitchingColor}</li>
								<li>Цвет края: {itemEdgeColor}</li>
								{item.strapModel?.attributes?.watch_strap?.strap_params?.has_buckle_butterfly && (
									<li>
										Вид пряжки:{' '}
										{item.buckleButterfly ? 'Пряжка бабочка' : 'Стандартная'}
									</li>
								)}
								<li>
									Инициалы:{' '}
									{item.additionalOptions?.initials?.choosen
										? `${item.additionalOptions?.initials?.text || 'А.А.'} (+390 ₽)`
										: 'нет'}
								</li>
								<li>
									Подарочная коробка:{' '}
									{item.additionalOptions?.presentBox?.choosen ? 'да (+300 ₽)' : 'нет'}
								</li>
								<li>
									Открытка:{' '}
									{item.additionalOptions?.postCard?.choosen
										? `${item.additionalOptions?.postCard?.text || 'Надпись'} (+300 ₽)`
										: 'нет'}
								</li>
							</ul>
						</div>
						<div className={s.productTotals}>
							<span className={s.productTotalsTitle}>Цена</span>
							<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
								{itemPriceWithDiscount < itemPrice ? (
									<>
										<span style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>
											{formatCurrency(itemPrice)} ₽
										</span>
										<span className={s.productTotalsValue} style={{ color: '#10b981' }}>
											{formatCurrency(itemPriceWithDiscount)} ₽
										</span>
									</>
								) : (
									<span className={s.productTotalsValue}>{formatCurrency(itemPrice)} ₽</span>
								)}
							</div>
						</div>
					</div>
				)
			})}
			
			<div className={s.productCard}>
				<div className={s.productTotals} style={{ width: '100%', justifyContent: 'flex-end', gap: '8px' }}>
					<span className={s.productTotalsTitle}>Итого за товары:</span>
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						{productsPriceWithDiscount < productsPrice ? (
							<>
								<span style={{ textDecoration: 'line-through', color: '#999', fontSize: '16px' }}>
									{formatCurrency(productsPrice)} ₽
								</span>
								<span className={s.productTotalsValue} style={{ color: '#10b981' }}>
									{formatCurrency(productsPriceWithDiscount)} ₽
								</span>
							</>
						) : (
							<span className={s.productTotalsValue}>{formatCurrency(productsPrice)} ₽</span>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}


