import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './AppRouting.module';
import { App } from './App.component';
import { HttpClientModule } from '@angular/common/http';
import { AnonymousLayout } from './Components/Layouts/AnonymousLayout/AnonymousLayout.component';
import AuthService from './Services/AuthService';
import { AuthenticatedLayout } from './Components/Layouts/AuthenticatedLayout/AuthenticatedLayout.component';
import RouteService from './Services/RouteService';
import BusinessService from './Services/BusinessService';
import { ServicesService } from './Services/ServicesService';
import { PopUpMessageBox } from './Components/PopUpMessageBox/PopUpMessageBox.component';
import CacheService from './Services/CacheService';
import { BusinessHoursService } from './Services/BusinessHoursService';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    AnonymousLayout,
    AuthenticatedLayout,
    PopUpMessageBox,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    RouteService,
    BusinessHoursService,
    BusinessService,
    ServicesService,
    CacheService
  ],
  bootstrap: [App]
})
export class AppModule { }
