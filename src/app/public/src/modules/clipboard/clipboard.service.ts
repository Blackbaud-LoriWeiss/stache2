// adapted from ngx-clipboard

import { Inject, Injectable, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { StacheWindowRef } from '../../..';

@Injectable()
export class ClipboardService {
  private tempTextArea: HTMLTextAreaElement | undefined;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private windowRef: StacheWindowRef
  ) { }

  public get isSupported(): boolean {
    return !!this.document.queryCommandSupported && !!this.document.queryCommandSupported('copy');
  }

  public isTargetValid(element: any): boolean {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      if (element.hasAttribute('disabled')) {
        throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * copyFromInputElement
   */
  public copyFromInputElement(targetElm: HTMLInputElement | HTMLTextAreaElement, renderer: Renderer2): boolean {
    try {
      this.selectTarget(targetElm, renderer);
      const re = this.copyText();
      this.clearSelection(targetElm, this.windowRef);
      return re;
    } catch (error) {
      return false;
    }
  }

  /**
   * Creates a fake textarea element, sets its value from `text` property,
   * and makes a selection on it.
   */
  public copyFromContent(content: string, renderer: Renderer2) {
    if (!this.tempTextArea) {
      this.tempTextArea = this.createTempTextArea(this.document, this.windowRef);
      this.document.body.appendChild(this.tempTextArea);
    }
    this.tempTextArea.value = content;
    return this.copyFromInputElement(this.tempTextArea, renderer);
  }

  // remove temporary textarea if any
  public destroy() {
    if (this.tempTextArea) {
      this.document.body.removeChild(this.tempTextArea);
      this.tempTextArea = undefined;
    }
  }

  // select the target html input element
  private selectTarget(inputElement: HTMLInputElement | HTMLTextAreaElement, renderer: Renderer2): number | undefined {
    renderer.selectRootElement(inputElement).select();
    renderer.selectRootElement(inputElement).setSelectionRange(0, inputElement.value.length);
    return inputElement.value.length;
  }

  private copyText(): boolean {
    return this.document.execCommand('copy');
  }
  // Removes current selection and focus from `target` element.
  private clearSelection(inputElement: HTMLInputElement | HTMLTextAreaElement, window: any) {
    // tslint:disable-next-line:no-unused-expression
    inputElement && inputElement.blur();
    window.nativeWindow.getSelection().removeAllRanges();
  }

  // create a fake textarea for copy command
  private createTempTextArea(doc: Document, window: any): HTMLTextAreaElement {
    const isRTL = doc.documentElement.getAttribute('dir') === 'rtl';
    let ta: HTMLTextAreaElement;
    ta = doc.createElement('textarea');
    // Prevent zooming on iOS
    ta.style.fontSize = '12pt';
    // Reset box model
    ta.style.border = '0';
    ta.style.padding = '0';
    ta.style.margin = '0';
    // Move element out of screen horizontally
    ta.style.position = 'absolute';
    ta.style[isRTL ? 'right' : 'left'] = '-9999px';
    // Move element to the same position vertically
    let yPosition = window.pageYOffset || doc.documentElement.scrollTop;
    ta.style.top = yPosition + 'px';
    ta.setAttribute('readonly', '');
    return ta;
  }
}
