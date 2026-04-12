import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService, Advertisement } from '../../services/dashboard.service';

@Component({
    selector: 'app-advertisements',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './advertisements.component.html',
    styleUrls: ['./advertisements.component.css']
})
export class AdvertisementsComponent implements OnInit {
    ads: Advertisement[] = [];
    showForm = false;
    isSubmitting = false;
    isLoading = false;
    errorMessage = '';
    previewUrl: string | null = null;

    newAd = {
        imageBase64: '',
        description: ''
    };

    constructor(private dashboardService: DashboardService) { }

    ngOnInit() {
        this.loadAds();
    }

    loadAds() {
        this.isLoading = true;
        this.errorMessage = '';
        this.dashboardService.getAds().subscribe({
            next: (res) => {
                this.ads = res.advertisements || [];
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load ads', err);
                this.errorMessage = 'Failed to load advertisements.';
                this.isLoading = false;
            }
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.previewUrl = e.target.result;
                this.newAd.imageBase64 = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    createAd() {
        if (!this.newAd.imageBase64 || !this.newAd.description) return;

        this.isSubmitting = true;
        this.dashboardService.createAd(this.newAd).subscribe({
            next: (ad) => {
                this.ads.unshift(ad);
                this.showForm = false;
                this.newAd = { imageBase64: '', description: '' };
                this.previewUrl = null;
                this.isSubmitting = false;
            },
            error: (err) => {
                console.error('Failed to create ad', err);
                this.errorMessage = 'Failed to create advertisement.';
                this.isSubmitting = false;
            }
        });
    }

    toggleAd(ad: Advertisement) {
        this.dashboardService.toggleAd(ad.id).subscribe({
            next: (updatedAd) => {
                const index = this.ads.findIndex(a => a.id === ad.id);
                if (index !== -1) {
                    this.ads[index] = updatedAd;
                }
            },
            error: (err) => {
                console.error('Failed to toggle ad', err);
                this.errorMessage = 'Failed to update advertisement status.';
            }
        });
    }

    deleteAd(ad: Advertisement) {
        if (!confirm('Are you sure you want to delete this advertisement?')) return;

        this.dashboardService.deleteAd(ad.id).subscribe({
            next: () => {
                this.ads = this.ads.filter(a => a.id !== ad.id);
            },
            error: (err) => {
                console.error('Failed to delete ad', err);
                this.errorMessage = 'Failed to delete advertisement.';
            }
        });
    }
}
