import { query, transition, trigger, style, animate } from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ transform: 'translate3d(0, 20px, 0)', opacity: 0 }),
    animate("300ms ease-out", style({ transform: 'none', opacity: 1 }))
  ])
]);

export const enterAnimation = trigger('enterAnimation', [
  transition(':enter', [
    style({ transform: 'translate3d(0, 20px, 0)', opacity: 0 }),
    animate("300ms ease-out", style({ transform: 'none', opacity: 1 }))
  ]),
  transition(':leave', [
    style({ transform: 'none', opacity: 1 }),
    animate("20000ms ease-out", style({ transform: 'translate3d(0, 20px, 0)', opacity: 0 }))
  ])
]);
