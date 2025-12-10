import { TextField } from '@mui/material'
import type { FormState, ValidationErrors } from '../types'
import s from '../OrderPopup.module.css'

type Props = {
	form: FormState
	errors: ValidationErrors
	isLoading: boolean
	onFieldChange: (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function OrderPopupForm({ form, errors, isLoading, onFieldChange }: Props) {
	return (
		<section className={s.section}>
			<h4 className={s.sectionTitle}>Контактные данные</h4>
			<div className={s.inputsGrid}>
				<TextField
					label="Email"
					type="email"
					placeholder="example@site.com"
					value={form.email}
					onChange={onFieldChange('email')}
					disabled={isLoading}
					error={!!errors.email}
					helperText={errors.email}
					required
					fullWidth
					size="small"
				/>
				<TextField
					label="Телефон"
					type="tel"
					placeholder="+7 (999) 999-99-99"
					value={form.phone}
					onChange={onFieldChange('phone')}
					disabled={isLoading}
					error={!!errors.phone}
					helperText={errors.phone}
					required
					fullWidth
					size="small"
				/>
			</div>
		</section>
	)
}


