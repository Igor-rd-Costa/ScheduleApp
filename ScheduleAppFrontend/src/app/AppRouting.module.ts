import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPage } from './Pages/MainPage/MainPage.component';
import { Register } from './Pages/Register/Register.component';
import { Login } from './Pages/Login/Login.component';
import { Home } from './Pages/Home/Home.component';
import { Profile } from './Pages/Profile/Profile.component';
import { AuthGuard } from './Services/AuthGuard';
import { Businesses } from './Pages/Businesses/Businesses.component';
import { Business } from './Pages/Business/Business.component';
import { Schedule } from './Pages/Business/Schedule/Schedule.component';
import { History } from './Pages/History/History.component';
import { Dashboard } from './Pages/Dashboard/Dashboard.component';

const routes: Routes = [
  {
    path: "",
    component: MainPage,
    canActivate: [AuthGuard],
  },
  {
    path: "login",
    component: Login,
    canActivate: [AuthGuard],
  },
  {
    path: "register",
    component: Register,
    canActivate: [AuthGuard],
  },
  {
    path: "home",
    component: Home,
    canActivate: [AuthGuard],
  },
  {
    path: "profile",
    component: Profile,
    canActivate: [AuthGuard],
  },
  {
    path: 'history',
    component: History,
    canActivate: [AuthGuard]
  },
  {
    path: 'businesses',
    component: Businesses,
    canActivate: [AuthGuard]
  },
  {
    path: 'business',
    component: Business,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard]
  },
  {
    path: 'business/:businessUrl',
    component: Business,
    canActivate: [AuthGuard],
  },
  {
    path: 'business/:businessUrl/schedule/:serviceId',
    component: Schedule,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
