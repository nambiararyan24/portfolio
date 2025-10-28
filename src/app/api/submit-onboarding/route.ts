import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Insert into leads table (reusing existing leads table structure)
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name: body.client_name.trim(),
        email: body.email.trim(),
        phone: body.phone.trim(),
        company: body.company.trim(),
        project_type: body.project_type.trim(),
        budget_range: body.budget_range.trim(),
        timeline: body.timeline.trim(),
        preferred_contact_method: body.preferred_contact.trim(),
        message: `Project Description: ${body.project_description}\n\nGoals: ${body.project_goals}\n\nTarget Audience: ${body.target_audience}\n\nExisting Website: ${body.existing_website || 'Not provided'}\n\nFeatures Needed: ${body.features_needed?.join(', ') || 'None selected'}\n\nDesign Style: ${body.design_style || 'Not specified'}\n\nDesign Inspiration: ${body.inspiration_links || 'None provided'}\n\nDesign Elements to Avoid: ${body.design_avoid || 'None'}\n\nHow they heard about us: ${body.how_hear || 'Not specified'}\n\nAdditional Info: ${body.additional_info || 'None'}\n\nNewsletter Signup: ${body.newsletter_signup ? 'Yes' : 'No'}`,
        newsletter_signup: body.newsletter_signup || false,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: `Failed to submit onboarding: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

