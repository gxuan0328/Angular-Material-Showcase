import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GuidePage } from '../shared/guide-page';
import { GuideChapter } from '../models/guide-chapter';

const CHAPTER: GuideChapter = {
  id: 'forms',
  number: 6,
  title: '表單與驗證',
  subtitle: 'Reactive Forms、自訂驗證器、動態表單',
  icon: 'edit_note',
  category: 'intermediate',
  tags: ['Reactive Forms', 'Template-driven', 'Validators', 'FormArray', 'Typed Forms'],
  estimatedMinutes: 45,
  sections: [
    // ─── Section 1: Reactive Forms ───
    {
      id: 'reactive-forms',
      title: 'Reactive Forms',
      content: `
        <p>Reactive Forms 是 Angular 中最強大且最常用的表單處理方式。
        它將表單模型定義在 TypeScript 類別中，提供完整的型別安全、可測試性和反應式資料流。</p>

        <p>核心概念包括三個建構元件：</p>
        <ul>
          <li><code>FormControl</code>：代表單一表單欄位，持有欄位的值、驗證狀態和使用者互動狀態（dirty、touched）</li>
          <li><code>FormGroup</code>：將多個 <code>FormControl</code> 組成一個群組，整體驗證狀態由所有子控制項決定</li>
          <li><code>FormArray</code>：動態陣列，用於重複性的表單欄位（如多個電話號碼、地址等）</li>
        </ul>

        <p><code>FormBuilder</code> 是一個輔助服務，提供簡潔的 API 來建立表單結構。
        它的 <code>group()</code>、<code>control()</code>、<code>array()</code> 方法
        分別對應上述三個建構元件，但語法更簡潔。</p>

        <p>Reactive Forms 的反應式本質讓你可以使用 <code>valueChanges</code> 和
        <code>statusChanges</code> Observable 來監聽表單狀態的即時變化。
        這在實作即時搜尋、依賴性欄位連動、自動儲存等場景中非常有用。</p>

        <p>在 Angular 20+ 中，推薦使用 <code>NonNullableFormBuilder</code>
        來確保所有控制項在 <code>reset()</code> 後回到初始值而非 <code>null</code>，
        這與嚴格型別檢查配合得更好。</p>
      `,
      codeExamples: [
        {
          filename: 'user-form.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>
        姓名
        <input formControlName="name" />
      </label>
      @if (form.controls.name.hasError('required') && form.controls.name.touched) {
        <span class="error">姓名為必填</span>
      }

      <label>
        電子郵件
        <input formControlName="email" type="email" />
      </label>

      <fieldset formGroupName="address">
        <legend>地址</legend>
        <input formControlName="city" placeholder="城市" />
        <input formControlName="street" placeholder="街道" />
        <input formControlName="zip" placeholder="郵遞區號" />
      </fieldset>

      <button type="submit" [disabled]="form.invalid">送出</button>
    </form>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForm {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    address: this.fb.group({
      city: ['', Validators.required],
      street: [''],
      zip: ['', Validators.pattern(/^\\d{3,5}$/)],
    }),
  });

  protected onSubmit(): void {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      console.log('Form submitted:', value);
      // value is fully typed: { name: string; email: string; address: { city: string; ... } }
    }
  }
}`,
          annotation: 'NonNullableFormBuilder 建構巢狀表單群組。getRawValue() 回傳含 disabled 欄位的完整型別物件。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: 'Angular 的 FormGroup 類似 .NET Blazor 的 EditForm + DataAnnotations 模型。差別在於 Angular 的表單模型是在元件中動態定義，而 .NET 通常將驗證註解放在 DTO/Model 類別上。兩者都支援巢狀驗證。',
        },
        {
          type: 'best-practice',
          content: '使用 NonNullableFormBuilder 取代 FormBuilder。它確保 reset() 回到初始值而非 null，與 TypeScript 嚴格模式配合更好，減少到處檢查 null 的需要。',
        },
      ],
    },

    // ─── Section 2: Template-driven Forms ───
    {
      id: 'template-forms',
      title: 'Template-driven Forms',
      content: `
        <p>Template-driven Forms 是 Angular 提供的另一種表單處理方式，
        適合簡單的表單場景。它透過模板指令（<code>ngModel</code>、<code>ngForm</code>）
        自動建立底層的 <code>FormControl</code> 和 <code>FormGroup</code> 實例。</p>

        <p>使用 Template-driven Forms 時，你只需要在模板中為每個輸入元素加上
        <code>ngModel</code> 指令和 <code>name</code> 屬性。Angular 會自動建立對應的
        <code>FormControl</code> 並綁定到 <code>ngForm</code> 群組中。</p>

        <p>Template-driven 表單的驗證是透過模板屬性來設定的：</p>
        <ul>
          <li><code>required</code>：必填欄位</li>
          <li><code>minlength</code> / <code>maxlength</code>：字串長度限制</li>
          <li><code>pattern</code>：正則表達式驗證</li>
          <li><code>email</code>：電子郵件格式驗證</li>
        </ul>

        <p>透過模板參考變數（<code>#nameCtrl="ngModel"</code>），你可以在模板中直接存取控制項的狀態，
        例如 <code>nameCtrl.invalid</code>、<code>nameCtrl.touched</code> 等，
        用來顯示錯誤訊息。</p>

        <p>Template-driven Forms 的主要缺點是：邏輯分散在模板中而非 TypeScript 類別中，
        不容易撰寫單元測試，且型別安全性較差。因此只推薦在非常簡單的場景中使用，
        例如只有一兩個欄位的搜尋表單或登入表單。</p>

        <p>在元件中需要匯入 <code>FormsModule</code> 才能使用 <code>ngModel</code> 和 <code>ngForm</code>。</p>
      `,
      codeExamples: [
        {
          filename: 'login-form.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule],
  template: \`
    <form #loginForm="ngForm" (ngSubmit)="onLogin(loginForm)">
      <label>
        帳號
        <input
          name="username"
          [(ngModel)]="username"
          required
          minlength="3"
          #usernameCtrl="ngModel"
        />
      </label>
      @if (usernameCtrl.invalid && usernameCtrl.touched) {
        @if (usernameCtrl.hasError('required')) {
          <span class="error">帳號為必填</span>
        } @else if (usernameCtrl.hasError('minlength')) {
          <span class="error">帳號至少 3 個字元</span>
        }
      }

      <label>
        密碼
        <input
          name="password"
          type="password"
          [(ngModel)]="password"
          required
          minlength="8"
          #passwordCtrl="ngModel"
        />
      </label>
      @if (passwordCtrl.invalid && passwordCtrl.touched) {
        <span class="error">密碼至少 8 個字元</span>
      }

      <button type="submit" [disabled]="loginForm.invalid">登入</button>
    </form>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginForm {
  protected username = '';
  protected password = '';

  protected onLogin(form: NgForm): void {
    if (form.valid) {
      console.log('Login:', { username: this.username, password: this.password });
    }
  }
}`,
          annotation: 'Template-driven 登入表單：使用 ngModel 雙向綁定、模板屬性驗證、模板參考變數顯示錯誤。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: 'Template-driven Forms 類似 ASP.NET MVC 的 Razor View + DataAnnotations 驗證。表單邏輯寫在模板中，驗證由框架自動推導。而 Reactive Forms 更像 Blazor 的 EditContext 手動管理模式。',
        },
        {
          type: 'warning',
          content: 'Template-driven 表單中 ngModel 綁定的變數必須搭配 name 屬性使用，否則 Angular 會拋出錯誤。name 屬性用於在 ngForm 群組中識別該控制項。',
        },
      ],
    },

    // ─── Section 3: 選擇指南 ───
    {
      id: 'form-decision',
      title: '選擇指南',
      content: `
        <p>Angular 提供三種表單方案，各有適用場景。正確選擇能大幅降低開發複雜度和維護成本。</p>

        <table>
          <thead>
            <tr>
              <th>考量面向</th>
              <th>Reactive Forms</th>
              <th>Template-driven</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>表單模型定義</td><td>TypeScript 類別中</td><td>模板指令中</td></tr>
            <tr><td>型別安全</td><td>完整（Typed Forms）</td><td>較弱（any）</td></tr>
            <tr><td>可測試性</td><td>優秀（純邏輯測試）</td><td>需要模板渲染</td></tr>
            <tr><td>動態欄位</td><td>原生支援（FormArray）</td><td>困難</td></tr>
            <tr><td>跨欄位驗證</td><td>簡單（group-level validators）</td><td>需要自訂指令</td></tr>
            <tr><td>學習曲線</td><td>中等</td><td>低</td></tr>
            <tr><td>適用場景</td><td>複雜商業邏輯表單</td><td>簡單搜尋、登入</td></tr>
          </tbody>
        </table>

        <p><strong>決策流程建議：</strong></p>
        <ol>
          <li>如果是全新專案且使用 Angular 21+，優先評估 Signal Forms（實驗性）</li>
          <li>如果表單有 3 個以上欄位、動態欄位、或複雜驗證 → <strong>Reactive Forms</strong></li>
          <li>如果是簡單的 1-2 個欄位（如搜尋框、登入表單）→ <strong>Template-driven</strong></li>
          <li>如果需要在表單間共享驗證邏輯 → <strong>Reactive Forms</strong>（驗證器是純函式，容易複用）</li>
        </ol>

        <p>在實際專案中，團隊通常會統一使用 Reactive Forms 作為標準方案，
        因為保持一致的寫法比針對每個表單選擇最佳方案更重要。
        這降低了新成員的學習成本，也讓 Code Review 更有效率。</p>

        <p>無論選擇哪種方案，都應該將表單驗證邏輯集中管理。
        建議建立一個 <code>validators/</code> 目錄，將常用的自訂驗證器以純函式匯出，
        讓所有表單都能重複使用。</p>
      `,
      tips: [
        {
          type: 'best-practice',
          content: '在團隊專案中統一使用 Reactive Forms。混合使用兩種表單方案會增加認知負擔和維護成本。Template-driven 只在極簡單的場景（如搜尋框）中例外使用。',
        },
        {
          type: 'dotnet-comparison',
          content: '.NET 也有類似的選擇：Blazor EditForm（類似 Reactive Forms）vs Razor Pages 的模型綁定（類似 Template-driven）。兩個生態系的建議一致：複雜表單用顯式模型管理，簡單表單用框架自動綁定。',
        },
      ],
    },

    // ─── Section 4: 驗證器 ───
    {
      id: 'validators',
      title: '驗證器',
      content: `
        <p>Angular 的驗證機制分為同步驗證器和非同步驗證器兩種。
        內建驗證器涵蓋了大部分常見需求，自訂驗證器則讓你處理業務特定的規則。</p>

        <p><strong>內建驗證器</strong>（<code>Validators</code> 類別）：</p>
        <ul>
          <li><code>Validators.required</code>：必填</li>
          <li><code>Validators.minLength(n)</code> / <code>Validators.maxLength(n)</code>：長度限制</li>
          <li><code>Validators.min(n)</code> / <code>Validators.max(n)</code>：數值範圍</li>
          <li><code>Validators.email</code>：電子郵件格式</li>
          <li><code>Validators.pattern(regex)</code>：正則表達式</li>
        </ul>

        <p><strong>自訂同步驗證器</strong>是一個接收 <code>AbstractControl</code>
        並回傳 <code>ValidationErrors | null</code> 的純函式。回傳 <code>null</code> 表示驗證通過，
        回傳物件表示驗證失敗，物件的 key 是錯誤名稱。</p>

        <p><strong>自訂非同步驗證器</strong>回傳 <code>Observable&lt;ValidationErrors | null&gt;</code>
        或 <code>Promise</code>。常見用途是檢查帳號是否已存在等需要呼叫 API 的驗證。
        非同步驗證器只在所有同步驗證器通過後才會執行，以減少不必要的 API 呼叫。</p>

        <p><strong>跨欄位驗證器</strong>應用在 <code>FormGroup</code> 層級，
        可以同時存取群組中所有控制項的值。典型用例是密碼確認（兩個密碼欄位必須一致）
        和日期範圍（結束日期必須晚於開始日期）。</p>

        <p>驗證器是純函式，非常容易測試和重複使用。建議將它們集中在專用檔案中管理。</p>
      `,
      codeExamples: [
        {
          filename: 'custom-validators.ts',
          language: 'typescript',
          code: `import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, map, debounceTime, switchMap, of, first } from 'rxjs';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

// Sync validator: password strength
export function strongPassword(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';
  const errors: Record<string, boolean> = {};

  if (!/[A-Z]/.test(value)) errors['missingUppercase'] = true;
  if (!/[a-z]/.test(value)) errors['missingLowercase'] = true;
  if (!/[0-9]/.test(value)) errors['missingNumber'] = true;
  if (!/[!@#$%^&*]/.test(value)) errors['missingSpecial'] = true;

  return Object.keys(errors).length > 0 ? errors : null;
}

// Cross-field validator: password match (applied at FormGroup level)
export function passwordMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;

  if (password && confirm && password !== confirm) {
    return { passwordMismatch: true };
  }
  return null;
}

// Async validator factory: check username availability
export function uniqueUsername(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(300),
      switchMap(username => userService.checkAvailability(username)),
      map(available => available ? null : { usernameTaken: true }),
      first(),
    );
  };
}`,
          annotation: '三種自訂驗證器：同步密碼強度、跨欄位密碼比對、非同步帳號唯一性檢查。都是可重複使用的純函式。',
        },
        {
          filename: 'register-form.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { strongPassword, passwordMatch, uniqueUsername } from '../validators/custom-validators';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="onRegister()">
      <label>
        帳號
        <input formControlName="username" />
      </label>
      @if (form.controls.username.hasError('usernameTaken')) {
        <span class="error">此帳號已被使用</span>
      }

      <label>
        密碼
        <input formControlName="password" type="password" />
      </label>
      @if (form.controls.password.hasError('missingUppercase')) {
        <span class="error">需包含大寫字母</span>
      }

      <label>
        確認密碼
        <input formControlName="confirmPassword" type="password" />
      </label>
      @if (form.hasError('passwordMismatch')) {
        <span class="error">兩次密碼不一致</span>
      }

      <button type="submit" [disabled]="form.invalid || form.pending">
        @if (form.pending) { 驗證中... } @else { 註冊 }
      </button>
    </form>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterForm {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly userService = inject(UserService);

  protected readonly form = this.fb.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)],
        [uniqueUsername(this.userService)]],
      password: ['', [Validators.required, Validators.minLength(8), strongPassword]],
      confirmPassword: ['', Validators.required],
    },
    { validators: [passwordMatch] },
  );

  protected onRegister(): void {
    if (this.form.valid) {
      console.log('Register:', this.form.getRawValue());
    }
  }
}`,
          annotation: '註冊表單整合同步、非同步、跨欄位驗證器。form.pending 在非同步驗證執行時為 true。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: 'Angular 的 ValidatorFn 等同於 .NET DataAnnotations 的 ValidationAttribute。差別在於 Angular 驗證器是純函式，.NET 是類別裝飾器。Angular 的 AsyncValidatorFn 類似 .NET 的 IAsyncValidation 或 FluentValidation 的 MustAsync。',
        },
        {
          type: 'tip',
          content: '非同步驗證器中使用 debounceTime() 避免過度呼叫 API，使用 first() 確保 Observable 完成。form.pending 可用於在 UI 中顯示驗證進行中的狀態。',
        },
      ],
    },

    // ─── Section 5: FormArray ───
    {
      id: 'form-array',
      title: 'FormArray',
      content: `
        <p><code>FormArray</code> 是 Reactive Forms 中處理動態重複欄位的核心工具。
        它管理一組 <code>FormControl</code> 或 <code>FormGroup</code> 的有序陣列，
        允許使用者在執行時期新增或移除欄位。</p>

        <p>常見的 <code>FormArray</code> 應用場景包括：</p>
        <ul>
          <li>多個聯絡電話或電子郵件地址</li>
          <li>訂單中的多個商品行項</li>
          <li>問卷調查中的動態問題</li>
          <li>技能列表或標籤輸入</li>
        </ul>

        <p><code>FormArray</code> 提供的操作方法：</p>
        <ul>
          <li><code>push(control)</code>：在末尾新增一個控制項</li>
          <li><code>removeAt(index)</code>：移除指定位置的控制項</li>
          <li><code>at(index)</code>：取得指定位置的控制項</li>
          <li><code>insert(index, control)</code>：在指定位置插入控制項</li>
          <li><code>clear()</code>：移除所有控制項</li>
        </ul>

        <p>在模板中使用 <code>formArrayName</code> 指令綁定 <code>FormArray</code>，
        然後搭配 <code>@for</code> 迴圈遍歷控制項。每個子項目透過
        <code>[formGroupName]="i"</code>（使用索引）或 <code>[formControlName]="i"</code>
        來綁定對應的控制項。</p>

        <p>驗證方面，<code>FormArray</code> 本身也可以設定驗證器。
        例如你可以驗證陣列至少要有一個項目、或項目數量不能超過上限。
        每個子項目的驗證則在建立 <code>FormControl</code> 或 <code>FormGroup</code> 時個別設定。</p>
      `,
      codeExamples: [
        {
          filename: 'order-form.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder, ReactiveFormsModule, Validators,
  FormArray, FormGroup, FormControl,
} from '@angular/forms';

interface LineItemForm {
  product: FormControl<string>;
  quantity: FormControl<number>;
  price: FormControl<number>;
}

@Component({
  selector: 'app-order-form',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <h3>訂單明細</h3>
      <div formArrayName="items">
        @for (item of itemsArray.controls; track item; let i = $index) {
          <fieldset [formGroupName]="i">
            <input formControlName="product" placeholder="商品名稱" />
            <input formControlName="quantity" type="number" min="1" />
            <input formControlName="price" type="number" min="0" />
            <button type="button" (click)="removeItem(i)">移除</button>
          </fieldset>
        }
      </div>

      @if (itemsArray.hasError('minItems')) {
        <span class="error">至少需要一個商品</span>
      }

      <button type="button" (click)="addItem()">新增商品</button>
      <button type="submit" [disabled]="form.invalid">送出訂單</button>
    </form>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderForm {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    customer: ['', Validators.required],
    items: this.fb.array<FormGroup<LineItemForm>>(
      [this.createItem()],
      { validators: [minItems(1)] },
    ),
  });

  protected get itemsArray(): FormArray<FormGroup<LineItemForm>> {
    return this.form.controls.items;
  }

  protected addItem(): void {
    this.itemsArray.push(this.createItem());
  }

  protected removeItem(index: number): void {
    if (this.itemsArray.length > 1) {
      this.itemsArray.removeAt(index);
    }
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      console.log('Order:', this.form.getRawValue());
    }
  }

  private createItem(): FormGroup<LineItemForm> {
    return this.fb.group<LineItemForm>({
      product: this.fb.control('', Validators.required),
      quantity: this.fb.control(1, [Validators.required, Validators.min(1)]),
      price: this.fb.control(0, [Validators.required, Validators.min(0)]),
    });
  }
}

// Custom array validator
function minItems(min: number) {
  return (control: import('@angular/forms').AbstractControl) => {
    const arr = control as FormArray;
    return arr.length >= min ? null : { minItems: { required: min, actual: arr.length } };
  };
}`,
          annotation: 'FormArray 動態訂單行項：新增/移除商品、自訂最小項目數驗證器、完整型別。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: '.NET Blazor 沒有等同於 FormArray 的內建機制。通常使用 List<T> 搭配 @foreach 迴圈手動管理。Angular 的 FormArray 提供了內建的驗證追蹤和狀態管理，這是一個明顯的優勢。',
        },
        {
          type: 'warning',
          content: '在 @for 迴圈中使用 track item（追蹤物件參考）而非 track i（追蹤索引）。追蹤索引在新增/移除項目時可能導致 DOM 重用錯誤，讓輸入欄位顯示錯誤的值。',
        },
      ],
    },

    // ─── Section 6: Typed Forms ───
    {
      id: 'typed-forms',
      title: 'Typed Forms',
      content: `
        <p>Angular 14 引入了 Typed Forms（嚴格型別表單），讓 <code>FormGroup</code>、
        <code>FormControl</code> 和 <code>FormArray</code> 都支援泛型參數。
        這大幅提升了表單程式碼的型別安全性，編譯時期就能發現欄位名稱拼錯或型別不符的錯誤。</p>

        <p>在 Typed Forms 中，<code>FormGroup&lt;T&gt;</code> 的泛型參數 <code>T</code>
        是一個介面，每個屬性對應一個 <code>FormControl&lt;V&gt;</code> 或巢狀的
        <code>FormGroup</code>。這讓 <code>form.controls.xxx</code>
        的存取在編譯時期就受到型別檢查。</p>

        <p><code>NonNullableFormBuilder</code> 是 Typed Forms 的最佳搭檔。
        使用它建立的所有控制項預設都是 non-nullable 的，意味著 <code>reset()</code>
        會回到初始值而非 <code>null</code>。這消除了大量的 <code>null</code> 檢查。</p>

        <p><code>.value</code> 與 <code>.getRawValue()</code> 的差異：</p>
        <ul>
          <li><code>.value</code>：排除 disabled 控制項，且型別包含 <code>undefined</code>（因為 disabled 欄位不存在）</li>
          <li><code>.getRawValue()</code>：包含所有控制項（含 disabled），型別更精確（不含 <code>undefined</code>）</li>
        </ul>

        <p>建議總是使用 <code>getRawValue()</code> 來取得表單資料，
        因為它提供最完整的型別資訊和最一致的行為。
        在送出 API 前通常也需要包含 disabled 欄位的完整資料。</p>

        <p>Typed Forms 與 IDE 整合良好：自動完成會列出所有可用的欄位名稱，
        重構時修改介面也會觸發編譯錯誤，確保表單模型與型別定義保持同步。</p>
      `,
      codeExamples: [
        {
          filename: 'typed-profile-form.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder, ReactiveFormsModule, Validators,
  FormGroup, FormControl,
} from '@angular/forms';

// Define the form shape as an interface
interface ProfileForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  age: FormControl<number>;
  newsletter: FormControl<boolean>;
  role: FormControl<'admin' | 'user' | 'guest'>;
}

@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSave()">
      <input formControlName="firstName" placeholder="名字" />
      <input formControlName="lastName" placeholder="姓氏" />
      <input formControlName="age" type="number" />
      <label>
        <input formControlName="newsletter" type="checkbox" />
        訂閱電子報
      </label>
      <select formControlName="role">
        <option value="admin">管理員</option>
        <option value="user">使用者</option>
        <option value="guest">訪客</option>
      </select>
      <button type="submit">儲存</button>
    </form>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileForm {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form: FormGroup<ProfileForm> = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    age: [0, [Validators.required, Validators.min(0), Validators.max(150)]],
    newsletter: [false],
    role: ['user' as const, Validators.required],
  });

  protected onSave(): void {
    if (this.form.valid) {
      // Fully typed: { firstName: string; lastName: string; age: number; ... }
      const data = this.form.getRawValue();
      console.log(data.firstName);  // ✅ string
      console.log(data.role);       // ✅ 'admin' | 'user' | 'guest'
      // console.log(data.email);   // ❌ Compile error — property does not exist
    }
  }
}`,
          annotation: '嚴格型別表單：FormGroup<ProfileForm> 確保欄位名稱和型別在編譯時期檢查。getRawValue() 回傳完整型別。',
        },
      ],
      tips: [
        {
          type: 'best-practice',
          content: '定義表單介面時，每個屬性使用 FormControl<T> 而非直接使用值型別。這讓 TypeScript 能正確推導 controls 的型別和 value 的型別。',
        },
        {
          type: 'dotnet-comparison',
          content: '.NET 的 EditForm 從一開始就是強型別的——你傳入一個 Model 物件，所有綁定都有型別檢查。Angular 直到 v14 才補上這個能力。好消息是現在兩者體驗相當：IDE 自動完成、編譯時檢查、重構安全。',
        },
      ],
    },

    // ─── Section 7: 完整範例 ───
    {
      id: 'complete-form',
      title: '完整範例',
      content: `
        <p>以下展示一個多步驟註冊表單，綜合運用 Reactive Forms 的所有核心概念：
        巢狀 <code>FormGroup</code>、<code>FormArray</code>、同步/非同步驗證器、
        Typed Forms、以及步驟間的狀態管理。</p>

        <p>表單分為三個步驟：</p>
        <ol>
          <li><strong>基本資料</strong>：姓名、電子郵件、密碼（含強度驗證和確認比對）</li>
          <li><strong>聯絡資訊</strong>：電話號碼（動態 FormArray，可新增多個）</li>
          <li><strong>偏好設定</strong>：通知方式、語言選擇</li>
        </ol>

        <p>每個步驟對應一個巢狀的 <code>FormGroup</code>，只有當前步驟的群組驗證通過後
        才能進到下一步。這種設計讓每個步驟可以獨立驗證，不受其他步驟影響。</p>

        <p>狀態管理使用 Signal 追蹤當前步驟（<code>currentStep</code>），
        搭配 <code>computed()</code> 計算是否能前進或後退。
        最終送出時透過 <code>getRawValue()</code> 取得所有步驟的完整資料。</p>

        <p>這個模式適合用於任何需要分步驟收集資料的場景，
        例如問卷調查、服務申請、多步驟結帳流程等。
        實際專案中，你可能還會加入步驟進度指示器、自動儲存草稿、以及步驟間的資料連動。</p>
      `,
      codeExamples: [
        {
          filename: 'multi-step-register.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import {
  NonNullableFormBuilder, ReactiveFormsModule, Validators,
  FormGroup, FormControl, FormArray,
} from '@angular/forms';
import { strongPassword, passwordMatch } from '../validators/custom-validators';

interface Step1Form {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

interface PhoneForm {
  number: FormControl<string>;
  label: FormControl<'mobile' | 'home' | 'work'>;
}

interface Step2Form {
  phones: FormArray<FormGroup<PhoneForm>>;
}

interface Step3Form {
  notifications: FormControl<'email' | 'sms' | 'none'>;
  language: FormControl<string>;
  acceptTerms: FormControl<boolean>;
}

@Component({
  selector: 'app-multi-step-register',
  imports: [ReactiveFormsModule],
  template: \`
    <div class="stepper">
      <div class="steps-indicator">
        @for (label of stepLabels; track label; let i = $index) {
          <span [class.active]="currentStep() === i"
                [class.completed]="currentStep() > i">
            {{ i + 1 }}. {{ label }}
          </span>
        }
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        @switch (currentStep()) {
          @case (0) {
            <fieldset formGroupName="step1">
              <input formControlName="name" placeholder="姓名" />
              <input formControlName="email" type="email" placeholder="電子郵件" />
              <input formControlName="password" type="password" placeholder="密碼" />
              <input formControlName="confirmPassword" type="password" placeholder="確認密碼" />
              @if (form.controls.step1.hasError('passwordMismatch')) {
                <span class="error">密碼不一致</span>
              }
            </fieldset>
          }
          @case (1) {
            <fieldset formGroupName="step2">
              <div formArrayName="phones">
                @for (phone of phonesArray.controls; track phone; let i = $index) {
                  <div [formGroupName]="i">
                    <input formControlName="number" placeholder="電話號碼" />
                    <select formControlName="label">
                      <option value="mobile">手機</option>
                      <option value="home">住家</option>
                      <option value="work">公司</option>
                    </select>
                    <button type="button" (click)="removePhone(i)">移除</button>
                  </div>
                }
              </div>
              <button type="button" (click)="addPhone()">新增電話</button>
            </fieldset>
          }
          @case (2) {
            <fieldset formGroupName="step3">
              <select formControlName="notifications">
                <option value="email">電子郵件通知</option>
                <option value="sms">簡訊通知</option>
                <option value="none">不通知</option>
              </select>
              <input formControlName="language" placeholder="偏好語言" />
              <label>
                <input formControlName="acceptTerms" type="checkbox" />
                我同意服務條款
              </label>
            </fieldset>
          }
        }

        <div class="actions">
          @if (canGoBack()) {
            <button type="button" (click)="prevStep()">上一步</button>
          }
          @if (canGoNext()) {
            <button type="button" (click)="nextStep()" [disabled]="!isCurrentStepValid()">
              下一步
            </button>
          } @else {
            <button type="submit" [disabled]="form.invalid">完成註冊</button>
          }
        </div>
      </form>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiStepRegister {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly stepLabels = ['基本資料', '聯絡資訊', '偏好設定'];
  protected readonly currentStep = signal(0);
  protected readonly canGoBack = computed(() => this.currentStep() > 0);
  protected readonly canGoNext = computed(() => this.currentStep() < this.stepLabels.length - 1);

  protected readonly form = this.fb.group({
    step1: this.fb.group<Step1Form>(
      {
        name: this.fb.control('', [Validators.required]),
        email: this.fb.control('', [Validators.required, Validators.email]),
        password: this.fb.control('', [Validators.required, Validators.minLength(8), strongPassword]),
        confirmPassword: this.fb.control('', [Validators.required]),
      },
      { validators: [passwordMatch] },
    ),
    step2: this.fb.group<Step2Form>({
      phones: this.fb.array<FormGroup<PhoneForm>>([this.createPhone()]),
    }),
    step3: this.fb.group<Step3Form>({
      notifications: this.fb.control('email' as const),
      language: this.fb.control('zh-TW'),
      acceptTerms: this.fb.control(false, Validators.requiredTrue),
    }),
  });

  protected get phonesArray(): FormArray<FormGroup<PhoneForm>> {
    return this.form.controls.step2.controls.phones;
  }

  protected isCurrentStepValid(): boolean {
    const stepKeys: ('step1' | 'step2' | 'step3')[] = ['step1', 'step2', 'step3'];
    return this.form.controls[stepKeys[this.currentStep()]].valid;
  }

  protected nextStep(): void {
    if (this.isCurrentStepValid()) {
      this.currentStep.update(s => s + 1);
    }
  }

  protected prevStep(): void {
    this.currentStep.update(s => s - 1);
  }

  protected addPhone(): void {
    this.phonesArray.push(this.createPhone());
  }

  protected removePhone(index: number): void {
    if (this.phonesArray.length > 1) {
      this.phonesArray.removeAt(index);
    }
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      console.log('Registration:', this.form.getRawValue());
    }
  }

  private createPhone(): FormGroup<PhoneForm> {
    return this.fb.group<PhoneForm>({
      number: this.fb.control('', [Validators.required, Validators.pattern(/^\\+?[\\d-]{7,15}$/)]),
      label: this.fb.control('mobile' as const),
    });
  }
}`,
          annotation: '多步驟註冊表單：巢狀 FormGroup、動態 FormArray、Signal 步驟管理、完整型別。',
        },
      ],
      tips: [
        {
          type: 'best-practice',
          content: '多步驟表單使用單一 FormGroup 管理所有步驟的資料，以 Signal 控制當前步驟。這比每個步驟獨立表單更好，因為步驟間資料共享更容易，最終送出也只需呼叫一次 getRawValue()。',
        },
        {
          type: 'tip',
          content: '考慮使用 Angular CDK Stepper 來處理步驟導航邏輯，或 Angular Material 的 MatStepper 元件來取得完整的 UI 支援。它們都與 Reactive Forms 無縫整合。',
        },
      ],
    },

    // ─── Section 8: 常見陷阱 ───
    {
      id: 'forms-pitfalls',
      title: '常見陷阱',
      content: `
        <p>以下是使用 Angular Forms 時最常遇到的 8 個錯誤，
        涵蓋 Reactive Forms 和 Template-driven Forms：</p>

        <ol>
          <li><strong>忘記匯入 ReactiveFormsModule</strong>：使用 Reactive Forms 時，
          元件的 <code>imports</code> 陣列中必須包含 <code>ReactiveFormsModule</code>。
          缺少匯入會導致 <code>formGroup</code> 指令無法辨識，產生模板錯誤。</li>

          <li><strong>FormControl 值為 null</strong>：預設的 <code>FormBuilder</code>
          在 <code>reset()</code> 後會將值設為 <code>null</code>。
          使用 <code>NonNullableFormBuilder</code> 讓 <code>reset()</code> 回到初始值。</li>

          <li><strong>.value 與 .getRawValue() 混淆</strong>：<code>.value</code>
          會排除 disabled 欄位，可能導致送出不完整的資料。
          一律使用 <code>getRawValue()</code> 確保取得所有欄位。</li>

          <li><strong>跨欄位驗證器位置錯誤</strong>：密碼比對驗證器應放在 <code>FormGroup</code>
          層級，而非個別 <code>FormControl</code> 層級。放錯位置會無法存取其他欄位的值。</li>

          <li><strong>FormArray track 使用索引</strong>：在 <code>@for</code> 中
          使用 <code>track $index</code> 會導致新增/移除項目時輸入欄位的值錯亂。
          應使用 <code>track item</code> 追蹤物件參考。</li>

          <li><strong>非同步驗證器的時機問題</strong>：非同步驗證器只在所有同步驗證器通過後才會執行。
          如果你預期 API 驗證應該立即觸發，請確認同步驗證已全部通過。</li>

          <li><strong>動態表單的型別遺失</strong>：使用 <code>form.get('fieldName')</code>
          回傳 <code>AbstractControl | null</code>，型別資訊丟失。
          改用 <code>form.controls.fieldName</code> 保持完整型別。</li>

          <li><strong>表單更新未觸發 OnPush 變更偵測</strong>：使用 <code>patchValue()</code>
          或 <code>setValue()</code> 更新表單時，若元件使用 <code>OnPush</code>，
          需確保觸發變更偵測。使用 Signal 或 <code>markForCheck()</code> 來解決。</li>
        </ol>
      `,
      codeExamples: [
        {
          filename: 'form-pitfall-examples.ts',
          language: 'typescript',
          code: `// ❌ Pitfall 2: reset() produces null values
const fb = inject(FormBuilder);
const form = fb.group({ name: ['Alice'] });
form.reset();
console.log(form.value.name); // null — breaks downstream code

// ✅ Fix: use NonNullableFormBuilder
const nnfb = inject(NonNullableFormBuilder);
const form = nnfb.group({ name: ['Alice'] });
form.reset();
console.log(form.value.name); // 'Alice' — initial value preserved

// ❌ Pitfall 3: .value excludes disabled fields
form.controls.email.disable();
console.log(form.value); // { name: '...' } — email is missing!

// ✅ Fix: use getRawValue()
console.log(form.getRawValue()); // { name: '...', email: '...' }

// ❌ Pitfall 4: cross-field validator on wrong level
const form = fb.group({
  password: ['', [passwordMatch]],       // ❌ cannot access confirmPassword
  confirmPassword: [''],
});

// ✅ Fix: apply at group level
const form = fb.group(
  { password: [''], confirmPassword: [''] },
  { validators: [passwordMatch] },       // ✅ can access both fields
);

// ❌ Pitfall 7: type loss with form.get()
const ctrl = form.get('name');           // AbstractControl | null

// ✅ Fix: use .controls property
const ctrl = form.controls.name;         // FormControl<string> — fully typed`,
          annotation: '常見表單陷阱的對照修正。注意 NonNullableFormBuilder 和 getRawValue() 的重要性。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: '永遠不要在 OnPush 元件中使用 form.get() 取得控制項——它沒有型別且容易拼錯。使用 form.controls.xxx 取得完整型別支援和 IDE 自動完成。',
        },
        {
          type: 'dotnet-comparison',
          content: '在 .NET Blazor 中，EditForm 的驗證是在 Model 層定義（DataAnnotations），表單 reset 不會有 null 問題。Angular 的 NonNullableFormBuilder 就是為了達到類似的開發體驗——讓 reset 行為符合直覺。',
        },
      ],
    },
  ],
};

@Component({
  selector: 'app-ch06',
  imports: [GuidePage],
  template: '<app-guide-page [chapter]="chapter" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ch06Forms {
  protected readonly chapter = CHAPTER;
}
