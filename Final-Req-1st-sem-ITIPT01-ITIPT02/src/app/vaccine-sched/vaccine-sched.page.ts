import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonItem, IonSelect, IonSelectOption, IonInput, IonButton, IonIcon, IonList, IonLabel, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline } from 'ionicons/icons';

@Component({
  selector: 'app-vaccine-sched',
  templateUrl: './vaccine-sched.page.html',
  styleUrls: ['./vaccine-sched.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule,
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonBackButton, 
    IonItem, 
    IonSelect, 
    IonSelectOption, 
    IonInput, 
    IonButton, 
    IonIcon, 
    IonList,
    IonLabel,
    RouterLink
  ]
})
export class VaccineSchedPage implements OnInit {
  searchQuery: string = '';
  isSearching: boolean = false;
  isEditMode: boolean = false; 
  scheduleId: any = null;     

  // Mga variable para sa View-Only / Old Schedule mode
  isViewOnly: boolean = false;
  headerTitle: string = 'Vaccine Schedule';

  childrenList: any[] = [];
  filteredChildren: any[] = [];

  schedule = {
    childId: null as number | null,
    childName: '',
    vaccineName: '',
    schedDate: '', 
    schedTime: '', 
    contact: '',
    remarks: '',
    status: 'Scheduled'
  };

  get submitButtonText(): string {
    if (this.isViewOnly) return '';
    return this.isEditMode ? 'UPDATE SCHEDULE' : 'SET SCHEDULE & NOTIFY';
  }

  constructor(
    private router: Router, 
    private http: HttpClient, 
    private cdr: ChangeDetectorRef,
    private toastController: ToastController,
    private route: ActivatedRoute
  ) {
    addIcons({ 'calendar-outline': calendarOutline });
  }

  ngOnInit(): void {
    this.fetchChildrenFromDatabase();

    const navigation = this.router.getCurrentNavigation();
    const navState = navigation?.extras?.state || history.state;

    if (navState) {
      if (navState['isViewOnly']) {
        this.isViewOnly = true;
        this.headerTitle = 'Old Schedule'; // <--- Ginawang "Old Schedule" ang header
      }

      if (navState['scheduleData'] || navState['scheduleId']) {
        const data = navState['scheduleData'];
        this.scheduleId = data?.id || navState['scheduleId'];
        this.isEditMode = true;

        if (this.scheduleId) {
          // Hihilain nito ang buong kumpletong detalye mula sa database
          this.fetchScheduleDetails(this.scheduleId);
        }
      }
    }
  }

  fetchScheduleDetails(id: any): void {
    this.http.get<any>(`http://localhost:8000/api/vaccine-schedules/${id}`).subscribe({
      next: (res) => {
        if (res && res.success && res.data) {
          const d = res.data;
          
          let formattedTime = '';
          const rawTime = d.schedTime || d.sched_time || '';
          if (rawTime) {
            const timeStr = String(rawTime).trim();
            if (timeStr.includes(':')) {
              const parts = timeStr.split(':');
              formattedTime = `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
            }
          }

          this.schedule = {
            childId: d.childId || d.child_id || null,
            childName: d.childName || d.child_name || '',
            vaccineName: d.vaccineName || d.vaccine_name || '',
            schedDate: d.schedDate || d.sched_date || '',
            schedTime: formattedTime,
            contact: d.contact || '',
            remarks: d.remarks || '',
            status: d.status || 'Scheduled'
          };
          this.searchQuery = this.schedule.childName;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error fetching schedule details:', err);
      }
    });
  }

  fetchChildrenFromDatabase(): void {
    this.http.get<any>('http://localhost:8000/api/children').subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.childrenList = response.data;
        }
      },
      error: (err) => {
        console.error('Error fetching children:', err);
      }
    });
  }

  filterChildren(): void {
    if (this.isViewOnly) return;
    if (this.searchQuery.trim() === '') {
      this.filteredChildren = [];
      this.isSearching = false;
      return;
    }
    this.isSearching = true;
    this.filteredChildren = this.childrenList.filter(child =>
      String(child.name).toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectChild(child: any): void {
    if (this.isViewOnly) return;
    this.schedule.childId = child.id;
    this.schedule.childName = child.name;
    this.schedule.contact = child.contact || ''; 
    this.searchQuery = child.name; 
    this.isSearching = false; 
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

  saveVaccineSchedule(): void {
    if (this.isViewOnly) return; // Bawal mag-save kung view-only

    if (!this.schedule.vaccineName || !this.schedule.schedDate || !this.schedule.schedTime) {
      this.presentToast('Please fill in all required fields.', 'danger');
      return;
    }

    if (this.isEditMode) {
      this.http.put(`http://localhost:8000/api/vaccine-schedules/update/${this.scheduleId}`, this.schedule).subscribe({
        next: async (response: any) => {
          if (response && response.success === false) {
            await this.presentToast(response.message, 'warning');
            return;
          }
          await this.presentToast(`Vaccine schedule successfully updated for ${this.schedule.childName}!`);
          this.router.navigate(['/admin-home']);
        },
        error: async (err) => {
          console.error('Error updating schedule:', err);
          await this.presentToast('An error occurred while updating the database.', 'danger');
        }
      });
    } else {
      this.http.post('http://localhost:8000/api/vaccine-schedules', this.schedule).subscribe({
        next: async (response: any) => {
          // Dito natin sinasalo ang duplicate message galing sa backend
          if (response && response.success === false) {
            await this.presentToast(response.message, 'warning'); // Lalabas ang English toast notification
            return;
          }
          
          await this.presentToast(`Vaccine schedule successfully saved for ${this.schedule.childName}!`);
          this.resetForm(); // Magre-reset ang fields kapag successful
        },
        error: async (err) => {
          console.error('Error saving schedule:', err);
          await this.presentToast('An error occurred while saving to the database.', 'danger');
        }
      });
    }
  }

  resetForm(): void {
    if (this.isViewOnly) return;
    this.searchQuery = '';
    this.schedule = {
      childId: null,
      childName: '',
      vaccineName: '',
      schedDate: '', 
      schedTime: '', 
      contact: '',
      remarks: '',
      status: 'Scheduled'
    };
    this.filteredChildren = [];
    this.isSearching = false;
    this.cdr.detectChanges();
  }
}