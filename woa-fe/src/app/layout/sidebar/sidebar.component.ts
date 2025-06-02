import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

interface NavigationItem {
  label: string;
  route: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  navigationItems: NavigationItem[] = [
    {
      label: 'Quotations',
      route: '/quotations',
      icon: 'format_quote',
      description: 'Inspirational quotes and wisdom'
    },
    {
      label: 'Affirmations',
      route: '/affirmations',
      icon: 'favorite',
      description: 'Personal development affirmations'
    },
    {
      label: 'Sentences',
      route: '/sentences',
      icon: 'translate',
      description: 'Language learning sentences'
    }
  ];

  onCloseSidebar(): void {
    this.closeSidebar.emit();
  }

  onNavigate(): void {
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
      this.onCloseSidebar();
    }
  }
}
