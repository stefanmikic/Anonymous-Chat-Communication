export class CryptoService {
   async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    try {
      const keys: CryptoKeyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: { name: 'SHA-256' },
        },
        true,
        ['encrypt', 'decrypt']
      );

      const exportedPublicKey: ArrayBuffer = await window.crypto.subtle.exportKey(
        'spki', 
        keys.publicKey
      );

      const exportedPrivateKey: ArrayBuffer = await window.crypto.subtle.exportKey(
        'pkcs8', 
        keys.privateKey
      );

      const publicKeyString: string = this.arrayBufferToBase64(exportedPublicKey);
      const privateKeyString: string = this.arrayBufferToBase64(exportedPrivateKey);

      return { publicKey: publicKeyString, privateKey: privateKeyString };
    } catch (err) {
      console.error('Error generating key pair:', err);
      throw err;
    }
  }

  //buffer to string
  arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  //string to buffer
   base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
  
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
  
    return bytes.buffer as ArrayBuffer;
  }

  async encryptData(data: string, key: string): Promise<string> {
    const publicKeyBuffer = this.base64ToArrayBuffer(key);
      const publicKey = await window.crypto.subtle.importKey(
        'spki',
        publicKeyBuffer,
        {
          name: 'RSA-OAEP',
          hash: { name: 'SHA-256' },
        },
        true,
        ['encrypt']
      );
    try {
      const dataBuffer = new TextEncoder().encode(data);

      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP',
        },
        publicKey,
        dataBuffer
      );

      const returnData = this.arrayBufferToBase64(encryptedData);
      return returnData;
    } catch (err) {
      console.error('Error encrypting data:', err);
      throw err;
    }
  }

  async decryptData(encryptedData: string, key: string): Promise<string> {
    const privateKeyBuffer = this.base64ToArrayBuffer(key);

    const privateKey = await window.crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' },
      },
      true,
      ['decrypt']
    );
    try {
      const decryptedDataBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP',
        },
        privateKey,
        this.base64ToArrayBuffer(encryptedData)
      );

      const decryptedData = new TextDecoder().decode(decryptedDataBuffer);

      return decryptedData;
    } catch (err) {
      console.error('Error decrypting data:', err);
      throw err;
    }
  }
}