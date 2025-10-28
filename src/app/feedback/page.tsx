import FeedbackForm from '@/components/FeedbackForm';

export const metadata = {
  title: 'Client Feedback Form - Portfolio',
  description: 'Share your feedback and experience working with us',
};

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-background">
      <FeedbackForm />
    </div>
  );
}

