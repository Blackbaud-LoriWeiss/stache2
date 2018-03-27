import { Component, Input } from '@angular/core';
import { AsyncSubject } from 'rxjs';
import { StacheLayout } from './layout';
import { InputConverter } from '../shared';
import { StacheNavLink } from '../nav';

@Component({
  selector: 'stache-layout-container',
  templateUrl: './layout-container.component.html'
})
export class StacheLayoutContainerComponent implements StacheLayout {
  @Input()
  public pageTitle: string;

  @Input()
  public breadcrumbsRoutes: StacheNavLink[];

  @Input()
  public inPageRoutes: AsyncSubject<any>;

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
