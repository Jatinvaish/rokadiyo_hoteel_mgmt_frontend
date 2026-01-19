import CryptoJS from "crypto-js";

export class EncryptionUtil {
  private static getKey(): string {
    const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
    if (!key || key.length !== 64) {
      throw new Error("Invalid encryption key");
    }
    return key;
  }

  static encrypt(data: string): { __payload: string; __checksum: string; __ts: number } {
    const key = this.getKey();
    const iv = CryptoJS.lib.WordArray.random(16);
    
    const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Hex.parse(key), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const payload = iv.toString() + ":" + encrypted.ciphertext.toString();
    const checksum = CryptoJS.SHA256(payload + key).toString();

    return {
      __payload: payload,
      __checksum: checksum,
      __ts: Date.now(),
    };
  }

  static decrypt(encryptedData: { __payload: string; __checksum: string }): any {
    const key = this.getKey();
    const [ivHex, ciphertext] = encryptedData.__payload.split(":");
    
    const calculatedChecksum = CryptoJS.SHA256(encryptedData.__payload + key).toString();
    if (calculatedChecksum !== encryptedData.__checksum) {
      throw new Error("Checksum verification failed");
    }

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Hex.parse(ciphertext) } as any,
      CryptoJS.enc.Hex.parse(key),
      { iv: CryptoJS.enc.Hex.parse(ivHex), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }
}