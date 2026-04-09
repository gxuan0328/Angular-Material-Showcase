/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/comparision-table`
*/

import { NgOptimizedImage } from '@angular/common';
import { Component, computed, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

export interface ComparisionTableDatum {
  id: string;
  img: string;
  general_information: {
    model: string;
    brand: string;
    description: string;
    best_for: string;
  };
  technical_specifications: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    optical_drive: string;
    max_resolution: string;
    target_framerate: string;
  };
  physical_characteristics: {
    dimensions_mm: string;
    weight_kg: string;
  };
}

const DATA: ComparisionTableDatum[] = [
  {
    id: 'xbox_series_s',
    img: 'https://cms-assets.xboxservices.com/assets/bf/b0/bfb06f23-4c87-4c58-b4d9-ed25d3a739b9.png?n=389964_Hero-Gallery-0_A1_857x676.png',
    general_information: {
      brand: 'Microsoft',
      model: 'Xbox Series S',
      description:
        'All-digital, smaller form factor, and lower performance and price than the Series X. 1 TB version also available.',
      best_for:
        'Budget-conscious gamers or those who prefer digital downloads.',
    },
    technical_specifications: {
      cpu: '8-core AMD Zen 2 CPU at 3.6 GHz',
      gpu: '4 TFLOPs, 20 CUs at 1.565 GHz',
      ram: '10 GB GDDR6',
      storage: '512 GB NVMe SSD',
      optical_drive: 'No',
      max_resolution: '1440p (upscaled to 4K)',
      target_framerate: '60 FPS (up to 120 FPS)',
    },
    physical_characteristics: {
      dimensions_mm: '275 x 151 x 65',
      weight_kg: '1.93',
    },
  },
  {
    id: 'xbox_series_x',
    img: 'https://cms-assets.xboxservices.com/assets/bc/40/bc40fdf3-85a6-4c36-af92-dca2d36fc7e5.png?n=642227_Hero-Gallery-0_A1_857x676.png',
    general_information: {
      brand: 'Microsoft',
      model: 'Xbox Series X',
      description:
        'Highest-performance Xbox console, includes a disc drive. 2TB version also available.',
      best_for:
        'Hardcore gamers seeking the best performance and a disc drive.',
    },
    technical_specifications: {
      cpu: '8-core AMD Zen 2 CPU at 3.8 GHz',
      gpu: '12 TFLOPs, 52 CUs at 1.825 GHz',
      ram: '16 GB GDDR6',
      storage: '1 TB NVMe SSD',
      optical_drive: '4K UHD Blu-ray',
      max_resolution: 'True 4K (up to 8K)',
      target_framerate: '60 FPS (up to 120 FPS)',
    },
    physical_characteristics: {
      dimensions_mm: '301 x 151 x 151',
      weight_kg: '4.46',
    },
  },
  {
    id: 'playstation_5',
    img: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-edition-left-image-block-01-en-24jun24?$1600px--t$',
    general_information: {
      brand: 'Sony',
      model: 'PlayStation 5',
      description:
        'Includes a disc drive, similar performance to the PS5 Digital Edition but larger and heavier.',
      best_for:
        'Gamers who want to play physical disc games and have top-tier performance.',
    },
    technical_specifications: {
      cpu: '8-core AMD Zen 2 CPU at 3.5 GHz (variable frequency)',
      gpu: '10.28 TFLOPs, 36 CUs at 2.23 GHz (variable frequency)',
      ram: '16 GB GDDR6',
      storage: '825 GB NVMe SSD (667 GB usable)',
      optical_drive: '4K UHD Blu-ray',
      max_resolution: 'True 4K (up to 8K)',
      target_framerate: '60 FPS (up to 120 FPS)',
    },
    physical_characteristics: {
      dimensions_mm: '390 x 260 x 104',
      weight_kg: '4.5',
    },
  },
  {
    id: 'playstation_5_digital_edition',
    img: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-digital-edition-right-image-block-01-en-24jun24?$1600px--t$',
    general_information: {
      brand: 'Sony',
      model: 'PlayStation 5 Digital Edition',
      description:
        'All-digital version of the PS5, same performance as the standard model but lacks an optical drive and is slightly smaller and lighter.',
      best_for:
        'Gamers who only download games and want the full PS5 performance without the disc drive.',
    },
    technical_specifications: {
      cpu: '8-core AMD Zen 2 CPU at 3.5 GHz (variable frequency)',
      gpu: '10.28 TFLOPs, 36 CUs at 2.23 GHz (variable frequency)',
      ram: '16 GB GDDR6',
      storage: '825 GB NVMe SSD (667 GB usable)',
      optical_drive: 'No',
      max_resolution: 'True 4K (up to 8K)',
      target_framerate: '60 FPS (up to 120 FPS)',
    },
    physical_characteristics: {
      dimensions_mm: '390 x 260 x 92',
      weight_kg: '3.9',
    },
  },
];

interface TransformedDataItem {
  matrix: string;
  xbox_series_s: string;
  xbox_series_x: string;
  playstation_5: string;
  playstation_5_digital_edition: string;
  category: string;
  // For first row in category, like for "Brand" in "General Information" category, it will be true, for other rows in the same category it will be false
  isFirstInCategory: boolean;
}

interface ConsoleHeaderInfo {
  id: string;
  name: string;
  image: string;
}

@Component({
  selector: 'ngm-dev-block-comparision-table',
  templateUrl: './comparision-table.component.html',
  imports: [
    MatTableModule,
    MatButton,
    MatIcon,
    MatChipListbox,
    MatChipOption,
    FormsModule,
    NgOptimizedImage,
  ],
})
export class ComparisionTableComponent {
  displayedColumns = [
    'matrix',
    'xbox_series_s',
    'xbox_series_x',
    'playstation_5',
    'playstation_5_digital_edition',
  ];

  consoleHeaders: ConsoleHeaderInfo[] = this.generateConsoleHeaders();

  dataSource = computed<TransformedDataItem[]>(() =>
    this.transformData().filter((item) =>
      this.selectedCategories().includes(item.category),
    ),
  );

  categories = [
    'General Information',
    'Technical Specifications',
    'Physical Characteristics',
  ];
  selectedCategories = model<string[]>(this.categories);

  isCategoryVisible(index: number, row: TransformedDataItem) {
    return row.isFirstInCategory;
  }

  getConsoleHeader(columnId: string) {
    return this.consoleHeaders.find((console) => console.id === columnId);
  }

  private generateConsoleHeaders(): ConsoleHeaderInfo[] {
    return DATA.map((item) => ({
      id: item.id,
      name: item.general_information.model,
      image: item.img,
    }));
  }

  private transformData(): TransformedDataItem[] {
    const result: TransformedDataItem[] = [];

    // Define the mapping of properties to display names and categories
    const propertyMappings = [
      {
        category: 'General Information',
        properties: [
          { key: 'brand', display: 'Brand' },
          { key: 'model', display: 'Model' },
          { key: 'description', display: 'Description' },
          { key: 'best_for', display: 'Best For' },
        ],
      },
      {
        category: 'Technical Specifications',
        properties: [
          { key: 'cpu', display: 'CPU' },
          { key: 'gpu', display: 'GPU' },
          { key: 'ram', display: 'RAM' },
          { key: 'storage', display: 'Storage' },
          { key: 'optical_drive', display: 'Optical Drive' },
          { key: 'max_resolution', display: 'Max Resolution' },
          { key: 'target_framerate', display: 'Target Framerate' },
        ],
      },
      {
        category: 'Physical Characteristics',
        properties: [
          { key: 'dimensions_mm', display: 'Dimensions (mm)' },
          { key: 'weight_kg', display: 'Weight (kg)' },
        ],
      },
    ];

    // Transform each category
    propertyMappings.forEach((categoryMapping) => {
      categoryMapping.properties.forEach((property, propertyIndex) => {
        const transformedItem: TransformedDataItem = {
          matrix: property.display,
          xbox_series_s: '',
          xbox_series_x: '',
          playstation_5: '',
          playstation_5_digital_edition: '',
          category: categoryMapping.category,
          isFirstInCategory: propertyIndex === 0,
        };

        // Fill in the values for each console
        DATA.forEach((item) => {
          let value = '';

          // Get the value based on the category
          if (categoryMapping.category === 'General Information') {
            value =
              item.general_information[
                property.key as keyof typeof item.general_information
              ];
          } else if (categoryMapping.category === 'Technical Specifications') {
            value =
              item.technical_specifications[
                property.key as keyof typeof item.technical_specifications
              ];
          } else if (categoryMapping.category === 'Physical Characteristics') {
            value =
              item.physical_characteristics[
                property.key as keyof typeof item.physical_characteristics
              ];
          }

          // Assign the value to the correct column based on console ID
          switch (item.id) {
            case 'xbox_series_s':
              transformedItem.xbox_series_s = value;
              break;
            case 'xbox_series_x':
              transformedItem.xbox_series_x = value;
              break;
            case 'playstation_5':
              transformedItem.playstation_5 = value;
              break;
            case 'playstation_5_digital_edition':
              transformedItem.playstation_5_digital_edition = value;
              break;
          }
        });

        result.push(transformedItem);
      });
    });

    return result;
  }
}
