import { Component } from '@angular/core';
import { routeAnimations } from './app.animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routeAnimations]
})
export class AppComponent {
  title = 'FileServer';

  prepareRoute(outletRef: RouterOutlet) {
    return outletRef.activatedRoute.snapshot.params.index && outletRef.activatedRouteData && outletRef.activatedRouteData['animation'];
  }
}
