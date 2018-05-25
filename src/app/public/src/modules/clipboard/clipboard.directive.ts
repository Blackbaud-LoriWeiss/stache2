// taken from https://github.com/maxisam/ngx-clipboard/
// tslint:disable
import {
  Directive,
  EventEmitter,
  OnDestroy,
  Output,
  Renderer,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';

import { ClipboardService } from './clipboard.service';

@Directive({
  selector: '[stacheCopy]'
})
export class ClipboardDirective implements AfterViewInit, OnDestroy {
  @Output() public cbOnSuccess: EventEmitter<any> = new EventEmitter<any>();

  @Output() public cbOnError: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private clipboardSrv: ClipboardService,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private renderer: Renderer
  ) { }

  private targetElm: any;
  private button: any;
  private buttonTemplate: any = '<button class="sky-btn sky-btn-default clipboard-btn"><i class="fa fa-clipboard" /i></button>';
  private buttonStyles: any =
  'position: absolute;' +
  'right: 4px;' +
  'top: 4px;';

  public ngAfterViewInit() {
    this.targetElm = this.el.nativeElement;
    this.targetElm.style.cssText = "position: relative";
    this.targetElm.insertAdjacentHTML('beforeend', this.buttonTemplate);
    this.button = this.targetElm.querySelector('.clipboard-btn');
    this.button.style.cssText = this.buttonStyles + 'opacity: 0;';

    this.button.addEventListener('click', () => {
      this.onClick();
    });

    this.targetElm.addEventListener('mouseover', () => {
      this.button.style.cssText = this.buttonStyles + 'opacity: 100; transition: opacity 300ms;';
    });

    this.targetElm.addEventListener('mouseout', () => {
      this.button.style.cssText = this.buttonStyles + 'opacity: 0; transition: opacity 300ms;';
    });

    this.cdr.detectChanges();
   }

  public ngOnDestroy() {
    this.clipboardSrv.destroy();
  }

  public onClick() {
    const content = this.targetElm.outerText.trim();
    if (!this.clipboardSrv.isSupported) {
      this.handleResult(false, undefined);
    } else if (this.targetElm && this.clipboardSrv.isTargetValid(this.targetElm)) {
      this.handleResult(this.clipboardSrv.copyFromInputElement(this.targetElm, this.renderer), this.targetElm.value);
    } else if (content) {
      this.handleResult(this.clipboardSrv.copyFromContent(content, this.renderer), content);
    }
  }

  /**
   * Fires an event based on the copy operation result.
   * @param {Boolean} succeeded
   */
  private handleResult(succeeded: Boolean, copiedContent: string | undefined) {
    if (succeeded) {
      this.cbOnSuccess.emit({ isSuccess: true, content: copiedContent });
    } else {
      this.cbOnError.emit({ isSuccess: false });
    }
  }
}
