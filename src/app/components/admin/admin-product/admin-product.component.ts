import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PaginationComponent } from '../../utils/pagination/pagination.component';
import { Product } from '../../../interface/product.model';
import { NgToastService } from 'ng-angular-popup';
import { UtilService } from '../../../service/util.service';
import { ProductService } from '../../../service/product.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCategory } from '../../../interface/product-category.model';
@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [CommonModule, PaginationComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.sass'
})
export class AdminProductComponent implements OnInit {
  @Input() show: boolean = false;
  products!: Product[];
  productCategory!: ProductCategory[];
  selectedCategoryId: string = "";
  isAddModalActive: boolean = false;
  deleteModalStates: { [productId: string]: boolean } = {};
  editModalStates: { [productId: string]: boolean } = {};
  imageName: string = "";
  imageUrl: string | ArrayBuffer | null = null;
  isDropdownActive = false;
  addForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private productService: ProductService, 
    private toast: NgToastService, 
    private util: UtilService,
    private formBuilder: FormBuilder) {
      this.addForm = this.formBuilder.group({
        productName: ['', [Validators.required, Validators.minLength(3)]],
        productDesc: ['', [Validators.required, Validators.minLength(3)]],
        productPrice: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.min(1), Validators.max(10000)]],
        stockQuantity: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.min(1), Validators.max(10000)]],
      });

      this.editForm = this.formBuilder.group({
        id: [{value: '', disabled: true}],
        productName: ['', [Validators.required, Validators.minLength(3)]],
        productDesc: ['', [Validators.required, Validators.minLength(3)]],
        productPrice: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.min(1), Validators.max(10000)]],
        stockQuantity: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.min(1), Validators.max(10000)]],
      });
    }

  ngOnInit() {
    this.getProductCategories();
    this.onCategoryReset();
    this.getProducts();
  }

  productSearch(keyword: string): void {
    if (keyword.length != 0) {
      this.products = this.products.filter(product =>
        product.productName.toLowerCase().includes(keyword.toLowerCase()) ||
        this.categoryNameById(product._productCategoryId).toLowerCase().includes(keyword.toLowerCase())
      );
    } else {
      this.getProducts();
    }
  }
  
  maskString(input: string): string {
    return this.util.maskString(input);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.imageName = file.name;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onEditImage(input: string | ArrayBuffer | null) : string | ArrayBuffer | null {
    if (!this.imageUrl) {
      return input;
    } else {
      return this.imageUrl
    }
  }

  onCategoryReset() {
    if (this.productCategory && this.productCategory.length > 0) {
      this.selectedCategoryId= this.productCategory[0]._id;
    }
  }

  onCategorySelect(categoryName: string) {
    const productCategory = this.productCategory.find(category => category.productCategoryName === categoryName);
    this.selectedCategoryId = productCategory? productCategory._id: '-';
  }

  categoryNameById(id: string) {
    const productCategory = this.productCategory.find(category => category._id === id);
    return productCategory ? productCategory.productCategoryNameShort: '-';
  }

  categoryIdByName(name: string) {
    const productCategory = this.productCategory.find(category => category.productCategoryName === name);
    return productCategory ? productCategory._id: '-';
  }

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  openAddModal(): void {
    this.isAddModalActive = true;
    this.imageUrl = "";
    this.addForm.reset();
    this.onCategoryReset();
  }

  closeAddModal(): void {
    this.isAddModalActive = false;
  }

  openDeleteModal(productId: string) {
    this.deleteModalStates[productId] = true;
  }

  closeDeleteModal(productId: string) {
    this.deleteModalStates[productId] = false;
  }
  
  openEditModal(productId: string) {
    this.imageUrl = "";
    this.editModalStates[productId] = true;
    const product = this.products.find(product => product._id === productId);
    this.editForm.patchValue({
      id: product?._id,
      productName: product?.productName,
      productDesc: product?.desc,
      productPrice: product?.price.$numberDecimal,
      stockQuantity: product?.quantity,
    })
  }

  closeEditModal(productId: string) {
    this.editModalStates[productId] = false;
  }

  getProductCategories() {
    this.productService.getProductCategory().subscribe((productCategory: ProductCategory[]) => {
      this.productCategory = productCategory;
    });
  }

  getProducts() {
    this.productService.getProduct().subscribe((products: Product[]) => {
      this.products = products.sort((a, b) => {
        return a.productName.localeCompare(b.productName);
      });
    });
  }

  addProduct() {
    if (this.addForm.valid) {
      const productName = this.addForm.get('productName')?.value;
      const productDesc = this.addForm.get('productDesc')?.value;
      const productPrice = this.addForm.get('productPrice')?.value;
      const stockQuantity = this.addForm.get('stockQuantity')?.value;
      this.productService.createProduct(this.selectedCategoryId, productName, this.imageUrl, productDesc, parseFloat(productPrice), parseFloat(stockQuantity)).subscribe(() => {
        this.toast.success({detail:"SUCCESS",summary:'Product Added!', duration:2000, position:'topCenter'});
        this.getProducts();
        this.closeAddModal();
      }, (error) => {
        console.log(error);
      })
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }

  editProduct() {
    if (this.editForm.valid) {
      const id = this.editForm.get('id')?.value;
      const productName = this.editForm.get('productName')?.value;
      const productDesc = this.editForm.get('productDesc')?.value;
      const productPrice = this.editForm.get('productPrice')?.value;
      const stockQuantity = this.editForm.get('stockQuantity')?.value;
      const product = this.products.find(cat => cat._id === id);
      if (product) {
        this.productService.updateProduct(id, product._productCategoryId, productName, this.onEditImage(product.productImage), productDesc, parseFloat(productPrice), parseFloat(stockQuantity)).subscribe(() => {
          this.toast.success({detail:"SUCCESS",summary:'Product Updated!', duration:2000, position:'topCenter'});
          this.getProducts();
          this.closeEditModal(id);
        }, (error) => {
          console.log(error);
        })
      }
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }

  deleteProduct(id: string) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.toast.error({detail:"SUCCESS",summary:'Product Deleted!', duration:2000, position:'topCenter'});
      this.getProducts();
      this.closeDeleteModal(id);
    }, (error) => {
      console.log(error);
    })
  }
}
