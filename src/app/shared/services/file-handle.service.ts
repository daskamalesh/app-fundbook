import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class FileHandleService {
  constructor() { }

  /**
   * Save a file (PDF, Excel) to the device (Mobile & Web)
   */
  async saveFile(base64String: string, fileName: string) {
    if (this.isMobile()) {
      const hasPermission = await this.checkStoragePermission();
      if (!hasPermission) {
        console.error('Storage permission denied');
        return;
      }

      try {
        const byteArray = this.base64ToUint8Array(base64String);
        const blob = new Blob([byteArray], {
          type: fileName.endsWith('.pdf') ? 'application/pdf' :
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const base64Data = await this.blobToBase64(blob);

        await Filesystem.writeFile({
          path: `${fileName}`,
          data: base64Data,
          directory: Directory.ExternalStorage, 
        });

        console.log('File saved successfully:', fileName);
      } catch (error) {
        console.error('Error saving file:', error);
      }
    } else {
      const byteArray = this.base64ToUint8Array(base64String);
      const blob = new Blob([byteArray], {
        type: fileName.endsWith('.pdf') ? 'application/pdf' :
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      this.downloadFile(blob, fileName);
    }
  }

  /**
   * Save a ZIP file to the device (Mobile & Web)
   */
  async saveZipFile(base64String: string, fileName: string) {
    if (this.isMobile()) {
      const hasPermission = await this.checkStoragePermission();
      if (!hasPermission) {
        console.error('Storage permission denied');
        return;
      }

      try {
        const byteArray = this.base64ToUint8Array(base64String);
        const blob = new Blob([byteArray], { type: 'application/zip' });

        const base64Data = await this.blobToBase64(blob);

        await Filesystem.writeFile({
          path: `${fileName}`,
          data: base64Data,
          directory: Directory.ExternalStorage, 
        });

        console.log('ZIP file saved successfully:', fileName);
      } catch (error) {
        console.error('Error saving ZIP file:', error);
      }
    } else {
      const byteArray = this.base64ToUint8Array(base64String);
      const blob = new Blob([byteArray], { type: 'application/zip' });

      this.downloadFile(blob, fileName);
    }
  }

  /**
   * ✅ FIX: Ensure downloads work properly on all browsers
   */
  private downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  /**
   * ✅ Ensure permissions are requested properly on mobile
   */
  private async checkStoragePermission(): Promise<boolean> {
    try {
      const permStatus = await Filesystem.checkPermissions();
      if (permStatus.publicStorage !== 'granted') {
        const granted = await Filesystem.requestPermissions();
        return granted.publicStorage === 'granted';
      }
      return true;
    } catch (error) {
      console.error('Error requesting storage permission:', error);
      return false;
    }
  }

  /**
   * Convert Base64 string to Uint8Array
   */
  private base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Convert Blob to Base64
   */
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1]; 
        resolve(base64Data);
      };
      reader.onerror = reject;
    });
  }

  /**
   * Detect if the app is running on a mobile device
   */
  private isMobile(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|iphone|ipad|ipod/.test(userAgent);
  }
}
