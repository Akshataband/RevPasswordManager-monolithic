import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // ================= TOKEN STORAGE =================

  private TOKEN_KEY = 'rev_token';
  private TEMP_USER_KEY = 'rev_temp_user';

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  setTempUsername(username: string) {
    localStorage.setItem(this.TEMP_USER_KEY, username);
  }

  getTempUsername(): string | null {
    return localStorage.getItem(this.TEMP_USER_KEY);
  }

  clearTempUsername() {
    localStorage.removeItem(this.TEMP_USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ================= PROFILE =================

getProfile(): Observable<any> {
  return this.http.get(`${this.api}/auth/me`);
}

getCurrentUser(): Observable<any> {
  return this.getProfile();
}

updateProfile(data: any) {
  return this.http.put(`${this.api}/auth/update-profile`, data);
}

  // ================= USER INFO =================

  getUsernameFromToken(): string {

    const token = this.getToken();

    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch {
      return '';
    }
  }

  // ================= AUTH =================

  register(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/login`, data);
  }

  verify2FA(data: { username: string; otp: string }) {
    return this.http.post(
      `${this.api}/auth/verify-2fa`,
      data
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.api}/auth/logout`, {}).pipe(
      tap(() => {
        this.clearToken();
        this.clearTempUsername();
      })
    );
  }

  forgotPassword(data: any) {
    return this.http.post(
      `${this.api}/auth/forgot-password`,
      data,
      { responseType: 'text' }
    );
  }

  resetMasterPassword(data: any) {
    return this.http.put(`${this.api}/auth/reset-master-password`, data);
  }

  // ================= MASTER PASSWORD =================

  changeMasterPassword(data: {
    oldPassword: string;
    newPassword: string;
  }) {
    return this.http.put(
      `${this.api}/auth/change-master-password`,
      data,
      { responseType: 'text' }
    );
  }

  // ================= SECURITY QUESTIONS =================

  getSecurityQuestions(username: string) {
    return this.http.get<string[]>(
      `${this.api}/auth/security-questions/${username}`
    );
  }

  updateSecurityQuestions(data: any) {
    return this.http.put(
      `${this.api}/api/security-questions`,
      data,
      { responseType: 'text' }
    );
  }

  verifySecurityAnswer(data: any) {
    return this.http.post(`${this.api}/auth/verify-security-answer`, data);
  }

  getQuestions() {
    return this.http.get(`${this.api}/api/security-questions`);
  }

  // ================= 2FA =================

  get2FAStatus(): Observable<boolean> {
    return this.http.get<boolean>(`${this.api}/auth/2fa-status`);
  }

  enable2FA() {
    return this.http.post<string>(`${this.api}/auth/enable-2fa`, {});
  }

  confirm2FA(code: string) {
    return this.http.post(
      `${this.api}/auth/confirm-2fa?code=${code}`,
      {},
      { responseType: 'text' }
    );
  }

  disable2FA(code: string) {
    return this.http.post(
      `${this.api}/auth/disable-2fa?code=${code}`,
      {},
      { responseType: 'text' }
    );
  }

  // ================= DASHBOARD =================

  getDashboard() {
    return this.http.get(`${this.api}/dashboard`);
  }

  // ================= VAULT =================

  getVault() {
    return this.http.get(`${this.api}/api/vault`);
  }

  searchVault(params: any) {
    return this.http.get(`${this.api}/api/vault/search`, { params });
  }

  addPassword(data: any) {
    return this.http.post(`${this.api}/api/vault`, data);
  }

  updatePassword(id: number, data: any) {
    return this.http.put(
      `${this.api}/api/vault/${id}`,
      data,
      { responseType: 'text' }
    );
  }

  deletePassword(id: number) {
    return this.http.delete(`${this.api}/api/vault/${id}`);
  }

  addToFavorite(id: number) {
    return this.http.put(
      `${this.api}/api/vault/${id}/favorite`,
      {},
      { responseType: 'text' }
    );
  }

  removeFromFavorite(id: number) {
    return this.http.delete(
      `${this.api}/api/vault/${id}/favorite`,
      { responseType: 'text' }
    );
  }

  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/api/vault/favorites`);
  }

  viewPassword(id: number, masterPassword: string) {
    return this.http.post(
      `${this.api}/api/vault/${id}/view`,
      { masterPassword }
    );
  }

  securityAudit(masterPassword: string) {
    return this.http.post(
      `${this.api}/api/vault/audit`,
      { masterPassword }
    );
  }

  getSecurityAlerts(masterPassword: string) {
    return this.http.post(
      `${this.api}/api/security/alerts`,
      { masterPassword }
    );
  }

  // ================= GENERATOR =================

  generatePasswords(data: any) {
    return this.http.post(`${this.api}/api/generator`, data);
  }

  checkPasswordStrength(password: string) {
    return this.http.post(
      `${this.api}/api/generator/strength`,
      { password }
    );
  }

  saveGeneratedPassword(data: any) {
    return this.http.post(`${this.api}/api/vault/save-generated`, data);
  }

  // ================= BACKUP =================

  exportBackup(masterPassword: string): Observable<Blob> {
    return this.http.post(
      `${this.api}/api/backup/export`,
      { masterPassword },
      { responseType: 'blob' }
    );
  }

  importBackup(data: any) {
    return this.http.post(`${this.api}/api/backup/import`, data);
  }

}