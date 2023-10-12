/**
 * Title: Bulk Upload Validations Component
 * Description: This file defines a component responsible for displaying and handling bulk upload validations
 */
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bulk-upload-validations',
  templateUrl: './bulk-upload-validations.component.html',
  styleUrls: ['./bulk-upload-validations.component.scss']
})
export class BulkUploadValidationsComponent {
  pgtitle = '';
  reviewParm:any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
  constructor(
    public dialogRef: MatDialogRef<BulkUploadValidationsComponent>,
  ) { }

    /** close the dialog. */
  cancel() {
    this.dialogRef.close({ data: 'data' });
  }

}
