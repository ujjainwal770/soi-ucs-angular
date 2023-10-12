import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  pgtitle = '';
  message = '';
  dialogType = '';
  categoryId: any;
  constructor(@Inject(MAT_DIALOG_DATA) private readonly data,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>) {
    if (data) {
      this.pgtitle = data.pgtitle || this.pgtitle;
      this.message = data.message || this.message;
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
