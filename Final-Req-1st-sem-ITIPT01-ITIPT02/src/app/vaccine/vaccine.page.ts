import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonSelect, IonSelectOption, IonList, IonLabel, IonIcon, IonBadge, IonButton, IonSearchbar,ToastController} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline, checkmarkCircle, timeOutline } from 'ionicons/icons';

interface VaccineRecord {
  vaccineName: string;
  dateGiven?: string;
  completed: boolean;
}

interface ChildProfile {
  id: number;
  name: number | string;
  age: number;
  purok: string;
  overallStatus: string;
  vaccines: VaccineRecord[];
}

@Component({
  selector: 'app-vaccine',
  templateUrl: './vaccine.page.html',
  styleUrls: ['./vaccine.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardSubtitle,  IonCardTitle, IonCardContent, IonItem, IonSelect,  IonSelectOption, IonList, IonLabel, IonIcon, IonBadge, IonButton, IonSearchbar ]})

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

  ngOnInit() {
    this.fetchChildrenFromDatabase();
  }

  fetchChildrenFromDatabase() {
    fetch('http://localhost:8000/api/children')
      .then(res => res.json())
      .then(response => {
        if (response.success && response.data) {
          this.childrenList = response.data.map((child: any) => ({
            id: child.id,
            name: child.name,
            age: child.age,
            purok: child.purok,
            overallStatus: child.overall_status && child.overall_status.trim() !== '' ? child.overall_status : 'Select',
            vaccines: this.standardVaccineNames.map(name => ({
              vaccineName: name,
              completed: false,
              dateGiven: undefined
            }))
          }));
          this.filteredChildren = [];
          this.cdr.detectChanges();
        }
      })
      .catch(err => console.error('Error fetching children from database:', err));
  }

  filterChildren() {
    const term = this.searchTerm.trim().toLowerCase();
    
    if (term) {
      this.currentChild = null;
    }

    if (!term) {
      this.filteredChildren = [...this.childrenList];
      return;
    }

    this.filteredChildren = this.childrenList.filter(child =>
      String(child.name).toLowerCase().includes(term) || String(child.purok).toLowerCase().includes(term)
    );
  }
  
  selectChild(child: ChildProfile) {
    child.vaccines.forEach(v => {
      v.completed = false;
      v.dateGiven = undefined;
    });

    this.currentChild = child;
    this.searchTerm = '';
    this.filteredChildren = [];
    
    fetch(`http://localhost:8000/api/vaccinations/${child.id}`)
      .then(res => res.json())
      .then(response => {
        if (response.success && response.data) {
          response.data.forEach((dbVac: any) => {
            const found = child.vaccines.find(v => v.vaccineName.trim().toLowerCase() === dbVac.vaccine_name.trim().toLowerCase());
            if (found) {
              found.completed = (dbVac.status === 'Given');
              found.dateGiven = dbVac.date_given || undefined;
            }
          });
          this.cdr.detectChanges();
        }
      })
      .catch(err => console.error('Error fetching child vaccinations:', err));
  }

  toggleVaccine(item: VaccineRecord) {
    if (!this.currentChild) return;

    item.completed = !item.completed;
    const currentDateTime = item.completed ? new Date().toISOString().slice(0, 19).replace('T', ' ') : '';
    item.dateGiven = item.completed ? currentDateTime : undefined;

    this.checkAutoStatus();
  }

  updateStatus() {
    if (this.currentChild) {
      console.log('Overall Status changed to:', this.currentChild.overallStatus);
    }
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color,
      mode: 'ios',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  saveOverallStatus() {
    if (!this.currentChild) return;

    const payload = {
      child_id: this.currentChild.id,
      overall_status: this.currentChild.overallStatus,
      vaccines: this.currentChild.vaccines.map(v => ({
        vaccine_name: v.vaccineName,
        status: v.completed ? 'Given' : 'Pending',
        date_given: v.dateGiven || null
      }))
    };

    fetch('http://localhost:8000/api/children/save-full-vaccination', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(async data => {
      console.log("Full record saved successfully:", data);
      await this.presentToast('Overall status and vaccination records successfully saved!');
    })
    .catch(async err => {
      console.error("Error saving full record:", err);
      await this.presentToast('Failed to save vaccination records.', 'danger');
    });
  }

  checkAutoStatus() {
    if (!this.currentChild) return;
    const allDone = this.currentChild.vaccines.every(v => v.completed);
    if (allDone) {
      this.currentChild.overallStatus = 'Fully Immunized';
    } else {
      const anyDone = this.currentChild.vaccines.some(v => v.completed);
      this.currentChild.overallStatus = anyDone ? 'Partially Immunized' : 'Unvaccinated';
    }
  }
}