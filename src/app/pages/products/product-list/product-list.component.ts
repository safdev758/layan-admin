import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddEditProductComponent } from '../add-edit-product/add-edit-product.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['image', 'name', 'price', 'stock', 'actions'];
  isLoading = true;
  
  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log('=== PRODUCTS DATA FROM BACKEND ===');
        console.log('Full response:', data);
        this.products = data.products || [];
        
        // Debug each product's image data
        this.products.forEach((product, index) => {
          console.log(`Product ${index + 1} - ${product.name}:`);
          console.log('  imageUrl:', product.imageUrl);
          console.log('  imageUrl type:', typeof product.imageUrl);
          console.log('  imageUrl length:', product.imageUrl?.length);
          console.log('  First 100 chars:', product.imageUrl?.substring(0, 100));
          console.log('  Starts with "data:"?', product.imageUrl?.startsWith('data:'));
          console.log('  Contains "base64,"?', product.imageUrl?.includes('base64,'));
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.snackBar.open('Error loading products', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  getImageUrl(imageUrl?: string): string {
    console.log('=== getImageUrl called ===');
    console.log('Input imageUrl:', imageUrl);
    console.log('Input length:', imageUrl?.length);
    
    if (!imageUrl) {
      console.log('No imageUrl, returning placeholder');
      return 'assets/images/placeholder.png';
    }
    
    // If it already starts with data:image, it's a complete data URL
    if (imageUrl.startsWith('data:image')) {
      console.log('✓ Complete data URL detected, returning as-is');
      return imageUrl;
    }
    
    // If it contains base64 marker but no data: prefix, it's the middle part
    if (imageUrl.includes('base64,')) {
      const result = `data:image/jpeg;${imageUrl}`;
      console.log('✓ Partial data URL detected, prepending "data:image/jpeg;"');
      console.log('Result:', result.substring(0, 100) + '...');
      return result;
    }
    
    // If it's already a full URL
    if (imageUrl.startsWith('http')) {
      console.log('✓ HTTP URL detected, returning as-is');
      return imageUrl;
    }
    
    // If it starts with a slash, it's a relative path
    if (imageUrl.startsWith('/')) {
      const baseUrl = environment.apiUrl.replace('/api/v1', '');
      const result = `${baseUrl}${imageUrl}`;
      console.log('✓ Relative path detected, prepending base URL');
      console.log('Result:', result);
      return result;
    }
    
    // Treat as raw base64 image data
    const result = `data:image/jpeg;base64,${imageUrl}`;
    console.log('✓ Raw base64 detected, adding full prefix');
    console.log('Result:', result.substring(0, 100) + '...');
    return result;
  }

  openAddEditProduct(product?: Product): void {
    const dialogRef = this.dialog.open(AddEditProductComponent, {
      width: '600px',
      data: product || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Product',
        message: 'Are you sure you want to delete this product?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            this.snackBar.open('Error deleting product', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  toggleProductStatus(product: Product): void {
    const updatedProduct = {
      ...product,
      isAvailable: !product.isAvailable
    };

    this.productService.updateProduct(product.id!, updatedProduct).subscribe({
      next: () => {
        this.snackBar.open('Product status updated', 'Close', { duration: 3000 });
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error updating product status:', error);
        this.snackBar.open('Error updating product status', 'Close', { duration: 3000 });
      }
    });
  }
}