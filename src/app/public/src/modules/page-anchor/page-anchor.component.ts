import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  StacheNavLink
} from '../nav';

import {
  StacheWindowRef
} from '../shared';

import { StachePageAnchorService } from './page-anchor.service';

@Component({
  selector: 'stache-page-anchor',
  templateUrl: './page-anchor.component.html',
  styleUrls: ['./page-anchor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StachePageAnchorComponent implements OnInit, StacheNavLink, AfterViewInit {
  @Input()
  public inputName = '';

  public name = '';
  public fragment: string;
  public path: string[];

  public constructor(
    private router: Router,
    private elementRef: ElementRef,
    private windowRef: StacheWindowRef,
    private anchorService: StachePageAnchorService,
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.name = this.getName();
    this.fragment = this.getFragment();
    this.path = [this.router.url.split('#')[0]];
  }

  public addHashToUrl(): void {
    const domRect = this.elementRef.nativeElement.getBoundingClientRect();
    this.windowRef.nativeWindow.scroll(0, domRect.y);
    this.windowRef.nativeWindow.location.hash = this.fragment;
  }

  public ngAfterViewInit(): void {
    this.name = this.getName();
    this.fragment = this.getFragment();
    this.sendChanges();
    this.changeDetector.detectChanges();
  }

  private getName(): string {
    return this.inputName || this.elementRef.nativeElement.textContent.trim();
  }

  private getFragment(): string {
    return this.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  private sendChanges(): void {
    this.anchorService.addPageAnchor({
      path: this.path,
      name: this.name,
      fragment: this.fragment
    });
  }
}
