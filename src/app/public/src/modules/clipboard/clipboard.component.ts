import {
  Component, ElementRef, AfterViewInit, Input, ChangeDetectorRef
} from '@angular/core';
import { InputConverter } from '../shared';

@Component({
  selector: 'stache-clipboard',
  templateUrl: './clipboard.component.html',
  styleUrls: ['./clipboard.component.scss']
})
export class StacheClipboardComponent implements AfterViewInit {
  @Input()
  @InputConverter()
  public showIcon: boolean = true;
  @Input()
  public buttonLabel: string;
  public content: string;

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
    this.el.nativeElement.style.cssText = 'opacity: 0;';
  }

  public ngAfterViewInit() {
      // ISSUE: Parent element can be stacheWrapper, so the button never goes away (might be better that way for non-code examples?)
      setTimeout(() => {
        this.content = this.el.nativeElement.nextElementSibling.innerText.trim();
      }, 0);

      this.el.nativeElement.parentElement.addEventListener('mouseover', () => {
        this.el.nativeElement.style.cssText = 'opacity: 100; transition: opacity 300ms;';
      });

      this.el.nativeElement.parentElement.addEventListener('mouseout', () => {
        this.el.nativeElement.style.cssText = 'opacity: 0; transition: opacity 300ms;';
      });

      this.cdr.detectChanges();
  }
}
