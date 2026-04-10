# 第六章：Forms — 表單處理

> **目標讀者**：具備 .NET/C# 後端開發經驗，正在學習 Angular 19+ 的工程師。
> **Angular 版本**：19+（Standalone、Signals、OnPush、Typed Forms）
> **先備知識**：第一至五章（元件、Signals、DI、路由、HttpClient）
> **最後更新**：2026-04-09

---

## 本章目標

完成本章後，你將能夠：

1. 使用 Reactive Forms 建構複雜表單
2. 使用 Template-driven Forms 處理簡單場景
3. 根據需求選擇適當的表單策略
4. 撰寫同步與非同步自訂驗證器
5. 建構巢狀 FormGroup 與動態 FormArray
6. 理解並善用表單狀態管理
7. 使用 Typed Forms 取得完整型別安全
8. 實作多步驟註冊表單

---

## .NET 對照速查表

| .NET 概念 | Angular 19+ 對應 |
|---|---|
| `[BindProperty]` Model Binding | `FormControl` / `ngModel` |
| `DataAnnotations`（`[Required]`, `[StringLength]`） | `Validators.required`, `Validators.minLength()` |
| `FluentValidation` | Custom Validators（函式） |
| `IValidatableObject` | Cross-field validators（FormGroup 層級） |
| `ModelState.IsValid` | `FormGroup.valid` |
| `ModelState.Errors` | `FormControl.errors` |
| `ASP.NET Core Remote Validation` | Async Validators |
| `Blazor EditForm` | `<form [formGroup]="...">` |
| `FieldIdentifier` + `ValidationMessage` | `FormControl.errors` + 模板顯示 |

---

## 6.1 Reactive Forms

### 6.1.1 模組設定

```typescript
// Reactive Forms need ReactiveFormsModule imported in the component
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  // ...
  imports: [ReactiveFormsModule],
})
export class MyFormComponent { }
```

### 6.1.2 核心概念

| 類別 | 用途 | .NET 類比 |
|---|---|---|
| `FormControl<T>` | 單一表單欄位 | 單一 `[BindProperty]` 屬性 |
| `FormGroup<T>` | 一組表單欄位 | ViewModel class |
| `FormArray<T>` | 可重複的表單欄位陣列 | `List<T>` 屬性 |
| `FormRecord<T>` | 動態鍵值對 | `Dictionary<string, T>` |
| `FormBuilder` | 建構表單的輔助工具 | 無直接對應 |

### 6.1.3 基本建構

```typescript
// src/app/features/auth/login-form.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Define the typed form interface
interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>;
}

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="field">
        <label for="email">電子信箱</label>
        <input id="email" type="email" formControlName="email" />
        @if (form.controls.email.hasError('required') && form.controls.email.touched) {
          <span class="error">信箱為必填。</span>
        }
        @if (form.controls.email.hasError('email') && form.controls.email.touched) {
          <span class="error">信箱格式不正確。</span>
        }
      </div>

      <div class="field">
        <label for="password">密碼</label>
        <input id="password" type="password" formControlName="password" />
        @if (form.controls.password.hasError('required') && form.controls.password.touched) {
          <span class="error">密碼為必填。</span>
        }
        @if (form.controls.password.hasError('minlength') && form.controls.password.touched) {
          <span class="error">
            密碼至少需要 {{ form.controls.password.getError('minlength').requiredLength }} 個字元。
          </span>
        }
      </div>

      <div class="field">
        <label>
          <input type="checkbox" formControlName="rememberMe" />
          記住我
        </label>
      </div>

      <button type="submit" [disabled]="form.invalid">登入</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginForm {
  private readonly fb = inject(FormBuilder);

  // Method 1: Using FormBuilder (recommended)
  protected readonly form: FormGroup<LoginForm> = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false],
  });

  // Method 2: Manual construction (equivalent)
  // protected readonly form = new FormGroup<LoginForm>({
  //   email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  //   password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
  //   rememberMe: new FormControl(false, { nonNullable: true }),
  // });

  protected onSubmit(): void {
    if (this.form.valid) {
      // form.getRawValue() returns a typed object: { email: string; password: string; rememberMe: boolean }
      const value = this.form.getRawValue();
      console.log('Login:', value);
    } else {
      // Mark all fields as touched to trigger validation display
      this.form.markAllAsTouched();
    }
  }
}
```

### 6.1.4 FormBuilder vs 手動建構

```typescript
// --- FormBuilder (concise, recommended for most cases) ---
const fb = inject(FormBuilder);

// fb.nonNullable ensures controls have nonNullable: true by default
const form = fb.nonNullable.group({
  name: ['', Validators.required],                           // FormControl<string>
  age: [0, [Validators.required, Validators.min(0)]],        // FormControl<number>
  active: [true],                                            // FormControl<boolean>
});

// --- Manual construction (explicit, useful for advanced configuration) ---
const form2 = new FormGroup({
  name: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
    updateOn: 'blur',  // Only validate on blur
  }),
  age: new FormControl(0, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(0)],
  }),
  active: new FormControl(true, { nonNullable: true }),
});
```

> **nonNullable 重要性**：當呼叫 `form.reset()` 時，`nonNullable` 控制項會重置為初始值而非 `null`。這避免了型別不安全的問題。

---

## 6.2 Template-driven Forms

### 6.2.1 模組設定

```typescript
import { FormsModule } from '@angular/forms';

@Component({
  // ...
  imports: [FormsModule],
})
export class SimpleForm { }
```

### 6.2.2 基本用法

```typescript
// src/app/features/feedback/feedback-form.ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

interface FeedbackModel {
  name: string;
  email: string;
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-feedback-form',
  imports: [FormsModule],
  template: `
    <form #feedbackForm="ngForm" (ngSubmit)="onSubmit(feedbackForm)">
      <div class="field">
        <label for="name">姓名</label>
        <input
          id="name"
          name="name"
          [(ngModel)]="model.name"
          required
          minlength="2"
          #nameCtrl="ngModel"
        />
        @if (nameCtrl.invalid && nameCtrl.touched) {
          @if (nameCtrl.hasError('required')) {
            <span class="error">姓名為必填。</span>
          }
          @if (nameCtrl.hasError('minlength')) {
            <span class="error">姓名至少需要 2 個字元。</span>
          }
        }
      </div>

      <div class="field">
        <label for="email">電子信箱</label>
        <input
          id="email"
          name="email"
          type="email"
          [(ngModel)]="model.email"
          required
          email
          #emailCtrl="ngModel"
        />
        @if (emailCtrl.invalid && emailCtrl.touched) {
          <span class="error">請輸入有效的電子信箱。</span>
        }
      </div>

      <div class="field">
        <label for="rating">評分</label>
        <select id="rating" name="rating" [(ngModel)]="model.rating" required>
          @for (star of [1, 2, 3, 4, 5]; track star) {
            <option [value]="star">{{ star }} 顆星</option>
          }
        </select>
      </div>

      <div class="field">
        <label for="comment">意見</label>
        <textarea
          id="comment"
          name="comment"
          [(ngModel)]="model.comment"
          rows="4"
        ></textarea>
      </div>

      <button type="submit" [disabled]="feedbackForm.invalid">
        送出回饋
      </button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackForm {
  protected readonly model: FeedbackModel = {
    name: '',
    email: '',
    rating: 5,
    comment: '',
  };

  protected readonly submitted = signal(false);

  protected onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Feedback:', this.model);
      this.submitted.set(true);
      form.resetForm();
    }
  }
}
```

### 6.2.3 Template-driven 的 ngModel 繫結

```typescript
// One-way binding (model → view only)
<input [ngModel]="name" name="name" />

