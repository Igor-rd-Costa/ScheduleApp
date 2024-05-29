import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Icon, IconType } from '../Icon/Icon.component';

@Component({
  selector: 'EditCard',
  standalone: true,
  imports: [Icon],
  templateUrl: './EditCard.component.html',
})
export class EditCard {
  @ViewChild('content') content! : ElementRef<HTMLElement>;
  @Input() icon : IconType | null = null;
  @Input() header : string = "";
  @Input() OnEdit : () => void = () => {};
  protected minimized = false;
  protected inAnimation = false;
  private height = "";

  ngAfterViewInit(): void {
    this.height = getComputedStyle(this.content.nativeElement).height;
  }

  ToggleVisibility() {
    this.inAnimation = true;
    if (!this.minimized) {
      this.height = getComputedStyle(this.content.nativeElement).height;
      this.content.nativeElement.animate([{height: this.height}, {height: '0px'}], {duration: 200, fill: 'forwards'})
      .addEventListener('finish', () => {
        this.minimized = !this.minimized;
        this.inAnimation = false;
      });
    } else {
      this.content.nativeElement.animate([{height: '0px'}, {height: this.height}], {duration: 200, fill: 'forwards'})
      .addEventListener('finish', () => {
        this.minimized = !this.minimized;
        this.inAnimation = false;
      });
    }  
  }
}
