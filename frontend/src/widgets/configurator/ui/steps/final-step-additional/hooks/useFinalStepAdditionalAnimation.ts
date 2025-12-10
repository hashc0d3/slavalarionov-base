/**
 * Хук для анимации опций
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useFinalStepAdditionalAnimation() {
	const imagesRef = useRef<(HTMLDivElement | null)[]>([])

	useEffect(() => {
		const images = imagesRef.current.filter(Boolean)
		
		if (images.length === 0) return

		// Начальное состояние - изображения невидимы
		gsap.set(images, { 
			opacity: 0, 
			y: 30,
			scale: 0.95 
		})

		// Анимация появления с задержкой для каждого изображения
		gsap.to(images, {
			opacity: 1,
			y: 0,
			scale: 1,
			duration: 0.6,
			stagger: 0.15,
			ease: 'power2.out',
			delay: 0.2
		})
	}, [])

	return imagesRef
}


