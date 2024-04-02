import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { ProductCategory } from '../../../interface/product-category.model';
import { NgToastService } from 'ng-angular-popup';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilService } from '../../../service/util.service';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.sass'
})

export class AdminCategoryComponent implements OnInit {
  @Input() show: boolean = false;
  productCategory!: ProductCategory[];
  isAddModalActive: boolean = false;
  deleteModalStates: { [categoryId: string]: boolean } = {};
  editModalStates: { [categoryId: string]: boolean } = {};
  imageName: string = "";
  imageUrl: string | ArrayBuffer | null = null;
  addForm: FormGroup;
  editForm: FormGroup;
  
  constructor(
    private productService: ProductService, 
    private toast: NgToastService,
    private util: UtilService, 
    private formBuilder: FormBuilder) {
      this.addForm = this.formBuilder.group({
        productCategoryName: ['', [Validators.required, Validators.minLength(3)]],
        productCategoryNameShort: ['', [Validators.required, Validators.minLength(3)]],
      });

      this.editForm = this.formBuilder.group({
        id: [{value: '', disabled: true}],
        productCategoryName: ['', [Validators.required, Validators.minLength(3)]],
        productCategoryNameShort: ['', [Validators.required, Validators.minLength(3)]],
      });
    }
  
  ngOnInit() {
    this.getCategory();
  }

  categorySearch(keyword: string): void {
    if (keyword.length != 0) {
      this.productCategory = this.productCategory.filter(category =>
        category.productCategoryName.toLowerCase().includes(keyword.toLowerCase())
      );
    } else {
      this.getCategory();
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

  openAddModal(): void {
    this.isAddModalActive = true;
    this.imageUrl = "";
    this.addForm.reset();
  }

  closeAddModal(): void {
    this.isAddModalActive = false;
  }

  openDeleteModal(categoryId: string) {
    this.deleteModalStates[categoryId] = true;
  }

  closeDeleteModal(categoryId: string) {
    this.deleteModalStates[categoryId] = false;
  }
  
  openEditModal(categoryId: string) {
    this.editModalStates[categoryId] = true;
    this.imageUrl = "";
    const category = this.productCategory.find(cat => cat._id === categoryId);
    this.editForm.patchValue({
      id: category?._id,
      productCategoryName: category?.productCategoryName,
      productCategoryNameShort: category?.productCategoryNameShort,
    })
  }

  closeEditModal(categoryId: string) {
    this.editModalStates[categoryId] = false;
  }

  getCategory() {
    this.productService.getProductCategory().subscribe((productCategory: ProductCategory[]) => {
      this.productCategory = productCategory.sort((a, b) => {
        return a.productCategoryName.localeCompare(b.productCategoryName);
      });
    });
  }

  addCategory() {
    if (this.addForm.valid) {
      const productCategoryName = this.addForm.get('productCategoryName')?.value;
      const productCategoryNameShort = this.addForm.get('productCategoryNameShort')?.value;
      this.productService.createProductCategory(productCategoryName, productCategoryNameShort, this.imageUrl).subscribe(() => {
        this.toast.success({detail:"SUCCESS",summary:'Product Category Added!', duration:2000, position:'topCenter'});
        this.getCategory();
        this.closeAddModal();
      }, (error) => {
        console.log(error);
      })
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }

  editCategory() {
    if (this.editForm.valid) {
      const id = this.editForm.get('id')?.value;
      const productCategoryName = this.editForm.get('productCategoryName')?.value;
      const productCategoryNameShort = this.editForm.get('productCategoryNameShort')?.value;
      const category = this.productCategory.find(cat => cat._id === id);
      if (category) {
        this.productService.updateProductCategory(id, productCategoryName, productCategoryNameShort, this.onEditImage(category.productCategoryImage)).subscribe(() => {
          this.toast.success({detail:"SUCCESS",summary:'Product Category Updated!', duration:2000, position:'topCenter'});
          this.getCategory();
          this.closeEditModal(id);
        }, (error) => {
          console.log(error);
        })
      }
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }

  deleteCategory(id: string) {
    this.productService.deleteProductCategory(id).subscribe(() => {
      this.toast.error({detail:"SUCCESS",summary:'Product Category Deleted!', duration:2000, position:'topCenter'});
      this.getCategory();
      this.closeDeleteModal(id);
    }, (error) => {
      console.log(error);
    })
  }
}
