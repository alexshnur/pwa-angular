import { Component } from '@angular/core';
import { Network } from './services/network.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'angular-pwa';
  online$ = this.network.onlineChanges;

  constructor(protected network: Network) {}
}
