import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-event-dialog',
  templateUrl: './cancel-event-dialog.component.html',
  styleUrls: ['./cancel-event-dialog.component.scss']
})
export class CancelEventDialogComponent {

  pgtitle = '';
  message = '';
  dialogType = '';
  icon = '';
  categoryId: any;
  constructor(@Inject(MAT_DIALOG_DATA) private readonly data,
    public dialogRef: MatDialogRef<CancelEventDialogComponent>) {
    if (data) {
      this.pgtitle = data.pgtitle || this.pgtitle;
      this.message = data.message || this.message;
      this.icon = data.icon || this.icon;
      this.dialogType = data.dialogType || this.dialogType;
      this.categoryId = data.categoryID;
    }
  }
  save() {
    this.dialogRef.close({ data: 'data' });
  }
  cancel() {
    this.dialogRef.close();
  }

}
