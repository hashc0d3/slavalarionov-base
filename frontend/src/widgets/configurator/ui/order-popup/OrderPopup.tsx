"use client"

import s from './OrderPopup.module.css'
import { observer } from 'mobx-react-lite'

type Props = {
	visible: boolean
	onClose: () => void
}

export const OrderPopup = observer(function OrderPopup({ visible, onClose }: Props) {
	return (
		<div className={[s.overlay, !visible ? s.hidden : ''].join(' ')} role="dialog" aria-modal="true">
			<div className={s.modal}>
				<div className={s.header}>
					<div className={s.title}>Оформление заказа</div>
					<button className={s.close} onClick={onClose} aria-label="Закрыть">×</button>
				</div>
				<div className={s.body}>
					<input placeholder="Ваше имя" />
					<input placeholder="Телефон" />
					<input placeholder="Email" />
				</div>
				<div className={s.footer}>
					<button className={s.btn} onClick={onClose}>Отмена</button>
					<button className={[s.btn, s.btnPrimary].join(' ')}>Оплатить</button>
				</div>
			</div>
		</div>
	)
})
