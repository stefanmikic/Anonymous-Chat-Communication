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
        'raw', 
        keys.publicKey
      );

      const exportedPrivateKey: ArrayBuffer = await window.crypto.subtle.exportKey(
        'raw', 
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

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}