import { NgModule } from '@angular/core';

import { StacheModule } from './public';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  imports: [
    StacheModule,
    ClipboardModule
  ],
  exports: [
    StacheModule,
    ClipboardModule
  ],
  providers: [],
  declarations: []
})
export class AppExtrasModule { }
