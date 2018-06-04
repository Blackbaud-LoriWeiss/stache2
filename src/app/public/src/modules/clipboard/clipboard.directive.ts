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
  Input,
  ViewChild
} from '@angular/core';

import { ClipboardService } from './clipboard.service';

@Directive({
  selector: '[stacheClipboard]'
})
export class StacheClipboardDirective implements AfterViewInit, OnDestroy {
  @Input() public clipboardTrigger: string;
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
        console.log(child.type);
        return child.innerText.trim() || child.value.trim();
      }
    }).join('');

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
  private handleResult(succeeded: Boolean, copiedContent: string | undefined): void {
    if (succeeded) {
      this.cbOnSuccess.emit({ isSuccess: true, content: copiedContent });
    } else {
      this.cbOnError.emit({ isSuccess: false });
    }
  }

  private copySuccess(): void {
    // How can we dynamically alert the user that the button did something?
  }

  private createEventListeners(): void {
    if (this.button) {
      this.button.addEventListener('click', () => {
        console.log('click');
        this.onClick();
        this.copySuccess();
      });
    }
  }

  private instantiateButton() {
    if (this.clipboardTrigger) {
      this.button = this.el.nativeElement.querySelector(`#${this.clipboardTrigger}`);
    } else {
      throw new DOMException('No button found');
    }
  }
}
