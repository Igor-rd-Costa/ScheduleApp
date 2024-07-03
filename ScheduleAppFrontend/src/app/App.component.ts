import { AfterViewInit, Component, ViewChild, isDevMode } from '@angular/core';
import AuthService from './Services/AuthService';
import { PopUpMessageBox } from './Components/PopUpMessageBox/PopUpMessageBox.component';
import { PopDownMessageBox } from './Components/PopDownMessageBox/PopDownMessageBox.component';


@Component({
  selector: 'App',
  templateUrl: './App.component.html',
})
export class App implements AfterViewInit {
  public static backendAddress = isDevMode() ? "http://localhost:5245/api/" : "https://api.igored.com/api/";
  @ViewChild(PopUpMessageBox) popUpMessageBox! : PopUpMessageBox;
  @ViewChild(PopDownMessageBox) popDownMessageBox! : PopDownMessageBox;
  public static PopUpMessageBox : PopUpMessageBox;
  public static PopDownMessageBox : PopDownMessageBox;
  private static title = 'ScheduleAppFrontend';
  
  constructor(protected authService : AuthService) {
  }

  public static Blur() {
    const wrapper = document.getElementById('app-wrapper');
    if (wrapper) {
      wrapper.style.filter = 'blur(1px) grayscale(20%)';
      wrapper.style.userSelect = 'none';
      wrapper.style.pointerEvents = 'none';
    }
  }
  
  public static UnBlur() {
    const wrapper = document.getElementById('app-wrapper');
    if (wrapper) {
      wrapper.style.filter = "";
      wrapper.style.userSelect = '';
      wrapper.style.pointerEvents = '';
    }  
  }

  public static Title() {
    return this.title;
  }

  ngAfterViewInit(): void {
      App.PopUpMessageBox = this.popUpMessageBox;
      App.PopDownMessageBox = this.popDownMessageBox;
  }
}

