import { Component, Input, OnInit, ChangeDetectorRef, OnChanges, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';

import { StacheNav, StacheNavLink } from '../nav';

import { StacheTOCService } from '../shared';
import { StacheNavService } from '../nav';

@Component({
  selector: 'stache-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StacheTableOfContentsComponent implements StacheNav, OnInit, AfterViewInit, OnChanges {
  @Input()
  public routes: StacheNavLink[] = [];

  constructor(
    private tocService: StacheTOCService,
    private cdRef: ChangeDetectorRef,
    private navService: StacheNavService) { }

  public ngOnInit() {
    // this.tocService.subscribe((pageRoutes: StacheNavLink[]) => {
    //   this.routes = pageRoutes;
    // console.log(this.routes);
    this.cdRef.markForCheck();
    // })
  }

  public ngAfterViewInit() {
    console.log(this.routes);
    // this.cdRef.detectChanges();
  }

  public ngOnChanges(changes: any) {
    console.log(changes);
    if (this.routes && this.routes.length > 0 && changes.currentValue && changes.currentValue !== changes.previousValue) {
      // this.cdRef.markForCheck();
    }
    // this.cdRef.detectChanges();
  }
  public navigate(route: any): void {
    this.navService.navigate(route);
  }
}
