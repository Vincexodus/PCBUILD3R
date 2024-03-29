import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CompanyComponent } from './components/company/company.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NgToastModule } from 'ng-angular-popup'
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { AboutComponent } from './components/company/about/about.component';
import { ContactComponent } from './components/company/contact/contact.component';
import { ShopComponent } from './components/shop/shop.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AccountComponent } from './components/account/account.component';
import { OrderHistoryComponent } from './components/account/order-history/order-history.component';
import { EditProfileComponent } from './components/account/edit-profile/edit-profile.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AdminProductComponent } from './components/admin/admin-product/admin-product.component';
import { AdminPaymentComponent } from './components/admin/admin-payment/admin-payment.component';
import { AdminUserComponent } from './components/admin/admin-user/admin-user.component';
import { AdminCategoryComponent } from './components/admin/admin-category/admin-category.component';
import { HelpsComponent } from './helps/helps.component';
import { PrivacyPolicyComponent } from './helps/privacy-policy/privacy-policy.component';
import { FaqComponent } from './helps/faq/faq.component';
import { TermsOfUseComponent } from './helps/terms-of-use/terms-of-use.component';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: ShopComponent },

  { path: 'productDetail/:productId', component: ProductDetailComponent },
  // { path: 'checkout', component: CheckoutComponent },
  {
    path: 'company',
    component: CompanyComponent,
    children: [
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: '', redirectTo: 'about', pathMatch: 'full' }, // Default tab
    ],
  },
  {
    path: 'account',
    component: AccountComponent,
    children: [
      { path: 'orderHistory', component: OrderHistoryComponent },
      { path: 'shoppingCart', component: ShoppingCartComponent },
      { path: 'editProfile', component: EditProfileComponent },
      { path: '', redirectTo: 'orderHistory', pathMatch: 'full' },
    ],
  },
  {
    path: 'help',
    component: HelpsComponent,
    children: [
      { path: 'privacyPolicy', component: PrivacyPolicyComponent },
      { path: 'termsOfUse', component: TermsOfUseComponent },
      { path: 'faq', component: FaqComponent },
      { path: '', redirectTo: 'privacyPolicy', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin',
    component: AdminHomeComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'product', component: AdminProductComponent },
      { path: 'category', component: AdminCategoryComponent },
      { path: 'payment', component: AdminPaymentComponent },
      { path: 'user', component: AdminUserComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({ 
  imports: [RouterModule.forRoot(routes), NgToastModule], 
  exports: [RouterModule], 
}) 
export class AppRoutingModule {}