import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, folderOpenOutline, calendarClearOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.page.html',
  styleUrls: ['./archive.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButtons, 
    IonButton, 
    IonIcon
  ]
})
export class ArchivePage implements OnInit {

  constructor(private router: Router) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'folder-open-outline': folderOpenOutline,
      'calendar-clear-outline': calendarClearOutline,
      'chevron-forward-outline': chevronForwardOutline
    });
  }

  ngOnInit() {}

  openChildrenRecordArchive() {
    this.router.navigate(['/archive-records']);
  }

  openOldScheduleArchive(): void {
    this.router.navigate(['/archive-schedule']);
  }

  goBack(): void {
    this.router.navigate(['/settings']);
  }
}