// Two-way binding (model ↔ view)
<input [(ngModel)]="name" name="name" />

// Two-way with change handler
<input [(ngModel)]="name" (ngModelChange)="onNameChange($event)" name="name" />
```

---

## 6.3 選擇指南

### 6.3.1 決策表

| 面向 | Reactive Forms | Template-driven Forms |
|---|---|---|
| **模型定義位置** | TypeScript class（明確、可測試） | HTML template（隱式） |
| **型別安全** | 完整 `FormGroup<T>` 泛型支援 | 無（`any` 型別） |
| **驗證器** | 程式化定義，可組合 | 模板 attribute + directive |
| **動態欄位** | `FormArray` / `FormRecord` | 困難 |
| **單元測試** | 容易（不需要 DOM） | 困難（需要 DOM） |
| **學習曲線** | 稍高 | 較低 |
| **適用場景** | 複雜表單、多步驟、動態欄位 | 簡單表單、快速原型 |
| **.NET 類比** | FluentValidation + ViewModel | DataAnnotations + [BindProperty] |

### 6.3.2 選擇原則

```
你的表單需要...
├── 動態欄位（增減）？       → Reactive Forms
├── 跨欄位驗證？             → Reactive Forms
├── 非同步驗證？             → Reactive Forms
├── 多步驟流程？             → Reactive Forms
├── 嚴格型別檢查？           → Reactive Forms
├── 單元測試覆蓋？           → Reactive Forms
├── 只有 2-3 個欄位？        → Template-driven Forms
└── 快速原型驗證？           → Template-driven Forms
```

> **實務建議**：在企業專案中，建議一律使用 Reactive Forms。Template-driven 僅用於非常簡單的場景（如搜尋框、簡易篩選器）。

---

## 6.4 驗證器

### 6.4.1 內建驗證器

```typescript
import { Validators } from '@angular/forms';

const form = this.fb.nonNullable.group({
  // Required field
  name: ['', Validators.required],

  // Minimum length
  username: ['', [Validators.required, Validators.minLength(3)]],

  // Maximum length
  bio: ['', Validators.maxLength(500)],

  // Pattern (regex)
  phone: ['', Validators.pattern(/^09\d{8}$/)],      // Taiwan mobile format

  // Email
  email: ['', [Validators.required, Validators.email]],

  // Numeric range
  age: [0, [Validators.required, Validators.min(18), Validators.max(120)]],

  // Required true (for checkboxes)
  agreeTerms: [false, Validators.requiredTrue],
});
```

### 6.4.2 內建驗證器對照 .NET DataAnnotations

| .NET DataAnnotation | Angular Validator | 錯誤鍵 |
|---|---|---|
| `[Required]` | `Validators.required` | `'required'` |
| `[StringLength(max)]` | `Validators.maxLength(max)` | `'maxlength'` |
| `[MinLength(min)]` | `Validators.minLength(min)` | `'minlength'` |
| `[Range(min, max)]` | `Validators.min(min)` + `Validators.max(max)` | `'min'` / `'max'` |
| `[RegularExpression]` | `Validators.pattern(regex)` | `'pattern'` |
| `[EmailAddress]` | `Validators.email` | `'email'` |

### 6.4.3 自訂同步驗證器

```typescript
// src/app/shared/validators/custom-validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// --- Validator function factory (recommended pattern) ---

/** Validates that a value matches the given regex and returns a custom error key. */
export function matchPattern(pattern: RegExp, errorKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // Let 'required' handle empty values
    return pattern.test(control.value) ? null : { [errorKey]: true };
  };
}

/** Validates Taiwan national ID format. */
export function taiwanIdValidator(): ValidatorFn {
  return matchPattern(/^[A-Z][12]\d{8}$/, 'invalidTaiwanId');
}

/** Validates that password meets complexity requirements. */
export function passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;
    if (!value) return null;

    const errors: ValidationErrors = {};

    if (!/[A-Z]/.test(value)) errors['missingUppercase'] = true;
    if (!/[a-z]/.test(value)) errors['missingLowercase'] = true;
    if (!/\d/.test(value)) errors['missingDigit'] = true;
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) errors['missingSpecial'] = true;
    if (value.length < 8) errors['tooShort'] = true;

    return Object.keys(errors).length > 0 ? errors : null;
  };
}

/** Cross-field validator: password confirmation must match password. */
export function passwordMatch(passwordField: string, confirmField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordField)?.value;
    const confirm = group.get(confirmField)?.value;

    if (!password || !confirm) return null;

    return password === confirm ? null : { passwordMismatch: true };
  };
}

/** Cross-field validator: end date must be after start date. */
export function dateRange(startField: string, endField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get(startField)?.value;
    const end = group.get(endField)?.value;

    if (!start || !end) return null;

    const startDate = new Date(start);
    const endDate = new Date(end);

    return endDate > startDate ? null : { invalidDateRange: true };
  };
}
```

### 6.4.4 使用自訂驗證器

```typescript
import { passwordStrength, passwordMatch } from '../../shared/validators/custom-validators';

// Field-level validators
const form = this.fb.nonNullable.group(
  {
    password: ['', [Validators.required, passwordStrength()]],
    confirmPassword: ['', Validators.required],
  },
  {
    // Group-level (cross-field) validator
    validators: [passwordMatch('password', 'confirmPassword')],
  },
);
```

### 6.4.5 自訂非同步驗證器

```typescript
// src/app/shared/validators/async-validators.ts
import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, timer, switchMap, map, catchError } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Checks if a username is already taken.
 * Debounces by 500ms to avoid excessive API calls.
 *
 * .NET analogy: ASP.NET Core Remote Validation via [Remote] attribute
 */
export function uniqueUsername(http: HttpClient): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.length < 3) {
      return of(null);
    }

    return timer(500).pipe( // Debounce 500ms
      switchMap(() =>
        http.get<{ available: boolean }>(`/api/users/check-username?name=${control.value}`),
      ),
      map(response => response.available ? null : { usernameTaken: true }),
      catchError(() => of(null)), // On API error, allow the value
    );
  };
}

/**
 * Checks if an email is already registered.
 */
