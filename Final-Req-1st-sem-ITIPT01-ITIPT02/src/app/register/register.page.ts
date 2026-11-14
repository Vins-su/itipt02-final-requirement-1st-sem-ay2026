import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonIcon, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personAddOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [CommonModule, FormsModule, IonContent, IonInput, IonButton, IonIcon]
})
export class RegisterPage implements OnInit {
  registrationData = {
    fullName: '',
    username: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({
      'person-add-outline': personAddOutline,
      'checkmark-circle-outline': checkmarkCircleOutline
    });
  }

  ngOnInit(): void {
    const savedDarkMode = localStorage.getItem('nutribantay_dark_mode') === 'true';
    if (savedDarkMode) {
      document.body.classList.add('dark');
    }
  }

  async onRegister(): Promise<void> {
    // Validation check para sa magkatugmang password
    if (this.registrationData.password !== this.registrationData.confirmPassword) {
      const toast = await this.toastController.create({
        message: 'Passwords do not match. Please check and try again.',
        duration: 2500,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    // Success notification
    const toast = await this.toastController.create({
      message: 'Account created successfully!',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();

    // Navigate pabalik sa Login
    this.router.navigate(['/login']);
  }

  onCancel(): void {
    this.router.navigate(['/login']);
  }
}