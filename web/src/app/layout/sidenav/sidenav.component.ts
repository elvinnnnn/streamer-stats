import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  standalone: true,
  selector: 'app-sidenav',
  imports: [MatSidenavModule, MatButtonModule],
  templateUrl: './sidenav.component.html',
})
export class SidenavComponent {}
