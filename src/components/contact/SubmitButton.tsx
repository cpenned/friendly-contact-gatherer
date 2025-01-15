import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type SubmitButtonProps = {
  isSubmitting: boolean;
};

export const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full md:w-auto"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="animate-spin" />
          Sending...
        </>
      ) : (
        'Send Message'
      )}
    </Button>
  );
};