export function uniqueEmail(http: HttpClient): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return timer(500).pipe(
      switchMap(() =>
        http.get<{ available: boolean }>(`/api/users/check-email?email=${control.value}`),
      ),
      map(response => response.available ? null : { emailTaken: true }),
      catchError(() => of(null)),
    );
  };
}
```

### 6.4.6 使用非同步驗證器

```typescript
import { HttpClient } from '@angular/common/http';
import { uniqueUsername, uniqueEmail } from '../../shared/validators/async-validators';

export class RegisterForm {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  protected readonly form = this.fb.nonNullable.group({
    username: [
      '',
      {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [uniqueUsername(this.http)],
        updateOn: 'blur' as const, // Only run async validation on blur
      },
    ],
    email: [
      '',
      {
        validators: [Validators.required, Validators.email],
        asyncValidators: [uniqueEmail(this.http)],
        updateOn: 'blur' as const,
      },
    ],
  });
}
```

---

## 6.5 FormGroup 巢狀

### 6.5.1 巢狀 FormGroup

```typescript
// src/app/features/profile/profile-form.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

interface AddressForm {
  street: FormControl<string>;
  city: FormControl<string>;
  state: FormControl<string>;
  zipCode: FormControl<string>;
  country: FormControl<string>;
}

interface ProfileForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  homeAddress: FormGroup<AddressForm>;
  workAddress: FormGroup<AddressForm>;
}

@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <fieldset>
        <legend>基本資料</legend>
        <div class="field">
          <label for="firstName">名</label>
          <input id="firstName" formControlName="firstName" />
        </div>
        <div class="field">
          <label for="lastName">姓</label>
          <input id="lastName" formControlName="lastName" />
        </div>
        <div class="field">
          <label for="email">電子信箱</label>
          <input id="email" type="email" formControlName="email" />
        </div>
      </fieldset>

      <!-- Nested FormGroup: Home Address -->
      <fieldset formGroupName="homeAddress">
        <legend>住家地址</legend>
        <div class="field">
          <label for="homeStreet">街道</label>
          <input id="homeStreet" formControlName="street" />
        </div>
        <div class="field">
          <label for="homeCity">城市</label>
          <input id="homeCity" formControlName="city" />
        </div>
        <div class="field">
          <label for="homeState">縣市</label>
          <input id="homeState" formControlName="state" />
        </div>
        <div class="field">
          <label for="homeZip">郵遞區號</label>
          <input id="homeZip" formControlName="zipCode" />
        </div>
      </fieldset>

      <!-- Nested FormGroup: Work Address -->
      <fieldset formGroupName="workAddress">
        <legend>工作地址</legend>
        <div class="field">
          <label for="workStreet">街道</label>
          <input id="workStreet" formControlName="street" />
        </div>
        <div class="field">
          <label for="workCity">城市</label>
          <input id="workCity" formControlName="city" />
        </div>
        <div class="field">
          <label for="workState">縣市</label>
          <input id="workState" formControlName="state" />
        </div>
        <div class="field">
          <label for="workZip">郵遞區號</label>
          <input id="workZip" formControlName="zipCode" />
        </div>
      </fieldset>

      <button type="submit" [disabled]="form.invalid">儲存</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileForm {
  private readonly fb = inject(FormBuilder);

  protected readonly form: FormGroup<ProfileForm> = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    homeAddress: this.createAddressGroup(),
    workAddress: this.createAddressGroup(),
  });

  private createAddressGroup(): FormGroup<AddressForm> {
    return this.fb.nonNullable.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{3,5}$/)]],
      country: ['TW'],
    });
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      // Fully typed: { firstName: string; lastName: string; email: string; homeAddress: {...}; workAddress: {...} }
      const profile = this.form.getRawValue();
      console.log('Profile:', profile);
    }
  }
}
```

### 6.5.2 動態表單 — FormRecord

`FormRecord` 適用於鍵不確定的動態表單（如動態權限設定）：

```typescript
import { FormRecord, FormControl, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';

interface PermissionForm {
  roleName: FormControl<string>;
  permissions: FormRecord<FormControl<boolean>>;
}

@Component({
  selector: 'app-permission-editor',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="field">
        <label for="roleName">角色名稱</label>
        <input id="roleName" formControlName="roleName" />
      </div>

      <fieldset formGroupName="permissions">
        <legend>權限設定</legend>
        @for (perm of permissionKeys(); track perm) {
          <label>
            <input type="checkbox" [formControlName]="perm" />
            {{ perm }}
          </label>
        }
      </fieldset>

      <button type="button" (click)="addPermission()">新增權限</button>
      <button type="submit" [disabled]="form.invalid">儲存</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionEditor {
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    roleName: this.fb.nonNullable.control('', Validators.required),
    permissions: new FormRecord<FormControl<boolean>>({}),
  });

  protected permissionKeys(): string[] {
    return Object.keys(this.form.controls.permissions.controls);
  }

  protected addPermission(): void {
    const name = prompt('輸入權限名稱：');
    if (name) {
      this.form.controls.permissions.addControl(
        name,
        new FormControl(false, { nonNullable: true }),
      );
    }
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      console.log('Role:', value.roleName);
      console.log('Permissions:', value.permissions);
    }
  }
}
```

---

## 6.6 FormArray

### 6.6.1 基本用法 — 可重複欄位

```typescript
// src/app/features/orders/order-form.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

interface OrderItemForm {
  productName: FormControl<string>;
  quantity: FormControl<number>;
  unitPrice: FormControl<number>;
}

interface OrderForm {
  customerName: FormControl<string>;
  items: FormArray<FormGroup<OrderItemForm>>;
  notes: FormControl<string>;
}

