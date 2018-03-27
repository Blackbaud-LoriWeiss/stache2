import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  OnChanges,
  Input
} from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { StacheNavLink } from '../nav';
import { StacheWindowRef, StachePageAnchorService } from '../shared';

@Component({
  selector: 'stache-page-anchor',
  templateUrl: './page-anchor.component.html',
  styleUrls: ['./page-anchor.component.scss']
})
export class StachePageAnchorComponent implements OnInit, StacheNavLink, AfterViewInit, OnChanges {
  @Input()
  public inputName: string = '';

  public name: string = '';

  public fragment: string;
  public path: string[];
  public navLinkStream: Observable<StacheNavLink>;

  private _subject: BehaviorSubject<StacheNavLink>;

  public constructor(
    private router: Router,
    private elementRef: ElementRef,
    private windowRef: StacheWindowRef,
    private anchorService: StachePageAnchorService,
    private cdRef: ChangeDetectorRef) {
      this._subject = new BehaviorSubject<StacheNavLink>({ name: '', path: '' });
      this.navLinkStream = this._subject.asObservable();
    }

  // public ngOnChanges(changes: any): void {
  //   console.log(changes);
  //   console.log('changed!', this.name, 'name', this.getName());
  //   // if (this.name && this.name)
  //   // this.sendChanges();
  // }

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
    return this.inputName || this.elementRef.nativeElement.textContent.trim();
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

    this._subject.next(anchor);

    this.anchorService.next(anchor)
  }
}
