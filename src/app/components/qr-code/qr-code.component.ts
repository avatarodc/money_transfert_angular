import { Component, OnInit, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import { Wallet } from '../../models/wallet.model';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [CommonModule, QRCodeModule],
  templateUrl: './qr-code.component.html'
})
export class QrCodeComponent implements OnInit {
  @Input() userId: string = '';
  wallet: Wallet | null = null;
  qrData: string = '';
  showBalance: boolean = true;

  ngOnInit() {
    this.qrData = JSON.stringify({
      userId: this.userId,
      appUrl: window.location.origin,
      timestamp: new Date().getTime()
    });
  }

  @HostListener('window:resize')
  getQRCodeSize(): number {
    // Obtenir la largeur de la fenêtre
    const width = window.innerWidth;

    // Ajuster la taille en fonction de la largeur de l'écran
    if (width < 640) { // Mobile
      return 140;
    } else if (width < 768) { // Tablet
      return 160;
    } else { // Desktop
      return 180;
    }
  }

  toggleBalance() {
    this.showBalance = !this.showBalance;
  }
}
