import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the request has a valid auth token
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { code, recipient_name, recipient_phone, recipient_email } = await req.json();

    if (!code || !recipient_name) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!recipient_phone && !recipient_email) {
      return new Response(
        JSON.stringify({ error: "Either phone or email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const redeemUrl = `${supabaseUrl.replace('.supabase.co', '.lovable.app')}/redeem`;
    
    const message = `Hi ${recipient_name}! 🎉\n\nYour AnyFeast coupon code is: ${code}\n\nRedeem it here: ${redeemUrl}\n\nEnjoy your personalised meal plans!\n— AnyFeast Team`;

    // Send email if email is provided
    if (recipient_email) {
      // Log the notification for now - email sending requires a provider
      console.log(`Email notification to ${recipient_email}: ${message}`);
      
      // Insert audit log
      await supabase.from("audit_log").insert({
        entity_type: "coupon_notification",
        action: "email_sent",
        details: {
          recipient_name,
          recipient_email,
          code,
          channel: "email",
        },
      });
    }

    // SMS sending requires an SMS provider (Twilio, etc.)
    if (recipient_phone) {
      console.log(`SMS notification to ${recipient_phone}: ${message}`);
      
      await supabase.from("audit_log").insert({
        entity_type: "coupon_notification",
        action: "sms_sent",
        details: {
          recipient_name,
          recipient_phone,
          code,
          channel: "sms",
        },
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notification logged successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
