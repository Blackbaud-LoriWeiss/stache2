/* tslint:disable:component-selector */
import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ElementRef
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { AsyncSubject } from 'rxjs';

import { StacheTitleService } from './title.service';

import {
  StacheConfigService,
  StacheJsonDataService } from '../shared';

import { StachePageAnchorService } from '../page-anchor';

import { StacheNavLink, StacheNavService } from '../nav';

const _get = require('lodash.get');

@Component({
  selector: 'stache',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class StacheWrapperComponent implements OnInit, AfterViewInit {
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

  public pageAnchorStream: AsyncSubject<any> = new AsyncSubject();

  private pageAnchorElements: HTMLElement[] = [];

  private pageAnchors: StacheNavLink[] = [];

  public constructor(
    private config: StacheConfigService,
    private dataService: StacheJsonDataService,
    private titleService: StacheTitleService,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private anchorService: StachePageAnchorService,
    private navService: StacheNavService) { }

  public ngOnInit(): void {
    this.anchorService.subscribe((anchor: any) => {
      this.pageAnchors.push(anchor);
    });

    this.titleService.setTitle(this.windowTitle || this.pageTitle);
    this.jsonData = this.dataService.getAll();
  }

  public ngAfterViewInit(): void {
    this.checkRouteHash();
    this.pageAnchorElements = [].slice.call(
      this.elRef.nativeElement.querySelectorAll('.stache-page-anchor')
    );

    this.sortPageAnchors();
  }

  private sortPageAnchors(): void {
    this.pageAnchors.map((anchor: StacheNavLink) => {
      this.pageAnchorElements.forEach((element: HTMLDivElement, idx: number) => {
        if(element.id === anchor.fragment) {
          anchor.order = idx;
        }
        return anchor;
      })
    });

    this.pageAnchors.sort((a: StacheNavLink, b: StacheNavLink) => a.order - b.order);
    this.pageAnchorStream.next(this.pageAnchors);
    this.pageAnchorStream.complete();
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
}
