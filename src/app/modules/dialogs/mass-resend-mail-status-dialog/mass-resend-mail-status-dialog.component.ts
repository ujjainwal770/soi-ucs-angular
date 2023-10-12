import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mass-resend-mail-status-dialog',
  templateUrl: './mass-resend-mail-status-dialog.component.html',
  styleUrls: ['./mass-resend-mail-status-dialog.component.scss']
})
export class MassResendMailStatusDialogComponent implements OnInit {
  data;
  displayedColumns: string[] = ['school_name'];
  pageSizeCount: number;
  dataSource = new MatTableDataSource([]);

  constructor(
    private readonly dialogRef: MatDialogRef<MassResendMailStatusDialogComponent>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data);
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.cancel();
  }

  cancel() {
    this.dialogRef.close();
  }
}
