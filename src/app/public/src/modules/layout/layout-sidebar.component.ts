import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { StacheLayout } from './layout';
import { InputConverter } from '../shared';
import { StacheNavLink } from '../nav';

@Component({
  selector: 'stache-layout-sidebar',
  templateUrl: './layout-sidebar.component.html',
  styleUrls: ['./layout-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StacheLayoutSidebarComponent implements StacheLayout {
  @Input()
  public pageTitle: string;

  @Input()
  public breadcrumbsRoutes: StacheNavLink[];

  @Input()
  public sidebarRoutes: StacheNavLink[];

  @Input()
  public inPageRoutes: StacheNavLink[];

  @Input()
  @InputConverter()
  public showBackToTop: boolean;

  @Input()
  @InputConverter()
  public showBreadcrumbs: boolean;

  @Input()
  @InputConverter()
  public showEditButton: boolean;

  @Input()
  @InputConverter()
  public showTableOfContents: boolean;

}
