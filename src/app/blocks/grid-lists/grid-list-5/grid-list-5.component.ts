/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-5`
*/

import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';
import { integrations } from './grid-list-5.model';

// Brand icon SVG constants
const GOOGLE_DRIVE_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 -3 48 48" version="1.1">
    
    <title>drive-color</title>
    <desc>Created with Sketch.</desc>
    <defs>

</defs>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Color-" transform="translate(-601.000000, -955.000000)">
            <g id="drive" transform="translate(601.000000, 955.000000)">
                <polygon id="Shape" fill="#3777E3" points="8.00048064 42 15.9998798 28 48 28 39.9998798 42">

</polygon>
                <polygon id="Shape" fill="#FFCF63" points="32.0004806 28 48 28 32.0004806 0 15.9998798 0">

</polygon>
                <polygon id="Shape" fill="#11A861" points="0 28 8.00048064 42 24 14 15.9998798 0">

</polygon>
            </g>
        </g>
    </g>
</svg>
`;

const FACEBOOK_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 0 48 48" version="1.1">
    
    <title>Facebook-color</title>
    <desc>Created with Sketch.</desc>
    <defs>

</defs>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Color-" transform="translate(-200.000000, -160.000000)" fill="#4460A0">
            <path d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z" id="Facebook">

</path>
        </g>
    </g>
</svg>
`;

const NOTION_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 32 32">
  <path d="M5.948 5.609c0.99 0.807 1.365 0.75 3.234 0.625l17.62-1.057c0.375 0 0.063-0.375-0.063-0.438l-2.927-2.115c-0.557-0.438-1.307-0.932-2.74-0.813l-17.057 1.25c-0.625 0.057-0.75 0.37-0.5 0.62zM7.005 9.719v18.536c0 0.995 0.495 1.37 1.615 1.307l19.365-1.12c1.12-0.063 1.25-0.745 1.25-1.557v-18.411c0-0.813-0.313-1.245-1-1.182l-20.234 1.182c-0.75 0.063-0.995 0.432-0.995 1.24zM26.12 10.708c0.125 0.563 0 1.12-0.563 1.188l-0.932 0.188v13.682c-0.813 0.438-1.557 0.688-2.177 0.688-1 0-1.25-0.313-1.995-1.245l-6.104-9.583v9.271l1.932 0.438c0 0 0 1.12-1.557 1.12l-4.297 0.25c-0.125-0.25 0-0.875 0.438-0.995l1.12-0.313v-12.255l-1.557-0.125c-0.125-0.563 0.188-1.37 1.057-1.432l4.609-0.313 6.354 9.708v-8.589l-1.62-0.188c-0.125-0.682 0.37-1.182 0.995-1.24zM2.583 1.38l17.745-1.307c2.177-0.188 2.74-0.063 4.109 0.932l5.667 3.984c0.932 0.682 1.245 0.87 1.245 1.615v21.839c0 1.37-0.5 2.177-2.24 2.302l-20.615 1.245c-1.302 0.063-1.927-0.125-2.615-0.995l-4.172-5.417c-0.745-0.995-1.057-1.74-1.057-2.609v-19.411c0-1.12 0.5-2.052 1.932-2.177z"/>
</svg>
`;

const SLACK_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 16 16" fill="none">

<g fill-rule="evenodd" clip-rule="evenodd">

<path fill="#E01E5A" d="M2.471 11.318a1.474 1.474 0 001.47-1.471v-1.47h-1.47A1.474 1.474 0 001 9.846c.001.811.659 1.469 1.47 1.47zm3.682-2.942a1.474 1.474 0 00-1.47 1.471v3.683c.002.811.66 1.468 1.47 1.47a1.474 1.474 0 001.47-1.47V9.846a1.474 1.474 0 00-1.47-1.47z"/>

<path fill="#36C5F0" d="M4.683 2.471c.001.811.659 1.469 1.47 1.47h1.47v-1.47A1.474 1.474 0 006.154 1a1.474 1.474 0 00-1.47 1.47zm2.94 3.682a1.474 1.474 0 00-1.47-1.47H2.47A1.474 1.474 0 001 6.153c.002.812.66 1.469 1.47 1.47h3.684a1.474 1.474 0 001.47-1.47z"/>

<path fill="#2EB67D" d="M9.847 7.624a1.474 1.474 0 001.47-1.47V2.47A1.474 1.474 0 009.848 1a1.474 1.474 0 00-1.47 1.47v3.684c.002.81.659 1.468 1.47 1.47zm3.682-2.941a1.474 1.474 0 00-1.47 1.47v1.47h1.47A1.474 1.474 0 0015 6.154a1.474 1.474 0 00-1.47-1.47z"/>

<path fill="#ECB22E" d="M8.377 9.847c.002.811.659 1.469 1.47 1.47h3.683A1.474 1.474 0 0015 9.848a1.474 1.474 0 00-1.47-1.47H9.847a1.474 1.474 0 00-1.47 1.47zm2.94 3.682a1.474 1.474 0 00-1.47-1.47h-1.47v1.47c.002.812.659 1.469 1.47 1.47a1.474 1.474 0 001.47-1.47z"/>

</g>

</svg>
`;

const DROPBOX_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 -19 256 256" version="1.1" preserveAspectRatio="xMidYMid">
		<g fill="#0061FF">
				<polygon points="63.9945638 0 0 40.7712563 63.9945638 81.5425125 128 40.7712563">

</polygon>
				<polygon points="192.000442 0 128 40.7750015 192.000442 81.5500031 256.000885 40.7750015">

</polygon>
				<polygon points="0 122.321259 63.9945638 163.092516 128 122.321259 63.9945638 81.5500031">

</polygon>
				<polygon points="192 81.5500031 128 122.324723 192 163.099442 256 122.324723">

</polygon>
				<polygon points="64 176.771256 128.005436 217.542513 192 176.771256 128.005436 136">

</polygon>
		</g>
</svg>
`;

@Component({
  selector: 'ngm-dev-block-grid-list-5',
  templateUrl: './grid-list-5.component.html',
  imports: [MatCardModule, MatIconModule, MatDividerModule, MatButtonModule],
})
export class GridList5Component {
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  integrations = integrations;

  constructor() {
    this.registerIcons();
  }

  private registerIcons(): void {
    // Google Drive icon
    this.matIconRegistry.addSvgIconLiteral(
      'brand-drive',
      this.domSanitizer.bypassSecurityTrustHtml(GOOGLE_DRIVE_ICON),
    );

    // Facebook icon
    this.matIconRegistry.addSvgIconLiteral(
      'brand-facebook',
      this.domSanitizer.bypassSecurityTrustHtml(FACEBOOK_ICON),
    );

    // Notion icon
    this.matIconRegistry.addSvgIconLiteral(
      'brand-notion',
      this.domSanitizer.bypassSecurityTrustHtml(NOTION_ICON),
    );

    // Slack icon
    this.matIconRegistry.addSvgIconLiteral(
      'brand-slack',
      this.domSanitizer.bypassSecurityTrustHtml(SLACK_ICON),
    );

    // Dropbox icon
    this.matIconRegistry.addSvgIconLiteral(
      'brand-dropbox',
      this.domSanitizer.bypassSecurityTrustHtml(DROPBOX_ICON),
    );
  }
}
