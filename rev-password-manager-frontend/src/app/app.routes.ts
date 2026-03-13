import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { VerifyOtp } from './features/auth/verify-otp/verify-otp';
import { Dashboard } from './features/dashboard/dashboard';
import { Layout } from './shared/layout/layout';
import { authGuard } from './core/guards/auth-guard';
import { Profile } from './features/auth/profile/profile';
import { ChangePassword } from './features/auth/change-password/change-password';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { VaultList } from './features/vault/vault-list/vault-list';
import { AddPassword } from './features/vault/add-password/add-password';
import { EditPassword } from './features/vault/edit-password/edit-password';
import { Favorites } from './features/vault/favorites/favorites';
import { Generator } from './features/vault/generator/generator';
import { Backup } from './features/vault/backup/backup';
import { TwoFactor } from './features/auth/two-factor/two-factor';
import { StrengthAnalysis } from './features/security/strength-analysis/strength-analysis';
import { SecurityAlerts } from './features/security/security-alerts/security-alerts';
import { SecurityAudit } from './features/security/security-audit/security-audit';
import { ViewSecurityQuestions } from './features/auth/security-questions/security-questions';

export const routes: Routes = [

  // Public
  { path: '', loadComponent: () => import('./features/landing/landing/landing').then(m => m.Landing) },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'verify-2fa', component: VerifyOtp },
  { path: 'forgot-password', component: ForgotPassword },

  // Protected
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [

      { path: 'dashboard', component: Dashboard },

      { path: 'profile', component: Profile },
      { path: 'change-password', component: ChangePassword },
      { path: 'two-factor', component: TwoFactor },

      { path: 'vault', component: VaultList },
      { path: 'add-password', component: AddPassword },
      { path: 'edit-password/:id', component: EditPassword },
      { path: 'favorites', component: Favorites },
      { path: 'generator', component: Generator },
      { path: 'backup', component: Backup },

      { path: 'security-questions', component: ViewSecurityQuestions },
      { path: 'strength-analysis', component: StrengthAnalysis },
      { path: 'security-alerts', component: SecurityAlerts },
      { path: 'security-audit', component: SecurityAudit }

    ]
  },

  { path: '**', redirectTo: '' }

];