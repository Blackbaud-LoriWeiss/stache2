// adapted from https://github.com/maxisam/ngx-clipboard/
import {
  Directive,
  EventEmitter,
  OnDestroy,
  Output,
  Renderer2,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  Input
} from '@angular/core';

import { ClipboardService } from './clipboard.service';

@Directive({
  selector: '[stacheClipboard]'
})
export class StacheClipboardDirective implements AfterViewInit, OnDestroy {
  private defaultTigger = 'clipboardButton';

  @Input() public clipboardTrigger: string = this.defaultTigger;
  @Input() public copySuccessText: string;
  @Output() public cbOnSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output() public cbOnError: EventEmitter<any> = new EventEmitter<any>();

  private targetElm: any;
  private button: HTMLButtonElement;

  constructor(
    private clipboardSrv: ClipboardService,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  public ngAfterViewInit() {
    this.targetElm = this.el.nativeElement;
    this.instantiateButton();
    this.createEventListeners();
    this.cdr.detectChanges();
  }

  public ngOnDestroy() {
    this.clipboardSrv.destroy();
  }

  public onClick(): void {
    const content = [].slice.call(this.targetElm.children).map((child: any) => {
      if (child.type !== 'submit') {
        return child.innerText.trim() || child.value.trim();
      }
    }).join('');

    if (!this.clipboardSrv.isSupported) {
      this.handleResult(false, undefined);
    } else if (content) {
      this.handleResult(this.clipboardSrv.copyFromContent(content, this.renderer), content);
    }
  }

  /**
   * Fires an event based on the copy operation result.
   * @param {Boolean} succeeded
   */
  private handleResult(succeeded: Boolean, copiedContent: string | undefined): void {
    if (succeeded) {
      this.cbOnSuccess.emit({ isSuccess: true, content: copiedContent });
    } else {
      this.cbOnError.emit({ isSuccess: false });
    }
  }

  private createEventListeners(): void {
    if (this.button) {
      this.renderer.listen(this.button, 'click', () => {
        this.onClick();
      });
    }
  }

  private instantiateButton() {
    if (this.clipboardTrigger) {
      this.button =
         this.el.nativeElement.querySelector(`#${this.clipboardTrigger}`) ||
         document.querySelector(`#${this.clipboardTrigger}`);
    }

    if (!this.button) {
      throw new DOMException('No button found');
    }
  }
}
