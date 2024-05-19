import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'MinimizableCard',
  standalone: true,
  imports: [],
  templateUrl: './MinimizableCard.component.html',
})
export class MinimizableCard implements AfterViewInit {
  @Input() header : string = "";
  @ViewChild('content') content! : ElementRef<HTMLElement>;
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
