import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heartCircleOutline, logInOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonInput, IonButton, RouterLink, IonIcon]
})
export class LoginPage {
  credentials = { username: '', password: '' };

  constructor(private router: Router) {
    addIcons({ 'heart-circle-outline': heartCircleOutline, 'log-in-outline': logInOutline });
  }
}