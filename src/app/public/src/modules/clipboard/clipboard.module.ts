import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';
import { DOCUMENT } from '@angular/platform-browser';

import { ClipboardService } from './clipboard.service';
import { StacheClipboardComponent } from './clipboard.component';
import { FormsModule } from '@angular/forms';
import { StacheClipboardDirective } from './clipboard.directive';
import { StacheWindowRef } from '../shared';

// this pattern is mentioned in https://github.com/angular/angular/issues/13854 in #43
export function clipboardServiceFactory(doc: Document,
  win: any, parentDispatcher: ClipboardService) {
  return parentDispatcher || new ClipboardService(doc, win);
}

@NgModule({
  declarations: [
    StacheClipboardDirective,
    StacheClipboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ClipboardModule
  ],
  exports: [
    StacheClipboardDirective,
    StacheClipboardComponent
  ],
  providers: [
    {
      provide: ClipboardService,
      deps: [DOCUMENT, StacheWindowRef, [new Optional(), new SkipSelf(), ClipboardService]],
      useFactory: clipboardServiceFactory
    }
  ]
})
export class StacheClipboardModule { }
