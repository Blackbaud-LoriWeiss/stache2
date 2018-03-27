import {
  Injectable,
  OnDestroy
} from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class StachePageAnchorService implements OnDestroy {
  public pageAnchorChanges = new BehaviorSubject<any>([]);

  private pageAnchors: any[] = [];

  public ngOnDestroy() {
    this.pageAnchorChanges.complete();
  }

  public addPageAnchor(config: any) {
    this.pageAnchors.push(config);
    this.pageAnchorChanges.next(this.pageAnchors);
  }
}
