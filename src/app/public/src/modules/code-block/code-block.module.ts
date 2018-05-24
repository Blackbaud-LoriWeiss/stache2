import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheCodeBlockComponent } from './code-block.component';
import { StacheClipboardModule } from '../clipboard/clipboard.module';

require('style-loader!prismjs/themes/prism.css');

@NgModule({
  declarations: [
    StacheCodeBlockComponent
  ],
  imports: [
    CommonModule,
    StacheClipboardModule
  ],
  exports: [
    StacheCodeBlockComponent
  ]
})
export class StacheCodeBlockModule { }