@Component({
  selector: 'app-order-form',
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="field">
        <label for="customerName">客戶名稱</label>
        <input id="customerName" formControlName="customerName" />
      </div>

      <!-- FormArray: Order Items -->
      <div formArrayName="items">
        <h3>訂單項目</h3>

        @for (item of itemControls.controls; track $index; let i = $index) {
          <div class="item-row" [formGroupName]="i">
            <input formControlName="productName" placeholder="產品名稱" />
            <input formControlName="quantity" type="number" min="1" placeholder="數量" />
            <input formControlName="unitPrice" type="number" min="0" step="0.01" placeholder="單價" />

            <span class="subtotal">
              小計：{{ getSubtotal(i) | currency:'TWD' }}
            </span>

            <button type="button" (click)="removeItem(i)"
                    [disabled]="itemControls.length <= 1"
                    aria-label="移除此項目">
              移除
            </button>
          </div>
        }
      </div>

      <button type="button" (click)="addItem()">新增項目</button>

      <div class="total">
        <strong>總計：{{ getTotal() | currency:'TWD' }}</strong>
      </div>

      <div class="field">
        <label for="notes">備註</label>
        <textarea id="notes" formControlName="notes" rows="3"></textarea>
      </div>

      <button type="submit" [disabled]="form.invalid">送出訂單</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderForm {
  private readonly fb = inject(FormBuilder);

  protected readonly form: FormGroup<OrderForm> = this.fb.nonNullable.group({
    customerName: ['', Validators.required],
    items: this.fb.array<FormGroup<OrderItemForm>>(
      [this.createItemGroup()],
      { validators: [Validators.minLength(1)] },
    ),
    notes: [''],
  });

  protected get itemControls(): FormArray<FormGroup<OrderItemForm>> {
    return this.form.controls.items;
  }

  protected addItem(): void {
    this.itemControls.push(this.createItemGroup());
  }

  protected removeItem(index: number): void {
    if (this.itemControls.length > 1) {
      this.itemControls.removeAt(index);
    }
  }

  protected getSubtotal(index: number): number {
    const item = this.itemControls.at(index);
    return item.controls.quantity.value * item.controls.unitPrice.value;
  }

  protected getTotal(): number {
    return this.itemControls.controls.reduce(
      (sum, _, i) => sum + this.getSubtotal(i),
      0,
    );
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const order = this.form.getRawValue();
      console.log('Order:', order);
    }
  }

  private createItemGroup(): FormGroup<OrderItemForm> {
    return this.fb.nonNullable.group({
      productName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
    });
  }
}
```

### 6.6.2 FormArray 操作方法

```typescript
// FormArray has these essential methods:
const items: FormArray = form.controls.items;

items.push(newControl);          // Add at end
items.insert(index, newControl); // Add at index
items.removeAt(index);           // Remove at index
items.clear();                   // Remove all
items.at(index);                 // Get control at index
items.length;                    // Current count
items.controls;                  // Access underlying array

// Move items (no built-in method — manual swap)
function moveItem(array: FormArray, from: number, to: number): void {
  const control = array.at(from);
  array.removeAt(from);
  array.insert(to, control);
}
```

---

## 6.7 表單狀態

### 6.7.1 狀態屬性總覽

| 屬性 | 型別 | 說明 | .NET 類比 |
|---|---|---|---|
| `valid` | `boolean` | 所有驗證通過 | `ModelState.IsValid` |
| `invalid` | `boolean` | 有至少一個驗證失敗 | `!ModelState.IsValid` |
| `pending` | `boolean` | 非同步驗證進行中 | 無直接對應 |
| `pristine` | `boolean` | 使用者未修改過 | 無直接對應 |
| `dirty` | `boolean` | 使用者已修改 | 無直接對應 |
| `touched` | `boolean` | 欄位已失去焦點 | 無直接對應 |
| `untouched` | `boolean` | 欄位從未失去焦點 | 無直接對應 |
| `disabled` | `boolean` | 欄位已停用 | `[disabled]` attribute |
| `enabled` | `boolean` | 欄位已啟用 | `[enabled]` attribute |
| `errors` | `ValidationErrors \| null` | 驗證錯誤物件 | `ModelState.Values.Errors` |
| `status` | `string` | `'VALID'` \| `'INVALID'` \| `'PENDING'` \| `'DISABLED'` | — |

### 6.7.2 狀態流程圖

```
                              ┌──────────────┐
                              │   初始狀態     │
                              │ pristine      │
                              │ untouched     │
                              │ valid/invalid │
                              └──────┬───────┘
                                     │
                        使用者輸入文字 │
                                     ▼
                              ┌──────────────┐
                              │   dirty       │◄─── 使用者修改了值
                              │ untouched     │     (pristine → dirty)
                              └──────┬───────┘
                                     │
                          使用者移出欄位 │ (blur)
                                     ▼
                              ┌──────────────┐
                              │   dirty       │
                              │   touched     │◄─── 欄位失去焦點
                              │ valid/invalid │     (untouched → touched)
                              └──────┬───────┘
                                     │
                    有非同步驗證器？    │
                         ┌───────────┴───────────┐
                         │ 是                     │ 否
                         ▼                       ▼
                  ┌──────────────┐        ┌──────────────┐
                  │   pending    │        │ valid/invalid │
                  │ (等待 API)   │        │ (最終狀態)     │
                  └──────┬───────┘        └──────────────┘
                         │
                   API 回應  │
                         ▼
                  ┌──────────────┐
                  │ valid/invalid │
                  │ (最終狀態)     │
                  └──────────────┘
```

### 6.7.3 CSS 類別

Angular 自動在表單元素上新增 CSS 類別：

| 狀態 | True 類別 | False 類別 |
|---|---|---|
| 已修改 | `ng-dirty` | `ng-pristine` |
| 已觸碰 | `ng-touched` | `ng-untouched` |
| 有效 | `ng-valid` | `ng-invalid` |
| 等待中 | `ng-pending` | — |

```css
/* Style invalid and touched fields with a red border */
input.ng-invalid.ng-touched {
  border-color: var(--color-error, #dc2626);
}

/* Show validation icon on valid touched fields */
input.ng-valid.ng-touched {
  border-color: var(--color-success, #16a34a);
}

/* Pending async validation */
input.ng-pending {
  border-color: var(--color-warning, #d97706);
}
```

### 6.7.4 狀態操作方法

```typescript
const control = form.controls.email;

// Reset to initial value
form.reset();                     // Reset entire form
control.reset();                  // Reset single control

// Mark states manually
form.markAllAsTouched();          // Mark all controls as touched (trigger validation display)
control.markAsDirty();            // Programmatically mark as dirty
control.markAsPristine();         // Reset dirty state
control.markAsTouched();          // Mark as touched
control.markAsUntouched();        // Reset touched state

// Enable/Disable
control.disable();                // Disable (excluded from form.value, included in form.getRawValue())
control.enable();                 // Enable

// Set value programmatically
control.setValue('new@email.com'); // Set value (marks as dirty)
form.patchValue({ email: 'x' }); // Partial update (only specified fields)
form.setValue({ ... });           // Full update (all fields required)

// Update validity
control.updateValueAndValidity(); // Re-run validators
```

---

## 6.8 錯誤顯示模式

### 6.8.1 行內錯誤訊息

```typescript
@Component({
  selector: 'app-inline-errors-demo',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <div class="field">
        <label for="username">使用者名稱</label>
        <input id="username" formControlName="username"
               [attr.aria-describedby]="usernameErrors() ? 'username-errors' : null"
               [attr.aria-invalid]="form.controls.username.invalid && form.controls.username.touched" />

        <!-- Show errors only when touched -->
        @if (form.controls.username.invalid && form.controls.username.touched) {
          <div id="username-errors" class="error-messages" role="alert">
            @if (form.controls.username.hasError('required')) {
              <p>使用者名稱為必填。</p>
            }
            @if (form.controls.username.hasError('minlength')) {
              <p>至少需要 3 個字元。</p>
            }
            @if (form.controls.username.hasError('usernameTaken')) {
              <p>此使用者名稱已被使用。</p>
            }
          </div>
        }

        <!-- Pending indicator for async validation -->
        @if (form.controls.username.pending) {
          <span class="validation-spinner" aria-label="驗證中">驗證中...</span>
        }
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineErrorsDemo {
  // ...
}
```

### 6.8.2 可重用錯誤訊息元件

```typescript
// src/app/shared/form-error.ts
import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

// Error message mapping
const ERROR_MESSAGES: Record<string, (params?: Record<string, unknown>) => string> = {
  required: () => '此欄位為必填。',
  email: () => '請輸入有效的電子信箱。',
  minlength: (p) => `至少需要 ${p?.['requiredLength']} 個字元（目前 ${p?.['actualLength']} 個）。`,
  maxlength: (p) => `不得超過 ${p?.['requiredLength']} 個字元。`,
  min: (p) => `不得小於 ${p?.['min']}。`,
  max: (p) => `不得大於 ${p?.['max']}。`,
  pattern: () => '格式不正確。',
  usernameTaken: () => '此使用者名稱已被使用。',
  emailTaken: () => '此電子信箱已被註冊。',
  passwordMismatch: () => '密碼與確認密碼不一致。',
  invalidTaiwanId: () => '身份證字號格式不正確。',
  missingUppercase: () => '需要包含至少一個大寫字母。',
  missingLowercase: () => '需要包含至少一個小寫字母。',
  missingDigit: () => '需要包含至少一個數字。',
  missingSpecial: () => '需要包含至少一個特殊字元。',
  tooShort: () => '密碼太短。',
};

@Component({
  selector: 'app-form-error',
  template: `
    @if (shouldShow()) {
      <div class="form-errors" role="alert">
        @for (msg of messages(); track msg) {
          <p class="error-message">{{ msg }}</p>
        }
      </div>
    }
  `,
  host: {
    '[class.has-errors]': 'shouldShow()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormError {
  readonly control = input.required<AbstractControl>();
  readonly showWhen = input<'touched' | 'dirty' | 'always'>('touched');

  protected readonly shouldShow = computed((): boolean => {
    const ctrl = this.control();
    if (ctrl.valid || ctrl.pending) return false;

    switch (this.showWhen()) {
      case 'touched': return ctrl.touched;
      case 'dirty': return ctrl.dirty;
      case 'always': return true;
    }
  });

  protected readonly messages = computed((): string[] => {
    const errors: ValidationErrors | null = this.control().errors;
    if (!errors) return [];

    return Object.entries(errors).map(([key, params]) => {
      const messageFn = ERROR_MESSAGES[key];
      return messageFn ? messageFn(params) : `驗證錯誤：${key}`;
    });
  });
}
```

使用方式：

```html
<div class="field">
  <label for="email">電子信箱</label>
  <input id="email" formControlName="email" />
  <app-form-error [control]="form.controls.email" />
</div>
```

### 6.8.3 表單錯誤摘要面板

```typescript
// src/app/shared/form-error-summary.ts
import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

interface FieldError {
  field: string;
  label: string;
  messages: string[];
}

@Component({
  selector: 'app-form-error-summary',
  template: `
    @if (errors().length > 0) {
      <div class="error-summary" role="alert" aria-label="表單錯誤摘要">
        <h4>請修正以下錯誤：</h4>
        <ul>
          @for (error of errors(); track error.field) {
            <li>
              <strong>{{ error.label }}：</strong>
              @for (msg of error.messages; track msg) {
                <span>{{ msg }}</span>
              }
            </li>
          }
        </ul>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorSummary {
  readonly form = input.required<FormGroup>();
  readonly labels = input.required<Record<string, string>>();

  protected readonly errors = computed((): FieldError[] => {
    const formGroup = this.form();
    const labelMap = this.labels();
    const result: FieldError[] = [];

    this.collectErrors(formGroup, result, labelMap, '');
    return result;
  });

  private collectErrors(
    group: FormGroup,
    result: FieldError[],
    labels: Record<string, string>,
    prefix: string,
  ): void {
    for (const [key, control] of Object.entries(group.controls)) {
      const path = prefix ? `${prefix}.${key}` : key;

      if (control instanceof FormGroup) {
        this.collectErrors(control, result, labels, path);
      } else if (control.invalid && control.errors) {
        result.push({
          field: path,
          label: labels[path] ?? key,
          messages: Object.keys(control.errors).map(errKey => errKey),
        });
      }
    }
  }
}
```

### 6.8.4 即時驗證（updateOn 選項）

```typescript
// Default: validate on every change (each keystroke)
const name = new FormControl('', {
  validators: [Validators.required],
  updateOn: 'change',       // Default
});

// Validate on blur (when field loses focus)
const email = new FormControl('', {
  validators: [Validators.required, Validators.email],
  updateOn: 'blur',         // Better UX for async validators
});

// Validate on submit only
const form = new FormGroup({
  name: new FormControl(''),
  email: new FormControl(''),
}, {
  updateOn: 'submit',       // Only validate when form is submitted
});
```

---

## 6.9 Typed Forms

### 6.9.1 FormGroup<T> 泛型定義

Angular 14+ 引入了 Strictly Typed Reactive Forms。定義 `FormGroup<T>` 的介面：

```typescript
import { FormControl, FormGroup, FormArray } from '@angular/forms';

// Step 1: Define the form shape using FormControl/FormGroup/FormArray types
interface UserForm {
  name: FormControl<string>;
  email: FormControl<string>;
  age: FormControl<number>;
  addresses: FormArray<FormGroup<AddressForm>>;
  preferences: FormGroup<PreferencesForm>;
}

interface AddressForm {
  street: FormControl<string>;
  city: FormControl<string>;
  zipCode: FormControl<string>;
}

interface PreferencesForm {
  theme: FormControl<'light' | 'dark'>;
  notifications: FormControl<boolean>;
  language: FormControl<string>;
}

// Step 2: Create the form with full type safety
const form = new FormGroup<UserForm>({
  name: new FormControl('', { nonNullable: true }),
  email: new FormControl('', { nonNullable: true }),
  age: new FormControl(0, { nonNullable: true }),
  addresses: new FormArray<FormGroup<AddressForm>>([]),
  preferences: new FormGroup<PreferencesForm>({
    theme: new FormControl<'light' | 'dark'>('light', { nonNullable: true }),
    notifications: new FormControl(true, { nonNullable: true }),
    language: new FormControl('zh-TW', { nonNullable: true }),
  }),
});

// Step 3: Enjoy full type safety
form.controls.name;                           // FormControl<string>
form.controls.preferences.controls.theme;     // FormControl<'light' | 'dark'>
form.controls.addresses.at(0);                // FormGroup<AddressForm>

// getRawValue() returns the correctly typed object
const value = form.getRawValue();
// Type: { name: string; email: string; age: number; addresses: {...}[]; preferences: {...} }
```

### 6.9.2 NonNullableFormBuilder

`NonNullableFormBuilder` 自動為所有控制項設定 `nonNullable: true`：

```typescript
const fb = inject(FormBuilder);

// Access via .nonNullable property
const form = fb.nonNullable.group({
  name: ['', Validators.required],       // FormControl<string> (not string | null)
  email: ['', Validators.email],         // FormControl<string>
  age: [0, Validators.min(0)],           // FormControl<number>
  active: [true],                        // FormControl<boolean>
});

// Without nonNullable:
const unsafeForm = fb.group({
  name: ['', Validators.required],       // FormControl<string | null> ← nullable!
});

// Key difference: reset behavior
form.controls.name.reset();               // Resets to '' (initial value)
unsafeForm.controls.name.reset();          // Resets to null!
```

### 6.9.3 Nullable vs NonNullable 決策

```typescript
// Use nonNullable (default recommendation) when:
// - The field always has a meaningful initial value
// - You want reset() to restore to the initial value
const name = new FormControl('John', { nonNullable: true }); // Type: string

// Use nullable when:
// - null is a valid domain value (e.g., "no selection")
// - Optional date fields, dropdown "select none"
const birthDate = new FormControl<string | null>(null);       // Type: string | null
```

### 6.9.4 FormControl 型別推論規則

```typescript
// Type inference table:
new FormControl('hello')                    // FormControl<string | null>
new FormControl('hello', { nonNullable: true })  // FormControl<string>
new FormControl<string>('')                 // FormControl<string | null>
new FormControl<string>('', { nonNullable: true }) // FormControl<string>

fb.control('')                              // FormControl<string | null>
fb.nonNullable.control('')                  // FormControl<string>
fb.control<'a' | 'b'>('a')                 // FormControl<'a' | 'b' | null>

// In fb.group() / fb.nonNullable.group():
fb.nonNullable.group({ name: [''] })        // FormGroup<{ name: FormControl<string> }>
fb.group({ name: [''] })                    // FormGroup<{ name: FormControl<string | null> }>
```

---

## 6.10 完整範例：多步驟註冊表單

### 6.10.1 型別定義

```typescript
// src/app/features/registration/registration.types.ts
import { FormControl, FormGroup, FormArray } from '@angular/forms';

// Step 1: Account
export interface AccountStepForm {
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

// Step 2: Personal Information
export interface PersonalStepForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  birthDate: FormControl<string>;
  gender: FormControl<'male' | 'female' | 'other' | ''>;
  phone: FormControl<string>;
}

// Step 3: Address
export interface AddressStepForm {
  street: FormControl<string>;
  city: FormControl<string>;
  district: FormControl<string>;
  zipCode: FormControl<string>;
}

// Step 4: Preferences
export interface PreferencesStepForm {
  interests: FormArray<FormControl<string>>;
  newsletter: FormControl<boolean>;
  agreeTerms: FormControl<boolean>;
}

// Combined form
export interface RegistrationForm {
  account: FormGroup<AccountStepForm>;
  personal: FormGroup<PersonalStepForm>;
  address: FormGroup<AddressStepForm>;
  preferences: FormGroup<PreferencesStepForm>;
}
```

### 6.10.2 驗證器

```typescript
// src/app/features/registration/registration.validators.ts
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer, switchMap, map, catchError } from 'rxjs';

export function passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;
    if (!value) return null;

    const errors: ValidationErrors = {};
    if (value.length < 8) errors['tooShort'] = true;
    if (!/[A-Z]/.test(value)) errors['missingUppercase'] = true;
    if (!/[a-z]/.test(value)) errors['missingLowercase'] = true;
    if (!/\d/.test(value)) errors['missingDigit'] = true;

    return Object.keys(errors).length > 0 ? errors : null;
  };
}

export function passwordMatch(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (!password || !confirm) return null;
    return password === confirm ? null : { passwordMismatch: true };
  };
}

export function uniqueUsername(http: HttpClient): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.length < 3) return of(null);

    return timer(500).pipe(
      switchMap(() =>
        http.get<{ available: boolean }>(`/api/users/check-username?name=${control.value}`),
      ),
      map(res => res.available ? null : { usernameTaken: true }),
      catchError(() => of(null)),
    );
  };
}

export function uniqueEmail(http: HttpClient): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    return timer(500).pipe(
      switchMap(() =>
        http.get<{ available: boolean }>(`/api/users/check-email?email=${control.value}`),
      ),
      map(res => res.available ? null : { emailTaken: true }),
      catchError(() => of(null)),
    );
  };
}

export function minAge(minYears: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const effectiveAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;
    return effectiveAge >= minYears ? null : { minAge: { required: minYears, actual: effectiveAge } };
  };
}
```

### 6.10.3 表單元件

```typescript
// src/app/features/registration/registration-form.ts
import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  RegistrationForm,
  AccountStepForm,
  PersonalStepForm,
  AddressStepForm,
  PreferencesStepForm,
} from './registration.types';
import {
  passwordStrength,
  passwordMatch,
  uniqueUsername,
  uniqueEmail,
  minAge,
} from './registration.validators';
import { FormError } from '../../shared/form-error';

@Component({
  selector: 'app-registration-form',
  imports: [ReactiveFormsModule, FormError],
  template: `
    <div class="registration-wizard">
      <!-- Step indicators -->
      <nav class="steps" aria-label="註冊步驟">
        @for (step of steps; track step.index; let i = $index) {
          <button
            [class.active]="currentStep() === step.index"
            [class.completed]="step.index < currentStep()"
            [class.invalid]="stepInvalid(step.index)"
            [disabled]="step.index > currentStep()"
            (click)="goToStep(step.index)"
            [attr.aria-current]="currentStep() === step.index ? 'step' : null">
            <span class="step-number">{{ step.index + 1 }}</span>
            <span class="step-label">{{ step.label }}</span>
          </button>
        }
      </nav>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <!-- Step 1: Account -->
        @if (currentStep() === 0) {
          <fieldset formGroupName="account">
            <legend>帳號資訊</legend>

            <div class="field">
              <label for="username">使用者名稱</label>
              <input id="username" formControlName="username" autocomplete="username" />
              <app-form-error [control]="form.controls.account.controls.username" />
              @if (form.controls.account.controls.username.pending) {
                <span class="async-indicator">檢查中...</span>
              }
            </div>

            <div class="field">
              <label for="email">電子信箱</label>
              <input id="email" type="email" formControlName="email" autocomplete="email" />
              <app-form-error [control]="form.controls.account.controls.email" />
            </div>

            <div class="field">
              <label for="password">密碼</label>
              <input id="password" type="password" formControlName="password" autocomplete="new-password" />
              <app-form-error [control]="form.controls.account.controls.password" />

              <!-- Password strength indicator -->
              @if (form.controls.account.controls.password.value) {
                <div class="password-strength" [attr.data-strength]="passwordStrengthLevel()">
                  <div class="strength-bar"></div>
                  <span>{{ passwordStrengthLabel() }}</span>
                </div>
              }
            </div>

            <div class="field">
              <label for="confirmPassword">確認密碼</label>
              <input id="confirmPassword" type="password" formControlName="confirmPassword"
                     autocomplete="new-password" />
              @if (form.controls.account.hasError('passwordMismatch')) {
                <span class="error">密碼與確認密碼不一致。</span>
              }
            </div>
          </fieldset>
        }

        <!-- Step 2: Personal Information -->
        @if (currentStep() === 1) {
          <fieldset formGroupName="personal">
            <legend>個人資料</legend>

            <div class="field-row">
              <div class="field">
                <label for="lastName">姓</label>
                <input id="lastName" formControlName="lastName" autocomplete="family-name" />
                <app-form-error [control]="form.controls.personal.controls.lastName" />
              </div>
              <div class="field">
                <label for="firstName">名</label>
                <input id="firstName" formControlName="firstName" autocomplete="given-name" />
                <app-form-error [control]="form.controls.personal.controls.firstName" />
              </div>
            </div>

            <div class="field">
              <label for="birthDate">生日</label>
              <input id="birthDate" type="date" formControlName="birthDate" />
              <app-form-error [control]="form.controls.personal.controls.birthDate" />
            </div>

            <div class="field">
              <label>性別</label>
              <div class="radio-group" role="radiogroup">
                @for (option of genderOptions; track option.value) {
                  <label>
                    <input type="radio" formControlName="gender" [value]="option.value" />
                    {{ option.label }}
                  </label>
                }
              </div>
            </div>

            <div class="field">
              <label for="phone">手機號碼</label>
              <input id="phone" type="tel" formControlName="phone" autocomplete="tel" />
              <app-form-error [control]="form.controls.personal.controls.phone" />
            </div>
          </fieldset>
        }

        <!-- Step 3: Address -->
        @if (currentStep() === 2) {
          <fieldset formGroupName="address">
            <legend>地址資訊</legend>

            <div class="field">
              <label for="zipCode">郵遞區號</label>
              <input id="zipCode" formControlName="zipCode" />
              <app-form-error [control]="form.controls.address.controls.zipCode" />
            </div>

            <div class="field">
              <label for="city">縣市</label>
              <input id="city" formControlName="city" />
              <app-form-error [control]="form.controls.address.controls.city" />
            </div>

            <div class="field">
              <label for="district">區域</label>
              <input id="district" formControlName="district" />
              <app-form-error [control]="form.controls.address.controls.district" />
            </div>

            <div class="field">
              <label for="street">街道地址</label>
              <input id="street" formControlName="street" />
              <app-form-error [control]="form.controls.address.controls.street" />
            </div>
          </fieldset>
        }

        <!-- Step 4: Preferences -->
        @if (currentStep() === 3) {
          <fieldset formGroupName="preferences">
            <legend>偏好設定</legend>

            <div class="field">
              <label>興趣領域</label>
              <div formArrayName="interests">
                @for (interest of interestControls.controls; track $index; let i = $index) {
                  <div class="interest-row">
                    <input [formControlName]="i" [placeholder]="'興趣 ' + (i + 1)" />
                    <button type="button" (click)="removeInterest(i)"
                            [disabled]="interestControls.length <= 1">
                      移除
                    </button>
                  </div>
                }
              </div>
              <button type="button" (click)="addInterest()">新增興趣</button>
            </div>

            <div class="field">
              <label>
                <input type="checkbox" formControlName="newsletter" />
                訂閱電子報
              </label>
            </div>

            <div class="field">
              <label>
                <input type="checkbox" formControlName="agreeTerms" />
                我同意服務條款與隱私政策
              </label>
              @if (form.controls.preferences.controls.agreeTerms.hasError('required')
                && form.controls.preferences.controls.agreeTerms.touched) {
                <span class="error">必須同意條款才能繼續。</span>
              }
            </div>
          </fieldset>
        }

        <!-- Navigation buttons -->
        <div class="form-actions">
          @if (currentStep() > 0) {
            <button type="button" (click)="previousStep()">上一步</button>
          }

          @if (currentStep() < steps.length - 1) {
            <button type="button" (click)="nextStep()"
                    [disabled]="!isCurrentStepValid()">
              下一步
            </button>
          }

          @if (currentStep() === steps.length - 1) {
            <button type="submit" [disabled]="form.invalid || submitting()">
              @if (submitting()) {
                註冊中...
              } @else {
                完成註冊
              }
            </button>
          }
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationForm {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  // Steps configuration
  protected readonly steps = [
    { index: 0, label: '帳號' },
    { index: 1, label: '個人資料' },
    { index: 2, label: '地址' },
    { index: 3, label: '偏好設定' },
  ];

  protected readonly genderOptions = [
    { value: 'male', label: '男' },
    { value: 'female', label: '女' },
    { value: 'other', label: '其他' },
  ];

  // State
  protected readonly currentStep = signal(0);
  protected readonly submitting = signal(false);

  // Form definition
  protected readonly form: FormGroup<RegistrationForm> = this.fb.group({
    account: this.fb.nonNullable.group(
      {
        username: [
          '',
          {
            validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
            asyncValidators: [uniqueUsername(this.http)],
            updateOn: 'blur' as const,
          },
        ],
        email: [
          '',
          {
            validators: [Validators.required, Validators.email],
            asyncValidators: [uniqueEmail(this.http)],
            updateOn: 'blur' as const,
          },
        ],
        password: ['', [Validators.required, passwordStrength()]],
        confirmPassword: ['', Validators.required],
      },
      { validators: [passwordMatch()] },
    ),

    personal: this.fb.nonNullable.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', [Validators.required, minAge(18)]],
      gender: ['' as 'male' | 'female' | 'other' | '', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^09\d{8}$/)]],
    }),

    address: this.fb.nonNullable.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{3,5}$/)]],
    }),

    preferences: this.fb.group({
      interests: this.fb.array<FormControl<string>>(
        [this.fb.nonNullable.control('', Validators.required)],
      ),
      newsletter: this.fb.nonNullable.control(false),
      agreeTerms: this.fb.nonNullable.control(false, Validators.requiredTrue),
    }),
  }) as FormGroup<RegistrationForm>;

  // Computed values
  protected readonly passwordStrengthLevel = computed((): number => {
    const password = this.form.controls.account.controls.password.value;
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  });

  protected readonly passwordStrengthLabel = computed((): string => {
    const level = this.passwordStrengthLevel();
    if (level <= 1) return '弱';
    if (level <= 3) return '中';
    return '強';
  });

  // FormArray accessor
  protected get interestControls(): FormArray<FormControl<string>> {
    return this.form.controls.preferences.controls.interests;
  }

  // Navigation
  protected nextStep(): void {
    if (this.isCurrentStepValid()) {
      this.currentStep.update(s => Math.min(s + 1, this.steps.length - 1));
    } else {
      this.markCurrentStepTouched();
    }
  }

  protected previousStep(): void {
    this.currentStep.update(s => Math.max(s - 1, 0));
  }

  protected goToStep(step: number): void {
    if (step <= this.currentStep()) {
      this.currentStep.set(step);
    }
  }

  protected isCurrentStepValid(): boolean {
    return this.getStepGroup(this.currentStep()).valid;
  }

  protected stepInvalid(step: number): boolean {
    const group = this.getStepGroup(step);
    return group.invalid && group.touched;
  }

  // FormArray operations
  protected addInterest(): void {
    this.interestControls.push(
      this.fb.nonNullable.control('', Validators.required),
    );
  }

  protected removeInterest(index: number): void {
    if (this.interestControls.length > 1) {
      this.interestControls.removeAt(index);
    }
  }

  // Submit
  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Navigate to first invalid step
      for (let i = 0; i < this.steps.length; i++) {
        if (this.getStepGroup(i).invalid) {
          this.currentStep.set(i);
          return;
        }
      }
      return;
    }

    this.submitting.set(true);

    const registration = this.form.getRawValue();
    console.log('Registration:', registration);

    this.http.post('/api/auth/register', registration).subscribe({
      next: () => {
        this.submitting.set(false);
        // Navigate to success page
      },
      error: () => {
        this.submitting.set(false);
        // Show error notification
      },
    });
  }

  // Private helpers
  private getStepGroup(step: number): FormGroup {
    const stepKeys: (keyof RegistrationForm)[] = ['account', 'personal', 'address', 'preferences'];
    return this.form.controls[stepKeys[step]] as FormGroup;
  }

  private markCurrentStepTouched(): void {
    this.getStepGroup(this.currentStep()).markAllAsTouched();
  }
}
```

---

## 6.11 常見陷阱

### 陷阱 1：忘記匯入 ReactiveFormsModule / FormsModule

```typescript
// ❌ Bad — form directives not available, no clear error message
@Component({
  selector: 'app-my-form',
  template: `<form [formGroup]="form">...</form>`,
  // Missing: imports: [ReactiveFormsModule]
})
export class MyForm { }

