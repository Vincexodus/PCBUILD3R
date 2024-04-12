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
import { AccountComponent } from './components/account/account.component';
import { OrderHistoryComponent } from './components/account/order-history/order-history.component';
import { EditProfileComponent } from './components/account/edit-profile/edit-profile.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminProductComponent } from './components/admin/admin-product/admin-product.component';
import { AdminUserComponent } from './components/admin/admin-user/admin-user.component';
import { AdminCategoryComponent } from './components/admin/admin-category/admin-category.component';
import { HelpsComponent } from './components/helps/helps.component';
import { PrivacyPolicyComponent } from './components/helps/privacy-policy/privacy-policy.component';
import { FaqComponent } from './components/helps/faq/faq.component';
import { TermsOfUseComponent } from './components/helps/terms-of-use/terms-of-use.component';
import { AdminOrderComponent } from './components/admin/admin-order/admin-order.component';
import { AdminVoucherComponent } from './components/admin/admin-voucher/admin-voucher.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { AdminSessionComponent } from './components/admin/admin-session/admin-session.component';
import { SimulationSessionComponent } from './components/account/simulation-session/simulation-session.component';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'shop/:id', component: ShopComponent },
  { path: 'canvas', component: CanvasComponent },

  { path: 'productDetail/:productId', component: ProductDetailComponent },
  { path: 'company', component: CompanyComponent,
    children: [
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: '', redirectTo: 'about', pathMatch: 'full' }, // Default tab
    ],
  },
  { path: 'account', component: AccountComponent,
    children: [
      { path: 'orderHistory', component: OrderHistoryComponent },
      { path: 'shoppingCart', component: ShoppingCartComponent },
      { path: 'session', component: SimulationSessionComponent },
      { path: 'editProfile', component: EditProfileComponent },
      { path: '', redirectTo: 'orderHistory', pathMatch: 'full' },
    ],
  },
  { path: 'help', component: HelpsComponent,
    children: [
      { path: 'privacyPolicy', component: PrivacyPolicyComponent },
      { path: 'termsOfUse', component: TermsOfUseComponent },
      { path: 'faq', component: FaqComponent },
      { path: '', redirectTo: 'privacyPolicy', pathMatch: 'full' },
    ],
  },
  { path: 'admin', component: AdminHomeComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'category', component: AdminCategoryComponent },
      { path: 'product', component: AdminProductComponent },
      { path: 'voucher', component: AdminVoucherComponent },
      { path: 'order', component: AdminOrderComponent },
      { path: 'session', component: AdminSessionComponent },
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