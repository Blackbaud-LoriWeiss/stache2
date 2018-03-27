import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import {
  StacheNav,
  StacheNavLink,
  StacheNavService
} from '../nav';

@Component({
  selector: 'stache-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StacheTableOfContentsComponent implements StacheNav, OnChanges {
  @Input()
  public routes: StacheNavLink[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private navService: StacheNavService
  ) { }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.routes && !changes.routes.firstChange) {
      this.routes = changes.routes.currentValue;
      this.changeDetector.markForCheck();
    }
  }

  public navigate(route: any): void {
    this.navService.navigate(route);
  }
}
