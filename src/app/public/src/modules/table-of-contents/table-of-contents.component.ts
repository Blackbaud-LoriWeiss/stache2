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
  StacheNavLink,
  StacheNavService } from '../nav';

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

  constructor(
    private cdRef: ChangeDetectorRef,
    private navService: StacheNavService) { }

  public ngOnInit() {
    if (this.pageAnchorStream) {
      this.pageAnchorStream.subscribe((routes: any) => {
        this.routes = routes;
        this.cdRef.detectChanges();
      });
    }
    this.cdRef.detectChanges();
  }

  public ngOnDestroy() {
    if (this.pageAnchorStream) {
      this.pageAnchorStream.unsubscribe();
    }
  }

  public navigate(route: any): void {
    this.navService.navigate(route);
  }
}
