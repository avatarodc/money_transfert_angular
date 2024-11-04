import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import { Wallet } from '../../models/wallet.model';
import { WalletService } from '../../services/wallet.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [CommonModule, QRCodeModule],
  templateUrl: './qr-code.component.html'
})
export class QrCodeComponent implements OnInit {
  wallet: Wallet | null = null;
  showBalance: boolean = true;
  isMobile = window.innerWidth < 640;
  isLoading = true;

  constructor(
    private walletService: WalletService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadWallet(); // Charge le wallet uniquement au démarrage
  }

  private loadWallet() {
    this.isLoading = true;
    this.walletService.getCurrentUserWallet().subscribe({
      next: (response) => {
        console.log('Response complète:', response);
        this.wallet = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du wallet:', err);
        this.isLoading = false;
      }
    });
  }

  getQRCodeImage(): SafeUrl {
    if (!this.wallet?.qrCode) {
      console.log('QR Code missing from wallet:', this.wallet);
      return '';
    }

    const qrCode = this.wallet.qrCode;

    try {
      // Retourne l'image QR code sans ajout de timestamp
      const base64Image = `data:image/png;base64,${qrCode}`;
      return this.sanitizer.bypassSecurityTrustUrl(base64Image);
    } catch (e) {
      console.error('Error processing QR code:', e);
      return '';
    }
  }

  formatBalance(value: string | number | undefined | null): string {
    if (value === undefined || value === null) {
      return '0';
    }

    try {
      const numericValue = typeof value === 'string' ? parseFloat(value) : value;
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(numericValue);
    } catch (e) {
      console.error('Error formatting balance:', e, typeof value, value);
      return '0';
    }
  }

  @HostListener('window:resize')
  handleResize() {
    this.isMobile = window.innerWidth < 640;
  }

  getQRCodeSize(): number {
    return this.isMobile ? 150 : 200;
  }

  toggleBalance() {
    this.showBalance = !this.showBalance;
  }
}
