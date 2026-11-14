import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonSelect, IonSelectOption, IonList, IonLabel, IonIcon, IonBadge, IonButton, IonSearchbar,ToastController} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline, checkmarkCircle, timeOutline } from 'ionicons/icons';

interface VaccineRecord {vaccineName: string;dateGiven?: string;completed: boolean;}

interface ChildProfile { id: number; name: number | string; age: number; purok: string; overallStatus: string; vaccines: VaccineRecord[];}

@Component({
  selector: 'app-vaccine',
  templateUrl: './vaccine.page.html',
  styleUrls: ['./vaccine.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonSelect, IonSelectOption, IonList, IonLabel, IonIcon, IonBadge, IonButton, IonSearchbar]
})
export class VaccinePage implements OnInit {
  
  standardVaccineNames: string[] = [
    'BCG Vaccine',
    'Hepatitis B (Dose 1)',
    'Pentavalent Vaccine (Dose 1)',
    'Oral Polio Vaccine (OPV 1)',
    'Measles, Mumps, Rubella (MMR Dose 1)',
    'Oral Polio Vaccine (Booster)'
  ];

  childrenList: ChildProfile[] = [];
  searchTerm: string = '';
  filteredChildren: ChildProfile[] = [];
  currentChild: ChildProfile | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private toastController: ToastController
  ) {
    addIcons({
      'person-outline': personOutline,
      'checkmark-circle': checkmarkCircle,
      'time-outline': timeOutline
    });
  }

}
  