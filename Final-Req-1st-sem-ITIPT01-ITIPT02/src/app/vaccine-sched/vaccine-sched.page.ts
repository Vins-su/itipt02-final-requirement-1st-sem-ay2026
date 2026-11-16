import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonItem, IonSelect, IonSelectOption, IonInput, IonButton, IonIcon, IonList, IonLabel, ToastController } from '@ionic/angular';


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
 
}