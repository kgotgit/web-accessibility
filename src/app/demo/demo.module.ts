import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoComboboxComponent } from './demo-combobox/demo-combobox.component';
import { DemoTransferlistComponent } from './demo-transferlist/demo-transferlist.component';
import { AccessibilityModule } from '../accessibility/accessibility.module';
import { DemoModalwindowComponent } from './demo-modalwindow/demo-modalwindow.component';
import { DemoTabsComponent } from './demo-tabs/demo-tabs.component';
import { DemoTablesComponent } from './demo-tables/demo-tables.component';
import { DemoProgressbarsComponent } from './demo-progressbars/demo-progressbars.component';
import { DemoAlertsComponent } from './demo-alerts/demo-alerts.component';
import { DemoListgroupComponent } from './demo-listgroup/demo-listgroup.component';

@NgModule({
  imports: [
    CommonModule,
    AccessibilityModule,
  ],
  declarations: [DemoComboboxComponent, DemoTransferlistComponent, DemoModalwindowComponent, DemoTabsComponent, DemoTablesComponent, DemoProgressbarsComponent, DemoAlertsComponent, DemoListgroupComponent]
})
export class DemoModule { }
