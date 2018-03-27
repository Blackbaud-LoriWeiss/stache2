import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { StacheNav, StacheNavLink } from '../nav';

import { StacheTOCService } from '../shared';
import { StacheNavService } from '../nav';
import { AsyncSubject } from 'rxjs';

@Component({
  selector: 'stache-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StacheTableOfContentsComponent implements StacheNav, OnInit, OnDestroy {
  public routes: StacheNavLink[] = [];

  @Input()
  routesObs: AsyncSubject<any>;

  constructor(
    private tocService: StacheTOCService,
    private cdRef: ChangeDetectorRef,
    private navService: StacheNavService) { }

  public ngOnInit() {
    this.routesObs.subscribe((routes: any) => {
      this.routes = routes;
      this.cdRef.detectChanges();
    });
  }

  public ngOnDestroy() {
    this.routesObs.unsubscribe();
  }

  public navigate(route: any): void {
    this.navService.navigate(route);
  }
}
