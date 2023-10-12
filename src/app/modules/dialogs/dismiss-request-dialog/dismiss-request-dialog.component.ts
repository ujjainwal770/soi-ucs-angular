import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dismiss-request-dialog',
  templateUrl: './dismiss-request-dialog.component.html',
  styleUrls: ['./dismiss-request-dialog.component.scss']
})
export class DismissRequestDialogComponent implements OnInit {
  pgtitle = '';
  dismissTypeOptions = [
    { value: 1, type: 'Unable to validate information' },
    { value: 2, type: 'Spam user' },
    { value: 3, type: 'Falsified information' },
    { value: 4, type: 'Other' }
  ];
  dismissForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data,
    public dialogRef: MatDialogRef<DismissRequestDialogComponent>
  ) {
    if (data) {
      this.pgtitle = data.pgtitle || this.pgtitle;
    }
  }

  ngOnInit(): void {
    // Mat dialog position change
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.position = { top: '80px' };
    this.dialogRef.updatePosition(matDialogConfig.position);

    this.dismissForm = new FormGroup({
      'dismissType': new FormControl('', [Validators.required]),
      'dismissDescription': new FormControl('', [Validators.required])
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  /**
   * @param name of the reactive form control
   * @returns detail of reactive form control
   */
  getFieldR(name: string) {
    return this.dismissForm.get(name);
  }

  submit() {
    if (this.dismissForm.valid) {
      const reason = this.dismissTypeOptions.find(item =>
        item.value === this.getFieldR('dismissType').value
      ).type;

      this.dialogRef.close({
        'dismissType': this.getFieldR('dismissType').value,
        'dismissReason': reason,
        'dismissDescription': this.getFieldR('dismissDescription').value
      });
    } else {
      this.dismissForm.markAllAsTouched();
    }
  }
}
