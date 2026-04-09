import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';

/**
 * Stepper 6 — Editable Steps with Header Position Bottom
 * 4 editable steps with headerPosition="bottom".
 * Steps: upload, preview, description, publish.
 */
@Component({
  selector: 'app-stepper-6',
  imports: [
    MatStepperModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  styles: `
    :host {
      display: block;
      padding: 1.5rem;
    }
    .step-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem 0;
    }
    .step-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .placeholder-box {
      border: 2px dashed var(--mat-sys-outline-variant);
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      color: var(--mat-sys-on-surface-variant);
    }
  `,
  template: `
    <mat-stepper headerPosition="bottom">
      <!-- Step 1: Upload -->
      <mat-step [editable]="true" label="上傳檔案">
        <div class="step-content">
          <div class="placeholder-box">
            <p>將檔案拖曳至此處，或點擊選擇檔案</p>
          </div>
          <div class="step-actions">
            <button mat-flat-button matStepperNext type="button">下一步</button>
          </div>
        </div>
      </mat-step>

      <!-- Step 2: Preview -->
      <mat-step [editable]="true" label="預覽">
        <div class="step-content">
          <div class="placeholder-box">
            <p>檔案預覽區域</p>
          </div>
          <div class="step-actions">
            <button mat-button matStepperPrevious type="button">上一步</button>
            <button mat-flat-button matStepperNext type="button">下一步</button>
          </div>
        </div>
      </mat-step>

      <!-- Step 3: Description -->
      <mat-step [editable]="true" label="描述">
        <div class="step-content">
          <div class="placeholder-box">
            <p>請為您的檔案新增描述與標籤</p>
          </div>
          <div class="step-actions">
            <button mat-button matStepperPrevious type="button">上一步</button>
            <button mat-flat-button matStepperNext type="button">下一步</button>
          </div>
        </div>
      </mat-step>

      <!-- Step 4: Publish -->
      <mat-step [editable]="true" label="發佈">
        <div class="step-content">
          <div class="placeholder-box">
            <p>確認所有內容無誤後，點擊發佈按鈕</p>
          </div>
          <div class="step-actions">
            <button mat-button matStepperPrevious type="button">上一步</button>
            <button mat-flat-button type="button">發佈</button>
          </div>
        </div>
      </mat-step>
    </mat-stepper>
  `,
})
export class Stepper6Component {}
