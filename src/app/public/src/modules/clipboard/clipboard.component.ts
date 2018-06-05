import { Component, Input, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'stache-clipboard',
  templateUrl: './clipboard.component.html',
  styleUrls: ['./clipboard.component.scss']
})
export class StacheClipboardComponent implements AfterViewInit {
  private defaultTigger = 'clipboardButton';
  private clipboardButton: HTMLButtonElement;

  @Input()
  public customClickHandler: boolean = false;

  @Input()
  public buttonText: string = 'Copy to Clipboard';

  @Input()
  public copyText: string = 'Copied!';

  @Input()
  public clipboardTrigger: string = this.defaultTigger;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2) { }

  public ngAfterViewInit() {
    this.registerClipboardButton();
  }

  public chooseTrigger(): boolean {
    return this.clipboardTrigger === this.defaultTigger;
  }

  public registerClipboardButton() {
    if (this.clipboardTrigger === this.defaultTigger) {
      this.clipboardButton = <HTMLButtonElement>this.el.nativeElement.querySelector('.clipboard-btn');
      this.clipboardButton.textContent = this.buttonText;
    } else {
      this.clipboardButton = <HTMLButtonElement>document.querySelector(`#${this.clipboardTrigger}`);
    }

    if (!this.customClickHandler) {
      const buttonText = this.clipboardButton.textContent;
      this.renderer.listen(this.clipboardButton, 'click', () => {
        this.clipboardButton.textContent = this.copyText;
        setTimeout(() => { this.clipboardButton.textContent = buttonText; }, 1000);
      });
    }
  }
}
