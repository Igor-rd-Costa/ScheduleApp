import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { App } from 'src/app/App.component';
import { CardBase } from 'src/app/Components/CardBase/CardBase.component';
import { FormInput } from 'src/app/Components/FormInput/FormInput.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { MessageType } from 'src/app/Components/PopUpMessageBox/PopUpMessageBox.component';
import { SecondaryButton } from 'src/app/Components/SecondaryButton/SecondaryButton.component';
import CacheService from 'src/app/Services/CacheService';
import { CategoryDeleteInfo, ServicesService } from 'src/app/Services/ServicesService';

@Component({
  selector: 'EditableCategoryCard',
  standalone: true,
  imports: [CardBase, MainButton, SecondaryButton, ReactiveFormsModule, FormInput],
  templateUrl: './EditableCategoryCard.component.html',
})
export class EditableCategoryCard implements AfterViewInit {
  @ViewChild(CardBase) base! : CardBase;
  @Input() categoryId : number = -1;  
  @Input() categoryName : string = "";
  @Output() Edited = new EventEmitter<number>();
  @Output() Deleted = new EventEmitter<CategoryDeleteInfo>();
  protected isInEditMode : boolean = false;
  protected editCategoryForm = new FormGroup({
    Name: new FormControl(this.categoryName, {validators: [Validators.required]})
  });

  public constructor(private servicesService : ServicesService) {}

  ngAfterViewInit(): void {
    const [ editIcon, deleteIcon ] = this.base.icons.map(icon => icon.element.nativeElement);
    if (editIcon === undefined || deleteIcon === undefined)
      return;

      editIcon.addEventListener('click', this.EnterEditMode.bind(this));
      editIcon.style.cursor = 'pointer';

      deleteIcon.addEventListener('click', this.Delete.bind(this));
      deleteIcon.style.cursor = 'pointer';
  }

  Edit(event : SubmitEvent) {
    event.preventDefault();
    console.log("Here:", this.editCategoryForm.controls.Name.value!);
    this.servicesService.UpdateCategory(this.categoryId, this.editCategoryForm.controls.Name.value!).then(success => {
      console.log("Here too:", success);
      this.LeaveEditMode();
      if (success)
        this.Edited.emit(this.categoryId);
    })
  }

  Delete() {
    App.PopUpMessageBox.YesCancel(MessageType.INFO, "Delete", `Delete category ${this.categoryName}?`).then(result => {
      if (result) {
        App.PopUpMessageBox.YesNo(MessageType.INFO, "", `Delete ${this.categoryName}'s services?`).then(deleteServices => {
          this.servicesService.DeleteCategory(this.categoryId, deleteServices).then(result => {
            if (result.categoryId !== -1)
              this.Deleted.emit(result);
          });
        });
      }
    }); 
  }

  EnterEditMode() {
    if (this.isInEditMode)
      return;
    this.isInEditMode = true;
    this.editCategoryForm.controls.Name.setValue(this.categoryName);
  }

  LeaveEditMode() {
    this.isInEditMode = false;
  }
}
