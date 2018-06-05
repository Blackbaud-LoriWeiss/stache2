// import { By } from '@angular/platform-browser';
// import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
// import { Optional, SkipSelf } from '@angular/core';

// import { DOCUMENT } from '@angular/platform-browser';

// import { StacheCodeComponent } from '../code';

// import { StacheWindowRef, TestUtility } from '../shared';
// import { StacheClipboardComponent } from './clipboard.component';
// import { StacheClipboardDirective } from './clipboard.directive';
// import { ClipboardService } from './clipboard.service';
// import { clipboardServiceFactory } from './clipboard.module';
// import { StacheClipboardTestComponent } from './fixtures/clipboard.component.fixture';

// fdescribe('ClipboardTestDirective', () => {
//   let component: StacheClipboardComponent;
//   let fixture: ComponentFixture<StacheClipboardComponent>;
//   let windowRef: any;
//   let directiveElements: any;
//   let directiveInstance: any;
//   let clipboardService: ClipboardService;
//   let spy: any;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         StacheCodeComponent,
//         StacheClipboardTestComponent,
//         StacheClipboardDirective
//       ],
//       imports: [
//         NgxWindowTokenModule
//       ],
//       providers: [
//         StacheWindowRef,
//         {
//           provide: ClipboardService,
//           deps: [DOCUMENT, WINDOW, [new Optional(), new SkipSelf(), ClipboardService]],
//           useFactory: clipboardServiceFactory
//         }
//       ]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(StacheClipboardTestComponent);
//     component = fixture.componentInstance;
//     directiveElements = fixture.debugElement.queryAll(By.directive(StacheClipboardDirective));
//     directiveInstance = directiveElements[0].injector.get(StacheClipboardDirective);
//     clipboardService = fixture.debugElement.injector.get(ClipboardService);
//     spy = spyOn(clipboardService, 'copyText' as keyof (ClipboardService));
//     directiveInstance.ngAfterViewInit();
//   });

//   beforeEach(inject([StacheWindowRef], (service: any) => {
//     windowRef = service.nativeWindow;
//   }));

//   it('should exist on the component', () => {
//     expect(directiveElements[0]).not.toBeNull();
//   });

//   it('should initialize view', () => {
//     expect(!!directiveInstance.targetElm).toBe(true);
//   });

//   it('should reveal button on hover', () => {
//     expect(directiveInstance.button.style.opacity).toEqual('0');
//     TestUtility.triggerDomEvent(directiveInstance.targetElm, 'mouseover');
//     setTimeout(
//       expect(directiveInstance.button.style.opacity).toEqual('100')
//     , 300);
//   });

//   it('should hide button on fade', () => {
//     TestUtility.triggerDomEvent(directiveInstance.targetElm, 'mouseover');
//     setTimeout(() => {
//       expect(directiveInstance.button.style.opacity).toEqual('100');
//       TestUtility.triggerDomEvent(directiveInstance.targetElm, 'mouseout');
//       setTimeout(() => {
//         fixture.detectChanges();
//         expect(directiveInstance.button.style.opacity).toEqual('0');
//       }
//       , 300);
//     }, 300);
//   });

//   it('should click target element', () => {
//     spyOn(directiveInstance, 'onClick');
//     expect(directiveInstance.button.children[0].className).toEqual('fa fa-clipboard');
//     directiveInstance.button.click();
//     expect(directiveInstance.button.children[0].className).toEqual('fa fa-check');
//     setTimeout(() => {
//       fixture.detectChanges();
//       expect(directiveInstance.button.children[0].className).toEqual('fa fa-clipboard');
//     }
//     , 1000);
//     expect(directiveInstance.onClick).toHaveBeenCalled();
//   });

//   it('should copy target element text', () => {
//     spyOn(directiveInstance, 'handleResult');
//     directiveInstance.onClick();
//     expect(directiveInstance.handleResult).toHaveBeenCalled();
//   });

//   it('should fire cbOnError if environment does not support copy', () => {
//     spy = spyOn(clipboardService, 'isSupported');
//     spy.and.returnValue(false);
//     directiveInstance.onClick();
//     // directiveInstance.cbOnError.subscribe((val: any) => {
//     //   expect(val).toEqual({ isSuccess: false });
//     // });
//     // directiveInstance.cbOnError.unsubscribe();
//   });

//   // it('should fire cbOnSuccess after copy successfully', () => {
//   //   fixture.detectChanges();
//   //   spy = spyOn(clipboardService, 'isSupported');
//   //   spy.and.returnValue(true);
//   //   directiveInstance.cbOnSuccess.subscribe((val: any) => {
//   //     expect(val).toEqual({ isSuccess: true, content: 'copy this' });
//   //   });
//   //   directiveInstance.button.click();
//   //   directiveInstance.cbOnSuccess.unsubscribe();
//   // });
// });
