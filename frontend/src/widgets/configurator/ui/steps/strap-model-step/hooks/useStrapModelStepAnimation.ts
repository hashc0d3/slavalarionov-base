/**
 * Хук для анимации карточек ремешков
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useStrapModelStepAnimation() {
	const strapCardsRef = useRef<(HTMLDivElement | null)[]>([])

	useEffect(() => {
		const cards = strapCardsRef.current.filter(Boolean)
		
		if (cards.length === 0) return

		// Начальное состояние
		gsap.set(cards, { 
			opacity: 0, 
			y: 40,
			scale: 0.9
		})

		// Анимация появления
		gsap.to(cards, {
			opacity: 1,
			y: 0,
			scale: 1,
			duration: 0.7,
			stagger: 0.12,
			ease: 'power3.out',
			delay: 0.1
		})
	}, [])

	return strapCardsRef
}


