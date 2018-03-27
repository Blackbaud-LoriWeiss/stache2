/* tslint:disable:component-selector */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Input
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

const _get = require('lodash.get');

import {
  StacheNavLink
} from '../nav';

import {
  StachePageAnchorService
} from '../page-anchor';

import {
  StacheConfigService,
  StacheJsonDataService
} from '../shared';

import { StacheTitleService } from './title.service';

@Component({
  selector: 'stache',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
  providers: [StachePageAnchorService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StacheWrapperComponent implements OnInit, OnDestroy {
  @Input()
  public pageTitle: string;

  @Input()
  public windowTitle: string;

  @Input()
  public navTitle: string;

  @Input()
  public layout = 'sidebar';

  @Input()
  public sidebarRoutes: StacheNavLink[];

  @Input()
  public breadcrumbsRoutes: StacheNavLink[];

  @Input()
  public showBreadcrumbs: boolean = true;

  @Input()
  public showEditButton: boolean = this.checkEditButtonUrl();

  @Input()
  public showTableOfContents: boolean = false;

  @Input()
  public showBackToTop: boolean = true;

  public jsonData: any;
  public inPageRoutes: StacheNavLink[];

  private ngUnsubscribe = new Subject<boolean>();

  public constructor(
    private config: StacheConfigService,
    private dataService: StacheJsonDataService,
    private elementRef: ElementRef,
    private titleService: StacheTitleService,
    private pageAnchorService: StachePageAnchorService
  ) { }

  public ngOnInit(): void {
    this.titleService.setTitle(this.windowTitle || this.pageTitle);
    this.jsonData = this.dataService.getAll();
    this.pageAnchorService.pageAnchorChanges.subscribe((changes: any[]) => {
      this.inPageRoutes = this.sortPageAnchors(changes);
    });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private checkEditButtonUrl(): boolean {
    const url = _get(this.config, 'skyux.appSettings.stache.editButton.url');
    return url !== undefined;
  }

  private sortPageAnchors(pageAnchors: any[]): any[] {
    const pageAnchorElements = [].slice.call(
      this.elementRef.nativeElement.querySelectorAll('.stache-page-anchor')
    );

    pageAnchors.forEach(anchor => {
      pageAnchorElements.forEach((element: HTMLDivElement, idx: number) => {
        if (element.id === anchor.fragment) {
          anchor.order = idx;
        }
      });
    });

    pageAnchors.sort((a, b) => a.order - b.order);

    return pageAnchors;
  }
}