// ✅ Good — always import the required module
@Component({
  selector: 'app-my-form',
  imports: [ReactiveFormsModule],  // Required for formGroup, formControlName, etc.
  template: `<form [formGroup]="form">...</form>`,
})
export class MyForm { }
```

### 陷阱 2：使用 form.value 而非 form.getRawValue()

```typescript
// ❌ Surprising — disabled controls are excluded from .value
const form = new FormGroup({
  name: new FormControl('John'),
  role: new FormControl({ value: 'admin', disabled: true }),
});

console.log(form.value);           // { name: 'John' } — role is MISSING!

// ✅ Good — getRawValue() includes disabled controls
console.log(form.getRawValue());    // { name: 'John', role: 'admin' }
```

### 陷阱 3：不使用 NonNullableFormBuilder

```typescript
// ❌ Bad — reset produces null, breaks type expectations
const form = new FormGroup({
  name: new FormControl('John'), // Type: string | null
});
form.reset();
console.log(form.controls.name.value); // null — unexpected!

// ✅ Good — nonNullable resets to initial value
const fb = inject(FormBuilder);
const safeForm = fb.nonNullable.group({
  name: ['John'],  // Type: string (not null)
});
safeForm.reset();
console.log(safeForm.controls.name.value); // 'John' — predictable!
```

### 陷阱 4：在 subscribe 中更新表單值

```typescript
// ❌ Bad — may cause infinite loop
form.controls.price.valueChanges.subscribe(price => {
  // This triggers another valueChanges emission!
  form.controls.total.setValue(price * quantity);
});

