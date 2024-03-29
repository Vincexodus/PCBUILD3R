import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PaginationComponent } from '../../utils/pagination/pagination.component';
import { Product } from '../../../interface/product.model';
import { NgToastService } from 'ng-angular-popup';
import { UtilService } from '../../../service/util.service';
import { ProductService } from '../../../service/product.service';
import { FormsModule } from '@angular/forms';
import { ProductCategory } from '../../../interface/product-category.model';
@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [CommonModule, PaginationComponent, FormsModule],
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.sass'
})
export class AdminProductComponent implements OnInit {
  @Input() show: boolean = false;
  products!: Product[];
  productQuantity: number | "" = "";
  productCategory!: ProductCategory[];
  isAddModalActive: boolean = false;
  selectedCategoryId: string = "";
  editProductName: string = "";
  editProductCategory: string = "";
  editProductDesc: string = "";
  editProductPrice: number | "" = "";
  editProductQuantity: Number | "" = "";
  editProductImage: string | ArrayBuffer | null = null;
  deleteModalStates: { [productId: string]: boolean } = {};
  editModalStates: { [productId: string]: boolean } = {};
  imageName: string = "";
  imageUrl: string | ArrayBuffer | null = null;
  isDropdownActive = false;

  constructor(private productService: ProductService, private toast: NgToastService, private util: UtilService) { }

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
    this.editProductName = product ? product.productName : '';
    this.editProductCategory = product? this.categoryNameById(product?._productCategoryId): '';
    this.editProductDesc = product ? product.desc : '';
    this.editProductPrice = product ? product.price.$numberDecimal : '';
    this.editProductImage= product ? product.productImage : '';
    this.editProductQuantity= product ? product.quantity : '';
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

  addProduct(productCategoryId: string, productName: string, productImage: string | ArrayBuffer | null, productDesc: string, productPrice: string, productQuantity: string) {
    if (!this.util.strValidation(productCategoryId, productName, productDesc, productQuantity) && !this.util.numValidation(productPrice, productQuantity)) {
      this.productService.createProduct(productCategoryId, productName, productImage, productDesc, parseFloat(productPrice), parseFloat(productQuantity)).subscribe(() => {
        this.toast.success({detail:"SUCCESS",summary:'Product Added!', duration:2000, position:'topCenter'});
        this.getProducts();
        this.closeAddModal();
      }, (error) => {
        console.log(error);
      })
    }
  }

  editProduct(id: string, productCategoryId: string, productName: string, productImage: string | ArrayBuffer | null, productDesc: string, productPrice: string, productQuantity: string) {
    if (!this.util.strValidation(productCategoryId, productName, productDesc, productPrice, productQuantity) && !this.util.numValidation(productPrice, productQuantity)) {
      this.productService.updateProduct(id, productCategoryId, productName, productImage, productDesc, parseFloat(productPrice), parseFloat(productQuantity)).subscribe(() => {
        this.toast.warning({detail:"SUCCESS",summary:'Product Updated!', duration:2000, position:'topCenter'});
        this.getProducts();
        this.closeEditModal(id);
      }, (error) => {
        console.log(error);
      })
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
