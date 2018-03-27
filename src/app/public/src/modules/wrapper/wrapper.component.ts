/* tslint:disable:component-selector */
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  AfterContentInit,
  AfterViewInit,
  ContentChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription, AsyncSubject } from 'rxjs';

import { StacheTitleService } from './title.service';
import { StachePageAnchorComponent } from '../page-anchor';
import {
  StacheConfigService,
  StacheJsonDataService,
  StachePageAnchorService,
  StacheTOCService } from '../shared';
import { StacheNavLink, StacheNavService } from '../nav';

const _get = require('lodash.get');

@Component({
  selector: 'stache',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class StacheWrapperComponent implements OnInit, OnDestroy, AfterViewInit {
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

  public inPageRoutes: AsyncSubject<any> = new AsyncSubject();

  private domAnchorRef: HTMLElement[] = [];

  // @ContentChildren(StachePageAnchorComponent, { descendants: true })
  // private pageAnchors: QueryList<StachePageAnchorComponent>;

  private serviceAnchors: any[] = [];

  private pageAnchorSubscriptions: Subscription[] = [];

  public constructor(
    private config: StacheConfigService,
    private dataService: StacheJsonDataService,
    private titleService: StacheTitleService,
    private route: ActivatedRoute,
    private tocService: StacheTOCService,
    private elRef: ElementRef,
    private anchorService: StachePageAnchorService,
    private navService: StacheNavService) { }

  public ngOnInit(): void {
    this.anchorService.subscribe((anchor: any) => {
      this.serviceAnchors.push(anchor);
    });

    this.titleService.setTitle(this.windowTitle || this.pageTitle);
    this.jsonData = this.dataService.getAll();
  }

  public ngAfterViewInit() {
    this.domAnchorRef = [].slice.call(this.elRef.nativeElement.querySelectorAll('stache-page-anchor>div'));
    this.sortServiceAnchors();
  }

  private sortServiceAnchors() {
    this.serviceAnchors.map(anchor => {
      this.domAnchorRef.forEach((anc, idx) => {
        if(anc.id === anchor.fragment) {
          anchor.order = idx;
        }
        return anchor;
      })
    });

    this.serviceAnchors.sort((a, b) => a.order - b.order);
    this.tocService.next(this.serviceAnchors);
    this.inPageRoutes.next(this.serviceAnchors);
    this.inPageRoutes.complete();
  }

  private checkEditButtonUrl(): boolean {
    const url = _get(this.config, 'skyux.appSettings.stache.editButton.url');
    return url !== undefined;
  }

  private destroyPageAnchorSubscriptions(): void {
    this.pageAnchorSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.pageAnchorSubscriptions = [];
  }
}
