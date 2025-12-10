import { TextField, Button } from '@mui/material'
import type { FormState } from '../types'
import s from '../OrderPopup.module.css'

type Props = {
	form: FormState
	isLoading: boolean
	promoLoading: boolean
	promoMessage: string | null
	promoStatus: 'success' | 'error' | null
	onPromoCodeChange: (value: string) => void
	onApplyPromo: () => void
}

export function OrderPopupPromo({ 
	form, 
	isLoading, 
	promoLoading, 
	promoMessage, 
	promoStatus, 
	onPromoCodeChange, 
	onApplyPromo 
}: Props) {
	return (
		<section className={s.section}>
			<h4 className={s.sectionTitle}>Промокод</h4>
			<div className={s.promoRow}>
				<TextField
					placeholder="Введите промокод"
					value={form.promoCode}
					onChange={(e) => onPromoCodeChange(e.target.value)}
					disabled={isLoading || promoLoading}
					size="small"
					sx={{ flex: 1 }}
				/>
				<Button
					variant="contained"
					onClick={onApplyPromo}
					disabled={isLoading || promoLoading}
					sx={{ textTransform: 'none' }}
				>
					{promoLoading ? 'Проверяем...' : 'Применить'}
				</Button>
			</div>
			{promoMessage && (
				<p
					className={`${s.promoMessage} ${promoStatus === 'success' ? s.promoMessageSuccess : s.promoMessageError}`}
				>
					{promoMessage}
				</p>
			)}
		</section>
	)
}


