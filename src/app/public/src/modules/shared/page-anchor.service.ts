import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Subject, Subscription } from 'rxjs/Rx';

@Injectable()
export class StachePageAnchorService {
  private eventBus$ = new Subject();

  subscribe(next: any, error?: any, complete?: any) {
    return this.eventBus$.subscribe(next, error, complete);
  }

  next(event: any) {
    this.eventBus$.next(event);
  }

  complete() {
    this.eventBus$.complete();
  }
}
