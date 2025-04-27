import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { HomeComponent } from './ui/components/home/home.component';

const routes: Routes = [
  // Layout component'e gelen route'lar ve layout component altında gösterilecek component'ler burada tanımlanacak
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      {path: "", component: DashboardComponent}, // ..com/admin/ sayfasına gittiğinde direkt olarak dashboard component'ini gösterir. Dashboard burada ana sayfa gibi düşünülmeli.
      {
        path: 'customers',
        loadChildren: () =>
          import('./admin/components/customers/customers.module').then(
            (module) => module.CustomersModule
          ),
      }, // http:// ...com/admin/customers bu kısımdan sonra gelen ne varsa onu customers module de ara.
      {
        path: 'products',
        loadChildren: () =>
          import('./admin/components/products/products.module').then(
            (module) => module.ProductsModule
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./admin/components/orders/orders.module').then(
            (module) => module.OrdersModule
          ),
      },
    ],
  },
  // Ana layout için bundan sonraki tüm sayfalara obje olarak layout component'i atanacak. Yani children tanımlamayacağız. Çünkü ana layout'a karşılık gelen bir component yok.
  {path: "", component: HomeComponent}, // http:// ...com/ sayfasına gittiğinde direkt olarak home component'ini gösterir. Home burada ana sayfa gibi düşünülmeli.
  {path: "baskets", loadChildren: () => import("./ui/components/baskets/baskets.module").then(module=> module.BasketsModule)},
  {path: "products", loadChildren: () => import("./ui/components/products/products.module").then(module=> module.ProductsModule)},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
