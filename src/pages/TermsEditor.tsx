{`import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Editor } from '@tinymce/tinymce-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const initialContent = \`
<h2 class="font-bold mb-2">Terms and Conditions</h2>
<p class="mb-2">These Terms and Conditions govern your use of Frame ji (framejl.com) and the services offered by NeonFlake Enterprises OPC Pvt Ltd.</p>

<h3 class="font-bold mb-2 mt-4">1. Acceptance of Terms</h3>
<p class="mb-2">By accessing and using our website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.</p>

<h3 class="font-bold mb-2 mt-4">2. Products and Services</h3>
<ul class="list-disc pl-5 space-y-1">
  <li>Frame ji provides personalized 3D-printed photo frames with custom text integration</li>
  <li>All products are made to order based on customer specifications</li>
  <li>Product images on the website are for illustration purposes and may vary slightly from the final product</li>
  <li>Colors may appear differently on different screens; slight variations in the final product are normal</li>
</ul>

<h3 class="font-bold mb-2 mt-4">3. Ordering and Payment</h3>
<ul class="list-disc pl-5 space-y-1">
  <li>All prices are in Indian Rupees (INR) and inclusive of applicable taxes</li>
  <li>Orders are confirmed only after successful payment</li>
  <li>We accept payment through authorized payment gateways</li>
  <li>Your order may be canceled if payment verification fails</li>
</ul>

<h3 class="font-bold mb-2 mt-4">4. Intellectual Property</h3>
<ul class="list-disc pl-5 space-y-1">
  <li>All content on framejl.com is the property of NeonFlake Enterprises OPC Pvt Ltd</li>
  <li>The Frame ji brand name, logo, and designs are protected by intellectual property laws</li>
  <li>Users may not copy, reproduce, or use our designs without written permission</li>
</ul>

<h3 class="font-bold mb-2 mt-4">5. User Responsibilities</h3>
<ul class="list-disc pl-5 space-y-1">
  <li>Provide accurate information for order processing</li>
  <li>Ensure submitted content (text, images) doesn't violate any laws or third-party rights</li>
  <li>Maintain account security and confidentiality</li>
  <li>Use the website in compliance with applicable laws</li>
</ul>

<h3 class="font-bold mb-2 mt-4">6. Limitation of Liability</h3>
<p class="mb-2">NeonFlake Enterprises OPC Pvt Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.</p>
\`;

const TermsEditor: React.FC = () => {
  const navigate = useNavigate();
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedContent, setSavedContent] = useState(initialContent);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('content')
          .select('content')
          .eq('id', 'terms')
          .maybeSingle();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (data?.content) {
          setSavedContent(data.content);
        }
      } catch (error: any) {
        console.error('Error fetching terms:', error);
        toast.error('Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async () => {
    if (!editorRef.current) return;
    
    try {
      const content = editorRef.current.getContent();

      const { data: existingData, error: checkError } = await supabase
        .from('content')
        .select('id')
        .eq('id', 'terms')
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing content:', checkError);
        throw checkError;
      }

      let error;
      
      if (existingData) {
        const { error: updateError } = await supabase
          .from('content')
          .update({ 
            content: content,
            updated_at: new Date().toISOString()
          })
          .eq('id', 'terms');
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('content')
          .insert({ 
            id: 'terms',
            content: content,
            updated_at: new Date().toISOString()
          });
        error = insertError;
      }

      if (error) {
        console.error('Save operation failed:', error);
        throw error;
      }

      toast.success('Terms saved successfully');
      setSavedContent(content);
      navigate('/settings');
    } catch (error: any) {
      console.error('Error saving terms:', error);
      toast.error(
        error.message 
          ? \`Failed to save: \${error.message}\` 
          : 'Failed to save terms. Please try again.'
      );
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Button
          onClick={handleSave}
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Save'}
        </Button>
        <Button
          onClick={() => navigate('/settings')}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          disabled={isLoading}
        >
          Back
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Terms and Conditions</h2>
          {isLoading ? (
            <div className="h-[500px] flex items-center justify-center bg-gray-50 rounded-md">
              <p className="text-gray-500">Loading editor...</p>
            </div>
          ) : (
            <>
              <div className="mb-2">
                <label className="text-sm text-gray-600">Body</label>
              </div>
              <Editor
                apiKey="kw7kx2lt3nplhyg9nl328rrwc1qblygubse4aqewi5q17i11"
                onInit={(_evt, editor) => {
                  editorRef.current = editor;
                  const container = editor.getContainer() as HTMLElement;
                  container.style.border = '1px solid #e5e7eb';
                  container.style.borderRadius = '0.375rem';
                  
                  const toolbar = container.querySelector('.tox-toolbar-overlord') as HTMLElement;
                  if (toolbar) {
                    toolbar.style.backgroundColor = '#f9fafb';
                    toolbar.style.borderBottom = '1px solid #e5e7eb';
                  }

                  const editor_container = container.querySelector('.tox-edit-area__iframe') as HTMLElement;
                  if (editor_container) {
                    editor_container.style.backgroundColor = '#ffffff';
                  }
                }}
                initialValue={savedContent}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: ['lists'],
                  readonly: false,
                  toolbar: [
                    { name: 'styles', items: ['formatselect'] },
                    { name: 'fontfamily', items: ['fontselect'] },
                    { name: 'fontsize', items: ['fontsizeselect'] },
                    { name: 'formatting', items: ['bold', 'italic', 'underline'] },
                    { name: 'alignment', items: ['alignleft', 'aligncenter', 'alignright'] },
                    { name: 'lists', items: ['bullist', 'numlist'] },
                    { name: 'indentation', items: ['outdent', 'indent'] },
                    { name: 'script', items: ['superscript', 'subscript'] }
                  ],
                  content_style: \`
                    body {
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                      font-size: 14px;
                      line-height: 1.5;
                      padding: 1rem;
                      color: #374151;
                    }
                  \`,
                  font_formats: 'Normal=sans-serif',
                  fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt',
                  block_formats: 'Normal=p',
                  formats: {
                    bold: { inline: 'strong' },
                    italic: { inline: 'em' },
                    underline: { inline: 'span', styles: { 'text-decoration': 'underline' } },
                  },
                  statusbar: false,
                  branding: false,
                  promotion: false,
                  toolbar_sticky: true,
                  resize: false,
                  skin: 'oxide',
                  toolbar_mode: 'wrap'
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsEditor;`}