// ✅ Good — use emitEvent: false to prevent loop
form.controls.price.valueChanges.subscribe(price => {
  form.controls.total.setValue(price * quantity, { emitEvent: false });
});
```

### 陷阱 5：FormArray 操作後不更新 UI

```typescript
// ❌ Bad — directly accessing FormArray controls without proper change detection
// With OnPush, adding/removing items might not reflect in template

// ✅ Good — FormArray methods (push, removeAt, etc.) properly notify Angular
// Just ensure the template iterates over the FormArray correctly:
// @for (item of formArray.controls; track $index) { ... }
```

### 陷阱 6：忘記 updateOn: 'blur' 搭配非同步驗證器

```typescript
// ❌ Bad — async validator fires on every keystroke, excessive API calls
const username = new FormControl('', {
  asyncValidators: [uniqueUsername(http)],
  // updateOn: 'change' (default) — fires on every keystroke!
});

// ✅ Good — validate on blur to reduce API calls
const username = new FormControl('', {
  asyncValidators: [uniqueUsername(http)],
  updateOn: 'blur',  // Only validate when user leaves the field
});
```

### 陷阱 7：混用 Reactive 和 Template-driven

```typescript
// ❌ Bad — mixing formGroup with ngModel causes confusing behavior
// and is explicitly deprecated
<form [formGroup]="form">
  <input formControlName="name" />
  <input [(ngModel)]="otherValue" />  <!-- DON'T mix! -->
