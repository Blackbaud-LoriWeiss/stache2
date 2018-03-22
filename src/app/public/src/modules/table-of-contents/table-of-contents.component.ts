import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

import { StacheNav, StacheNavLink } from '../nav';

import { StacheTOCService } from '../shared';
import { StacheNavService } from '../nav';

@Component({
  selector: 'stache-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss']
})
export class StacheTableOfContentsComponent implements StacheNav, OnInit {
  public routes: StacheNavLink[] = [];

  constructor(
    private tocService: StacheTOCService,
    private cdRef: ChangeDetectorRef,
    private navService: StacheNavService) { }

  public ngOnInit() {
    this.tocService.subscribe((pageRoutes: StacheNavLink[]) => {
      this.routes = pageRoutes;
      this.cdRef.detectChanges();
    })
  }

  public navigate(route: any): void {
    this.navService.navigate(route);
  }
}
