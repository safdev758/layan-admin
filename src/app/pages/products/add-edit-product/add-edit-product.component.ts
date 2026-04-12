import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService, Product } from '../../../services/product.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss']
})
export class AddEditProductComponent implements OnInit {
  productForm: FormGroup;
  isLoading = false;
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<AddEditProductComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      categoryId: ['', [Validators.required]],
      brand: [''],
      weight: [''],
      nutritionalInfo: ['']
    });
  }

  ngOnInit(): void {
    if (this.data?.id) {
      this.productForm.patchValue(this.data);
      // Set image preview from image or imageUrl if available
      const img = this.data.image || this.data.imageUrl;
      if (img) {
        // If it already starts with data:image, it's a complete data URL
        if (img.startsWith('data:image')) {
          this.imagePreview = img;
        }
        // If it contains base64 marker but no data: prefix
        else if (img.includes('base64,')) {
          this.imagePreview = `data:image/jpeg;${img}`;
        }
        // If it's a full URL
        else if (img.startsWith('http')) {
          this.imagePreview = img;
        }
        // If it starts with a slash, it's a relative path
        else if (img.startsWith('/')) {
          const baseUrl = environment.apiUrl.replace('/api/v1', '');
          this.imagePreview = `${baseUrl}${img}`;
        }
        // Treat as raw base64
        else {
          this.imagePreview = `data:image/jpeg;base64,${img}`;
        }
      }
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('Image size must be less than 5MB', 'Close', { duration: 3000 });
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('Only image files (JPEG, PNG, GIF, WebP) are allowed', 'Close', { duration: 3000 });
        return;
      }
      
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(): Promise<void> {
    console.log('=== FORM SUBMISSION ===');
    console.log('Form valid:', this.productForm.valid);
    console.log('Form value:', this.productForm.value);
    console.log('Form errors:', this.productForm.errors);
    console.log('Name control:', this.productForm.get('name')?.value, this.productForm.get('name')?.errors);
    console.log('Price control:', this.productForm.get('price')?.value, this.productForm.get('price')?.errors);
    
    if (this.productForm.valid) {
      this.isLoading = true;
      try {
        const productData = this.productForm.value;
        
        if (this.data?.id) {
          // Update existing product
          await this.productService.updateProduct(this.data.id, productData).toPromise();
          
          if (this.selectedImage) {
            await this.productService.uploadImage(this.data.id, this.selectedImage).toPromise();
          }
          
          this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
        } else {
          // Create new product
          const newProduct = await this.productService.createProduct(productData).toPromise();
          
          if (this.selectedImage && newProduct?.id) {
            await this.productService.uploadImage(newProduct.id, this.selectedImage).toPromise();
          }
          
          this.snackBar.open('Product created successfully', 'Close', { duration: 3000 });
        }
        
        this.dialogRef.close(true);
      } catch (error) {
        console.error('Error saving product:', error);
        this.snackBar.open('Error saving product', 'Close', { duration: 3000 });
      } finally {
        this.isLoading = false;
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}