</form>

// ✅ Good — choose one approach per form
// Either all Reactive OR all Template-driven
```

### 陷阱 8：未處理 pending 狀態

```typescript
// ❌ Bad — form may be submitted while async validation is still pending
protected onSubmit(): void {
  if (this.form.valid) {  // Could be false even though it's just pending
    this.save();
  }
}

// ✅ Good — check for pending state and wait if necessary
protected onSubmit(): void {
  if (this.form.pending) {
    // Wait for async validators to complete
    this.form.statusChanges.pipe(
      filter(status => status !== 'PENDING'),
      take(1),
    ).subscribe(() => this.submitIfValid());
    return;
  }
  this.submitIfValid();
}

private submitIfValid(): void {
  if (this.form.valid) {
    this.save();
  } else {
    this.form.markAllAsTouched();
  }
}
```

---

## 本章重點回顧

| 概念 | .NET 對應 | Angular 19+ |
|---|---|---|
| ViewModel binding | `[BindProperty]` Model | `FormGroup` / `ngModel` |
| 驗證 | DataAnnotations | `Validators` + custom functions |
| 非同步驗證 | `[Remote]` attribute | `AsyncValidatorFn` |
| 跨欄位驗證 | `IValidatableObject` | FormGroup validator |
| 表單狀態 | `ModelState` | `valid`, `dirty`, `touched`, `pending` |
| 動態欄位 | `List<T>` property | `FormArray<T>` |
| 型別安全 | C# 強型別 | `FormGroup<T>` generic |
| 初始值還原 | N/A | `NonNullableFormBuilder` |

**下一章**：[第七章：Testing — 測試策略](./07-testing.md)，我們將學習元件測試、服務測試、HTTP Mock 與路由測試。
