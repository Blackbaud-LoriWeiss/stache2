import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Subject, Subscription } from 'rxjs/Rx';

@Injectable()
export class StachePageAnchorService {
  private eventBus$: any = new Subject();

  subscribe(next: any, error?: any, complete?: any): Subscription {
    return this.eventBus$.subscribe(next, error, complete);
  }

  next(event: any): void {
    this.eventBus$.next(event);
  }

  complete(): void {
    this.eventBus$.complete();
  }
}
