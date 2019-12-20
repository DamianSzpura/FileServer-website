import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeAnimations } from './shared/animations/shared.animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  prepareRoute(outletRef: RouterOutlet) {
    return outletRef.activatedRoute.snapshot.params.index && outletRef.activatedRouteData && outletRef.activatedRouteData['animation'];
  }
}
