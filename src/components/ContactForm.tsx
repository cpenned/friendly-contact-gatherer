import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormFields, formSchema } from "./contact/FormFields";
import { SubmitButton } from "./contact/SubmitButton";

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // First, store the message in Supabase
      const { error: dbError } = await supabase
        .from("contact_messages")
        .insert({
          name: values.name,
          email: values.email,
          message: values.message,
        });

      if (dbError) throw dbError;

      // Then, send the confirmation email with retries
      const maxRetries = 3;
      let attempt = 0;
      let emailError = null;

      while (attempt < maxRetries) {
        try {
          const { error } = await supabase.functions.invoke(
            "send-confirmation-email",
            {
              body: {
                to: values.email,
                name: values.name,
              },
            }
          );

          if (!error) {
            toast({
              title: "Message sent!",
              description:
                "Thank you for contacting us. We've sent you a confirmation email.",
            });
            form.reset();
            return;
          }

          emailError = error;
          attempt++;
          
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        } catch (err) {
          console.error(`Attempt ${attempt + 1} failed:`, err);
          emailError = err;
          attempt++;
          
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }

      console.error("Final email error after retries:", emailError);
      toast({
        title: "Message sent!",
        description:
          "Your message was received, but we couldn't send you a confirmation email.",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormFields form={form} />
        <SubmitButton isSubmitting={form.formState.isSubmitting} />
      </form>
    </Form>
  );
}