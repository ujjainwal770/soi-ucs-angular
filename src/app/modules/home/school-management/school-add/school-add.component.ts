import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SchoolService } from '../../../../core/services/school.service';

@Component({
  selector: 'app-school-add',
  templateUrl: './school-add.component.html',
  styleUrls: ['./school-add.component.scss']
})
export class SchoolAddComponent implements OnDestroy  {
  subscription: Subscription;
  public demo1TabIndex = 0;
  displayTab = false;
  selectedType: any = 'School';

  constructor(private readonly _schoolService: SchoolService,
    private readonly _router: Router) {
    this.subscription = this._schoolService.getMessage().subscribe(message => {
      this.demo1TabIndex = message['text']['tabchange'];
      this.displayTab = message['text']['tabDisplay'];
    });
  }

  ngOnDestroy() {
    if(this.subscription)
    {
      this.subscription.unsubscribe();
    }
  }
  backclicked() {
    this._router.navigate(['/school-management']);
  }
  selectType(type: string): void {
    this.selectedType = type;
    // Perform any other actions based on the selected type
  }

}
