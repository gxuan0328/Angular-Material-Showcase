/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-20`
*/

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

type FAQ = {
  question: string;
  answer: string;
};

@Component({
  selector: 'ngm-dev-block-feature-section-20',
  templateUrl: './feature-section-20.component.html',
  imports: [MatExpansionModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection20Component {
  faqs: FAQ[] = [
    {
      question: 'Is there a learning curve?',
      answer:
        'Not at all! Our platform is designed to be intuitive. Most users are productive within their first hour. We also provide comprehensive tutorials and documentation.',
    },
    {
      question: 'Can I import my existing data?',
      answer:
        'Absolutely! We support importing from most popular platforms. Our migration tools make it easy to transfer your data securely.',
    },
    {
      question: 'What happens to my data if I cancel?',
      answer:
        'Your data remains accessible for 30 days after cancellation. You can export everything at any time in standard formats.',
    },
    {
      question: 'Do you offer training sessions?',
      answer:
        'Yes! We provide free onboarding sessions for all plans, and advanced training workshops for Enterprise customers.',
    },
    {
      question: 'How secure is my data?',
      answer:
        'Security is our top priority. We use end-to-end encryption, regular security audits, and comply with SOC 2, GDPR, and HIPAA standards.',
    },
  ];
}
