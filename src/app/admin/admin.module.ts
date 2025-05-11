import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ToastrModule } from "ngx-toastr";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ToastrModule.forRoot(),
  ]
})
export class AdminModule { }
