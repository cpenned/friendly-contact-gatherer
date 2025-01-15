import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is required");
}

const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface EmailRequest {
  to: string;
  name: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    const { to, name }: EmailRequest = await req.json();
    
    console.log(`Starting email send process for ${name} (${to})`);
    
    if (!to || !name) {
      throw new Error("Missing required fields: to and name are required");
    }

    const emailData = {
      from: "My Loveable App <onboarding@updates.loveable-resend.online>",
      to: [to],
      subject: "We received your message",
      html: `
        <h1>Thank you for your message, ${name}!</h1>
        <p>We have received your message and will get back to you soon.</p>
        <p>Best regards,<br/>The Team</p>
      `,
    };
    
    console.log("Attempting to send email with data:", JSON.stringify(emailData, null, 2));
    
    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error("Resend API error:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send confirmation email", 
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);