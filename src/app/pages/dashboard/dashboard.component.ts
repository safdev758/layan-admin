import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Stats Cards -->
        <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Users</p>
              <p class="text-2xl font-semibold text-gray-800">1,234</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Orders</p>
              <p class="text-2xl font-semibold text-gray-800">567</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Revenue</p>
              <p class="text-2xl font-semibold text-gray-800">$12,345</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Now</p>
              <p class="text-2xl font-semibold text-gray-800">42</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div class="divide-y divide-gray-200">
          <div *ngFor="let activity of recentActivities" class="p-4 hover:bg-gray-50">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <span [ngClass]="getActivityIcon(activity.type)" class="inline-flex items-center justify-center h-10 w-10 rounded-full">
                  <span class="text-white">{{ getActivityInitial(activity.type) }}</span>
                </span>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-sm text-gray-500">{{ activity.description }}</p>
              </div>
              <div class="ml-auto text-sm text-gray-500">
                {{ activity.time }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  recentActivities = [
    {
      type: 'user',
      title: 'New user registered',
      description: 'John Doe created an account',
      time: '2 minutes ago'
    },
    {
      type: 'order',
      title: 'New order received',
      description: 'Order #ORD-006 for $249.99',
      time: '1 hour ago'
    },
    {
      type: 'product',
      title: 'Product updated',
      description: 'Summer Collection 2023 was updated',
      time: '3 hours ago'
    },
    {
      type: 'user',
      title: 'Profile updated',
      description: 'Sarah Wilson updated her profile',
      time: '5 hours ago'
    }
  ];

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      user: 'bg-blue-500',
      order: 'bg-green-500',
      product: 'bg-yellow-500',
      settings: 'bg-purple-500'
    };
    return icons[type] || 'bg-gray-500';
  }

  getActivityInitial(type: string): string {
    return type.charAt(0).toUpperCase();
  }
}
