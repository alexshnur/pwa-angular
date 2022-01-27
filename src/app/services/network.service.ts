import {Inject, Injectable, PLATFORM_ID} from "@angular/core";
import {fromEvent, mapTo, merge, Observable, of, startWith} from "rxjs";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class Network {
  onlineChanges: Observable<boolean>;

  get online(): boolean {
    return isPlatformBrowser(this.platformId) ? navigator.onLine : true;
  }

  constructor(
    @Inject(PLATFORM_ID) protected platformId: string,
  ) {
    this.onlineChanges = !isPlatformBrowser(this.platformId) ? of(true) : merge(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      fromEvent(window, 'online').pipe(mapTo(true)),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      fromEvent(window, 'offline').pipe(mapTo(false)),
    )
      .pipe(startWith(this.online));
  }
}
