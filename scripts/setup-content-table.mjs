import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gtydunuwdpfrxwyvwsjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWR1bnV3ZHBmcnh3eXZ3c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzY4ODMsImV4cCI6MjA2MjYxMjg4M30.pFzq0fkhv0ErLrP486-uUGfaZJlpxgRTOo9JPbTFZf0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertInitialContent() {
  try {
    const initialContent = [
      {
        id: 'privacy-policy',
        content: `Privacy Policy

1. Information We Collect
- Personal information (name, email, shipping address)
- Payment information (processed securely through payment gateways)
- Order details and preferences
- Website usage data
- Customer service communications

2. How We Use Your Information
- Process and fulfill orders
- Communicate about orders and services
- Improve our products and services
- Send promotional materials (with consent)
- Comply with legal obligations

3. Information Security
- We implement appropriate security measures
- Data is encrypted during transmission
- Access to personal information is restricted
- Regular security assessments are conducted

4. Information Sharing
We do not sell your personal information. We share information only with:
- Shipping partners for delivery
- Payment processors for transactions
- Legal authorities when required by law

5. Your Rights
- Access your personal information
- Correct inaccurate information
- Request deletion of your information
- Opt-out of marketing communications
- File complaints with relevant authorities`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'shipping-policy',
        content: `Shipping Policy

1. Processing Time
- Standard production time: 5-7 business days
- Orders are processed Monday through Friday
- Production begins after payment confirmation

2. Shipping Methods
- Standard shipping within India: 5-7 business days
- Express shipping: 1-2 business days (additional charges apply)
- International shipping currently not available

3. Shipping Costs
- Free shipping on orders above ₹950
- Standard shipping: ₹49
- Express shipping: ₹149

4. Order Tracking
- Tracking information provided via email
- Track orders through your account dashboard
- Customer service assistance available for tracking queries

5. Delivery
- Signature required for delivery
- Alternative delivery instructions can be provided during checkout
- No delivery on national holidays`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'terms-conditions',
        content: `Terms & Conditions

1. Agreement to Terms
- By accessing our service, you agree to these terms
- We reserve the right to modify these terms
- Changes will be effective immediately upon posting

2. User Responsibilities
- Provide accurate information
- Maintain account security
- Comply with applicable laws

3. Product Information
- We strive for accurate product descriptions
- Colors may vary due to monitor settings
- Prices subject to change without notice

4. Order Acceptance
- We reserve the right to refuse service
- Order confirmation subject to availability
- Pricing errors may void orders

5. Intellectual Property
- All content is our property
- No reproduction without permission
- Trademarks and logos protected`,
        updated_at: new Date().toISOString()
      }
    ];

    const { error: insertError } = await supabase
      .from('content')
      .upsert(initialContent);

    if (insertError) {
      console.error('Error inserting content:', insertError);
      return;
    }

    console.log('Initial content inserted successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

insertInitialContent();
