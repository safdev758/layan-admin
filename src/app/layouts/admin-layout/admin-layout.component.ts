import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <div class="content-offset" style="display:flex; flex-direction:column; min-height:100vh; width:100%;">
        <app-header></app-header>
        <main style="padding:var(--space-xl); position:relative; z-index:1; flex:1;">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AdminLayoutComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }
}
