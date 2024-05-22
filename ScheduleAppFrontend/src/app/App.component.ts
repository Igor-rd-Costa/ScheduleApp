import { AfterViewInit, Component, ViewChild } from '@angular/core';
import AuthService from './Services/AuthService';
import { PopUpMessageBox } from './Components/PopUpMessageBox/PopUpMessageBox.component';


@Component({
  selector: 'App',
  templateUrl: './App.component.html',
})
export class App implements AfterViewInit {
  public static backendAddress = "http://localhost:5245/api/";
  @ViewChild(PopUpMessageBox) messageBox! : PopUpMessageBox;
  public static PopUpMessageBox : PopUpMessageBox;
  title = 'ScheduleAppFrontend';
  
  constructor(protected authService : AuthService) {}

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

  ngAfterViewInit(): void {
      App.PopUpMessageBox = this.messageBox;
  }
}

