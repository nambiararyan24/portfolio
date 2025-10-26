import { useEffect, useRef } from 'react';

interface FormAnalyticsOptions {
  formName: string;
  trackAbandonment?: boolean;
  trackFieldInteractions?: boolean;
}

export function useFormAnalytics(options: FormAnalyticsOptions) {
  const { formName, trackAbandonment = true, trackFieldInteractions = true } = options;
  const startTime = useRef<number>(Date.now());
  const fieldInteractions = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Track form start
    console.log(`Form ${formName} started`);

    return () => {
      // Track form completion or abandonment
      const timeSpent = Date.now() - startTime.current;
      console.log(`Form ${formName} session ended. Time spent: ${timeSpent}ms`);
    };
  }, [formName]);

  const trackFieldFocus = (fieldName: string) => {
    if (trackFieldInteractions) {
      fieldInteractions.current.add(fieldName);
      console.log(`Field ${fieldName} focused in form ${formName}`);
    }
  };

  const trackFieldBlur = (fieldName: string, value: string) => {
    if (trackFieldInteractions) {
      console.log(`Field ${fieldName} completed with value length: ${value.length}`);
    }
  };

  const trackFormSubmit = (success: boolean, error?: string) => {
    const timeSpent = Date.now() - startTime.current;
    const fieldsInteracted = fieldInteractions.current.size;
    
    console.log(`Form ${formName} submitted:`, {
      success,
      timeSpent,
      fieldsInteracted,
      error,
    });
  };

  const trackFormAbandonment = () => {
    if (trackAbandonment) {
      const timeSpent = Date.now() - startTime.current;
      const fieldsInteracted = fieldInteractions.current.size;
      
      console.log(`Form ${formName} abandoned:`, {
        timeSpent,
        fieldsInteracted,
      });
    }
  };

  return {
    trackFieldFocus,
    trackFieldBlur,
    trackFormSubmit,
    trackFormAbandonment,
  };
}

