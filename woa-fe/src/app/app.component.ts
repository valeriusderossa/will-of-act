import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent, SidebarComponent } from './layout/index';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent
  ],
  template: `
    <div class="app-container">
      <app-navbar
        (toggleSidebar)="onToggleSidebar()"
        class="app-navbar">
      </app-navbar>

      <app-sidebar
        [isOpen]="sidebarOpen"
        (closeSidebar)="onCloseSidebar()"
        class="app-sidebar">
        <main class="main-content">
          <div class="content-wrapper">
            <router-outlet />
          </div>
        </main>
      </app-sidebar>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .app-navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .app-sidebar {
      margin-top: 64px; /* Height of navbar */
      height: calc(100vh - 64px);
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100%;
    }

    .content-wrapper {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .content-wrapper {
        padding: 16px;
      }
    }
  `]
})
export class AppComponent {
  title = 'Will of Act';
  sidebarOpen = false;

  onToggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onCloseSidebar(): void {
    this.sidebarOpen = false;
  }
}
