import {Component, OnInit} from '@angular/core';
import { Network } from './services/network.service';
import {SwPush, SwUpdate} from "@angular/service-worker";
import {PushService} from "./services/notification.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  // {"publicKey":"BHJeV-a1HFs_KpB2BYgnBlQHw5kBEvfLYVqUAWn4PCl09kMC8SwTGL240QrK4qbPv_46YlVDRoHWPjwLwrnSwYs","privateKey":"VFKUiJm-ByT4ynWza7HT8P0TtnsmoGHt3sRo405DXCQ"}
  readonly VAPID_PUBLIC_KEY = "BHJeV-a1HFs_KpB2BYgnBlQHw5kBEvfLYVqUAWn4PCl09kMC8SwTGL240QrK4qbPv_46YlVDRoHWPjwLwrnSwYs";

  title = 'angular-pwa';
  online$ = this.network.onlineChanges;
  sub: PushSubscription | undefined;

  constructor(
    protected network: Network,
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    private pushService: PushService
  ) {
    this.swPush.notificationClicks.subscribe((result) => {
      console.log('clicked', result);
    });
  }

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm("New version available. Load New Version?")) {
          window.location.reload();
        }
      });
    }

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => {

        this.sub = sub;


        console.log("Notification Subscription: ", sub);

        this.pushService.addPushSubscriber(sub).subscribe(
          () => console.log('Sent push subscription object to server.'),
        );

      })
      .catch(err => console.error("Could not subscribe to notifications", err));

    // this.swPush.requestSubscription({
    //   serverPublicKey: this.VAPID_PUBLIC_KEY
    // })
    //   .then(sub => {
    //     console.log(sub);
    //     // this.newsletterService.addPushSubscriber(sub).subscribe()
    //   })
    //   .catch(err => console.error("Could not subscribe to notifications", err));
  }
}
