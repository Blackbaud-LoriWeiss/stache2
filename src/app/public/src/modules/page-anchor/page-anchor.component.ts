import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  AfterViewInit
} from '@angular/core';

import { Router } from '@angular/router';

import { StachePageAnchorService } from './page-anchor.service';

import { StacheNavLink } from '../nav';
import { StacheWindowRef } from '../shared';

@Component({
  selector: 'stache-page-anchor',
  templateUrl: './page-anchor.component.html',
  styleUrls: ['./page-anchor.component.scss']
})
export class StachePageAnchorComponent implements OnInit, StacheNavLink, AfterViewInit {
  public name: string = '';
  public fragment: string;
  public path: string[];

  public constructor(
    private router: Router,
    private elementRef: ElementRef,
    private windowRef: StacheWindowRef,
    private anchorService: StachePageAnchorService,
    private cdRef: ChangeDetectorRef) { }

  public ngOnInit(): void {
    this.name = this.getName();
    this.fragment = this.getFragment();
    this.path = [this.router.url.split('#')[0]];
  }

  public addHashToUrl(): void {
    let domRect = this.elementRef.nativeElement.getBoundingClientRect();
    this.windowRef.nativeWindow.scroll(0, domRect.y);
    this.windowRef.nativeWindow.location.hash = this.fragment;
  }

  public ngAfterViewInit(): void {
    this.name = this.getName();
    this.fragment = this.getFragment();
    this.sendChanges();
    this.cdRef.detectChanges();
  }

  private getName(): string {
    return this.elementRef.nativeElement.textContent.trim();
  }

  private getFragment(): string {
    return this.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  private sendChanges(): void {
    let anchor = {
      path: this.path,
      name: this.name,
      fragment: this.fragment
    } as StacheNavLink

    this.anchorService.next(anchor)
  }
}
