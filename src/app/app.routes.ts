import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CompanyComponent } from './components/company/company.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { AboutComponent } from './components/company/about/about.component';
import { WorksComponent } from './components/company/works/works.component';
import { ContactComponent } from './components/company/contact/contact.component';
import { ShopComponent } from './components/shop/shop.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AccountComponent } from './components/account/account.component';
import { OrderHistoryComponent } from './components/account/order-history/order-history.component';
import { WishlistComponent } from './components/account/wishlist/wishlist.component';
import { EditProfileComponent } from './components/account/edit-profile/edit-profile.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'productDetail', component: ProductDetailComponent },
  { path: 'shoppingCart', component: ShoppingCartComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'checkout', component: CheckoutComponent },
  {
    path: 'company',
    component: CompanyComponent,
    children: [
      { path: 'about', component: AboutComponent },
      { path: 'works', component: WorksComponent },
      { path: 'contact', component: ContactComponent },
      { path: '', redirectTo: 'about', pathMatch: 'full' }, // Default tab
    ],
  },
  {
    path: 'account',
    component: AccountComponent,
    children: [
      { path: 'orderHistory', component: OrderHistoryComponent },
      { path: 'wishList', component: WishlistComponent },
      { path: 'shoppingCart', component: ShoppingCartComponent },
      { path: 'editProfile', component: EditProfileComponent },
    ],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({ 
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule], 
}) 
export class AppRoutingModule {}