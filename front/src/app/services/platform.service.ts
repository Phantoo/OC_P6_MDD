import { HostListener, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, throttleTime } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlatformService 
{
    static readonly MOBILE_BREAKPOINT: number = 768;
    static readonly TABLET_BREAKPOINT: number = 960;

    private isBrowser: boolean;
    private width: number = 0;

    resizeSubject: BehaviorSubject<number> = new BehaviorSubject(this.width);

    isMobile: boolean = false;
    isTablet: boolean = false; // Also true if width is less than mobile

    onResize$: Observable<number> = this.resizeSubject.asObservable();

    constructor(@Inject(PLATFORM_ID) platformId: Object) 
    {
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser) {
            this.width = window.innerWidth;
            this.updateBreakpoints();
            this.resizeSubject.next(this.width);
        }
    }

    @HostListener('window:resize', ['$event'])
	public onResize(event: any): void
    {
        this.width = event.target.innerWidth;
        this.updateBreakpoints();
        this.resizeSubject.next(this.width);
	}

    private updateBreakpoints(): void
    {
        this.isMobile = this.width <= PlatformService.MOBILE_BREAKPOINT;
        this.isTablet = this.width <= PlatformService.TABLET_BREAKPOINT;
    }
}
