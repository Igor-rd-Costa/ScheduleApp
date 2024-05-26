import { Component, EventEmitter, Input, Output, ViewChild, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { App } from 'src/app/App.component';
import { CardBase } from 'src/app/Components/CardBase/CardBase.component';
import { Icon, IconType } from 'src/app/Components/Icon/Icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { MessageType } from 'src/app/Components/PopUpMessageBox/PopUpMessageBox.component';
import { SecondaryButton } from 'src/app/Components/SecondaryButton/SecondaryButton.component';
import { BusinessService, ServicesService } from 'src/app/Services/ServicesService';

@Component({
  selector: 'EditableServiceCard',
  standalone: true,
  imports: [CardBase, Icon, MainButton, SecondaryButton, ReactiveFormsModule],
  templateUrl: './EditableServiceCard.component.html',
})
export class EditableServiceCard {
  @ViewChild(CardBase) base! : CardBase;
  @Input() serviceId : number = -1;  
  @Input() serviceName : string = "";
  @Input() serviceDescription : string = "";
  @Input() serviceIcon : IconType = 'visibility';
  @Input() serviceDuration : number = 0;
  @Input() servicePrice : number | null = 30;
  @Input() serviceCategory : number | null = null;
  @Output() Edited = new EventEmitter<number>(); 
  @Output() Deleted = new EventEmitter<number>();
  protected serviceCategoryName = signal("");
  protected isInEditMode : boolean = false;
  protected editServiceForm = new FormGroup({
    Name: new FormControl('', {validators: [Validators.required]}),
    Description: new FormControl(''),
    Price: new FormControl(0),
    Duration: new FormControl(0, {validators: [Validators.required]}),
    Category: new FormControl<number|null>(null)
  });

  public constructor(protected servicesService : ServicesService) {}

  ngAfterViewInit(): void {
      const [ editIcon, deleteIcon ] = this.base.icons.map(icon => icon.element.nativeElement);
      if (editIcon === undefined || deleteIcon == undefined)
        return;

      editIcon.addEventListener('click', this.EnterEditMode.bind(this));
      editIcon.style.cursor = 'pointer';

      deleteIcon.addEventListener('click', this.Delete.bind(this));
      deleteIcon.style.cursor = 'pointer';

      if (this.serviceCategory) {
        this.servicesService.GetCategoryName(this.serviceCategory).then(result => {
          this.serviceCategoryName.set(result ?? "");
        });
      }
  }

  Edit(event : SubmitEvent) {
    event.preventDefault();
    const name = this.editServiceForm.controls.Name.value!;
    const description = this.editServiceForm.controls.Description.value ?? "";
    const price = this.editServiceForm.controls.Price.value;
    const duration = this.editServiceForm.controls.Duration.value!;
    const category = this.editServiceForm.controls.Category.value;

    this.servicesService.UpdateService(this.serviceId, name, description, price, duration, category).then(success => {
      this.LeaveEditMode()
      if (success) 
        this.Edited.emit(this.serviceId);
    });
  }

  Delete() {
    App.PopUpMessageBox.YesCancel(MessageType.INFO, "Delete", `Delete service ${this.serviceName}?`).then(result => {
      if (result) {
        this.servicesService.DeleteService(this.serviceId).then(success => {
          if (success)
            this.Deleted.emit(this.serviceId);
        });

      }
    })
  }

  EnterEditMode() {
    this.isInEditMode = true;
    this.editServiceForm.controls.Name.setValue(this.serviceName);
    this.editServiceForm.controls.Description.setValue(this.serviceDescription);
    this.editServiceForm.controls.Duration.setValue(this.serviceDuration);
    this.editServiceForm.controls.Price.setValue(this.servicePrice);
    this.editServiceForm.controls.Category.setValue(this.serviceCategory);
  }

  LeaveEditMode() {
    this.isInEditMode = false;
  }
  
  GetDurationString() {
    const hours = Math.floor(this.serviceDuration / 60);
    const minutes = this.serviceDuration % 60;
    return (hours < 10 ? "0"+hours : hours) + ":" + (minutes < 10 ? "0"+minutes : minutes);
  }


}
