import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonList, IonBadge, IonFooter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  settingsOutline, personCircleOutline, peopleOutline, alertCircleOutline, shieldCheckmarkOutline, chevronForwardOutline, personAddOutline, calendarOutline, medicalOutline, personOutline, notificationsOutline, searchOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.page.html',
  styleUrls: ['./admin-home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, IonHeader, RouterLink, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonList, IonBadge, IonFooter, RouterLink]
})
export class AdminHomePage implements OnInit {
  // Idinagdag ang mga ito para hindi mag-error ang binding galing sa HTML
  totalChildren: number = 0;
  feedingProgramCount: number = 0;
  fullyImmunizedCount: number = 0;

  constructor(
    private router: Router, 
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ 
      'settings-outline': settingsOutline,
      'person-circle-outline': personCircleOutline,
      'people-outline': peopleOutline,
      'alert-circle-outline': alertCircleOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'person-add-outline': personAddOutline,
      'schedule-outline': calendarOutline,
      'medical-outline': medicalOutline,
      'person-outline': personOutline,
      'notifications-outline': notificationsOutline,
      'search-outline': searchOutline
    });
  }

  ngOnInit(): void {}
}