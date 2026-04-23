const tiltCard = document.querySelector('[data-tilt-card]');

function resetTilt() {
 if (!tiltCard) return;
 tiltCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
}

function handlePointerMove(event) {
 if (!tiltCard || window.matchMedia('(max-width: 860px)').matches) return;

 const rect = tiltCard.getBoundingClientRect();
 const x = (event.clientX - rect.left) / rect.width - 0.5;
 const y = (event.clientY - rect.top) / rect.height - 0.5;

 tiltCard.style.transform = `rotateX(${y * -3}deg) rotateY(${x * 4}deg)`;
}

tiltCard?.addEventListener('pointermove', handlePointerMove);
tiltCard?.addEventListener('pointerleave', resetTilt);
