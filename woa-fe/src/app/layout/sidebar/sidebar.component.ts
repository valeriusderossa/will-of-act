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
  children?: NavigationItem[];
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

  private openSubMenus = new Set<string>();

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
    },
    {
      label: 'My Thinks',
      route: '/thinks',
      icon: 'lightbulb',
      description: 'Personal thoughts and reflections'
    },
    {
      label: 'Technical Learnings',
      route: '/technical-learnings',
      icon: 'school',
      description: 'Programming & tech learning notes'
    },
    {
      label: 'Exercises',
      route: '/exercises',
      icon: 'fitness_center',
      description: 'Fitness and training tracking',
      children: [
        {
          label: 'Gym',
          route: '/exercises/gym',
          icon: 'sports_gymnastics',
          description: 'Strength training sessions'
        },
        {
          label: 'Running',
          route: '/exercises/running',
          icon: 'directions_run',
          description: 'Cardio and running activities'
        }
      ]
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

  toggleSubMenu(label: string): void {
    if (this.openSubMenus.has(label)) {
      this.openSubMenus.delete(label);
    } else {
      this.openSubMenus.add(label);
    }
  }

  isSubMenuOpen(label: string): boolean {
    return this.openSubMenus.has(label);
  }
}
