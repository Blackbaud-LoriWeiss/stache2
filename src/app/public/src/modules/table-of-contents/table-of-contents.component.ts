import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy } from '@angular/core';

import { AsyncSubject } from 'rxjs';

import {
  StacheNav,
  StacheNavLink } from '../nav';

@Component({
  selector: 'stache-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StacheTableOfContentsComponent implements StacheNav, OnInit, OnDestroy {
  @Input()
  public routes: StacheNavLink[] = [];

  @Input()
  pageAnchorStream: AsyncSubject<any>;

  constructor(private changeDetector: ChangeDetectorRef) { }

  public ngOnInit(): void {
    if (this.pageAnchorStream) {
      this.pageAnchorStream.subscribe((routes: StacheNavLink[]) => {
        this.routes = routes;
        this.changeDetector.detectChanges();
      });
    }
    this.changeDetector.detectChanges();
  }

  public ngOnDestroy(): void {
    if (this.pageAnchorStream) {
      this.pageAnchorStream.unsubscribe();
    }
  }
}
