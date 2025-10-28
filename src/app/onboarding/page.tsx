import OnboardingForm from '@/components/OnboardingForm';

export const metadata = {
  title: 'Client Onboarding - Portfolio',
  description: 'Get started with your project - Complete our onboarding form',
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background">
      <OnboardingForm />
    </div>
  );
}

