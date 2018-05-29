import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxWindowTokenModule } from 'ngx-window-token';

import { DOCUMENT } from '@angular/platform-browser';
import { WINDOW } from 'ngx-window-token';
import { ClipboardDirective } from './clipboard.directive';
import { ClipboardService } from './clipboard.service';

// this pattern is mentioned in https://github.com/angular/angular/issues/13854 in #43
export function clipboardServiceFactory(doc: Document,
  win: Window, parentDispatcher: ClipboardService) {
  return parentDispatcher || new ClipboardService(doc, win);
}

@NgModule({
  declarations: [
    ClipboardDirective
  ],
  imports: [
    CommonModule,
    NgxWindowTokenModule
  ],
  exports: [
    ClipboardDirective
  ],
  providers: [
    {
      provide: ClipboardService,
      deps: [DOCUMENT, WINDOW, [new Optional(), new SkipSelf(), ClipboardService]],
      useFactory: clipboardServiceFactory
    }
  ]
})
export class StacheClipboardModule { }
