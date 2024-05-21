import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardBase } from 'src/app/Components/CardBase/CardBase.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { SecondaryButton } from 'src/app/Components/SecondaryButton/SecondaryButton.component';
import { ServicesService } from 'src/app/Services/ServicesService';

@Component({
  selector: 'EditableCategoryCard',
  standalone: true,
  imports: [CardBase, MainButton, SecondaryButton, ReactiveFormsModule],
  templateUrl: './EditableCategoryCard.component.html',
})
export class EditableCategoryCard implements AfterViewInit {
  @ViewChild(CardBase) base! : CardBase;
  @Input() categoryId : number = -1;  
  @Input() categoryName : string = "";
  protected isInEditMode : boolean = false;
  protected editCategoryForm = new FormGroup({
    Name: new FormControl(this.categoryName, {validators: [Validators.required]})
  });

  public constructor(private servicesService : ServicesService) {}

  ngAfterViewInit(): void {
      const icon = this.base.icon.element.nativeElement;
      if (icon === undefined)
        return;

      icon.addEventListener('click', this.EnterEditMode.bind(this));
      icon.style.cursor = 'pointer';
  }

  Edit(event : SubmitEvent) {
    event.preventDefault();

    this.servicesService.UpdateCategory(this.categoryId, this.editCategoryForm.controls.Name.value!).then(() => {
      this.LeaveEditMode();
    })
  }

  EnterEditMode() {
    this.isInEditMode = true;
    this.editCategoryForm.controls.Name.setValue(this.categoryName);
  }

  LeaveEditMode() {
    this.isInEditMode = false;
  }
}
