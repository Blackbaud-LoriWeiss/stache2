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

import { Subscription } from 'rxjs';

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
export class StacheWrapperComponent implements OnInit, AfterContentInit, OnDestroy, AfterViewInit {
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
  public inPageRoutes: StacheNavLink[] = [];

  private domAnchorRef: HTMLElement[];

  @ContentChildren(StachePageAnchorComponent, { descendants: true })
  private pageAnchors: QueryList<StachePageAnchorComponent>;

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
    private navService: StacheNavService) {
      this.anchorService.subscribe((anchor: any) => {
        this.serviceAnchors.push(anchor);
        if (this.serviceAnchors.length === this.domAnchorRef.length) {
          this.anchorService.complete();
        }
      },
      null,
      () => {
        this.registerPageAnchors();
      }
    );
    }

  public ngOnInit(): void {
    this.titleService.setTitle(this.windowTitle || this.pageTitle);
    this.jsonData = this.dataService.getAll();
  }

  public ngAfterContentInit(): void {

  }

  public ngAfterViewInit() {
    this.domAnchorRef = [].slice.call(this.elRef.nativeElement.querySelectorAll('stache-page-anchor>div'));
    this.registerPageAnchors();
    this.checkRouteHash();
  }

  public ngOnDestroy(): void {
    this.destroyPageAnchorSubscriptions();
  }

  private registerPageAnchors(): void {
    this.inPageRoutes = [];
    this.destroyPageAnchorSubscriptions();

    console.log(this.pageAnchors);
    // Save each subscription so we can unsubscribe after the component is destroyed.
    this.pageAnchorSubscriptions = this.pageAnchors.map(
      (anchor: StachePageAnchorComponent, index: number) => {

        // First, create a placeholder for the route, until it's processed.
        this.inPageRoutes.push({ name: '', path: '' });

        // This will allow the wrapper to subscribe to each Page Anchor's changes.
        return anchor.navLinkStream
          .subscribe((link: StacheNavLink) => {
            this.inPageRoutes[index] = link;
          });
      }
    );

    this.tocService.next(this.inPageRoutes);
  }

  private checkEditButtonUrl(): boolean {
    const url = _get(this.config, 'skyux.appSettings.stache.editButton.url');
    return url !== undefined;
  }

  private checkRouteHash(): void {
    this.route.fragment
      .subscribe((fragment: string) => {
        let url = '';
        this.route.url.subscribe(segments => url = segments.join('/')).unsubscribe();
        if (fragment) {
          this.navService.navigate({path: url, fragment});
        }
      })
      .unsubscribe();
  }

  private destroyPageAnchorSubscriptions(): void {
    this.pageAnchorSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.pageAnchorSubscriptions = [];
  }
}
