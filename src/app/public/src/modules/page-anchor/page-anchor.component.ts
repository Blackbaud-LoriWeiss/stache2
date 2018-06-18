import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  Input,
  OnDestroy
} from '@angular/core';
import {
  NavigationEnd,
  Router
} from '@angular/router';
import {
  Subscription
} from 'rxjs';
import { StacheNavLink } from '../nav';

import { StachePageAnchorService } from './page-anchor.service';
import { StacheWindowRef, StacheRouteService } from '../shared';

@Component({
  selector: 'stache-page-anchor',
  templateUrl: './page-anchor.component.html',
  styleUrls: ['./page-anchor.component.scss']
})
export class StachePageAnchorComponent implements OnInit, StacheNavLink, AfterViewInit, OnDestroy {

  public name: string;
  public fragment: string;
  public path: string[];
  public order: number;

  @Input()
  public anchorId?: string;
  private subscription: Subscription;

  public constructor(
    private routerService: StacheRouteService,
    private router: Router,
    private elementRef: ElementRef,
    private windowRef: StacheWindowRef,
    private cdRef: ChangeDetectorRef,
    private anchorService: StachePageAnchorService) {
      this.name = '';

      // scroll to entity element if request on the url
      this.subscription = this.router.events.subscribe(s => {
        if (s instanceof NavigationEnd) {
          const tree = this.router.parseUrl(this.router.url);
          console.log('NavtigationEnd! frag: ', this.fragment, ' tree frag:', tree.fragment);
          if (tree.fragment && tree.fragment === this.fragment) {
            const element = document.querySelector('#' + tree.fragment);
            if (element) { element.scrollIntoView(); }
          }
        }
      });
    }

  public ngOnInit(): void {
    this.name = this.getName();
    this.fragment = this.getFragment();
    this.path = [this.routerService.getActiveUrl()];
  }

  public scrollToAnchor(): void {
    this.windowRef.nativeWindow.document.querySelector(`#${this.fragment}`).scrollIntoView();
  }

  public ngAfterViewInit(): void {
    this.name = this.getName();
    this.fragment = this.getFragment();
    this.getOrder();
    this.registerAnchor();
    this.cdRef.detectChanges();
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getName(): string {
    return this.elementRef.nativeElement.textContent.trim();
  }

  private getFragment(): string {
    return this.anchorId || this.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  private getOrder(): void {
    let anchors = this.windowRef.nativeWindow.document.querySelectorAll('stache-page-anchor div');
    for (let i = 0; i < anchors.length; i++) {
      if (this.fragment === anchors[i].id) {
        this.order = i;
      }
    }
  }

  private registerAnchor(): void {
    this.anchorService.addPageAnchor({
      path: this.path,
      name: this.name,
      fragment: this.fragment,
      order: this.order
    } as StacheNavLink);
  }
}
