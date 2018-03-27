import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StacheTitleService } from './title.service';
import { StachePageAnchorService } from '../page-anchor';
import { StacheLayoutModule } from '../layout';
import { StacheAnalyticsModule } from '../analytics';

import { StacheWrapperComponent } from './wrapper.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    StacheAnalyticsModule,
    StacheLayoutModule
  ],
  declarations: [
    StacheWrapperComponent
  ],
  exports: [
    StacheWrapperComponent
  ],
  providers: [
    StacheTitleService,
    StachePageAnchorService
  ]
})
export class StacheWrapperModule { }
