import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "https://esm.sh/@react-email/components@0.0.7";
import { render } from "https://esm.sh/@react-email/render@0.0.7";

interface EmailTemplateProps {
  name: string;
}

export const EmailTemplate = ({ name }: EmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>Thank you for contacting us!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thank you for contacting us, {name}!</Heading>
        <Text style={text}>
          We have received your message and will get back to you as soon as possible.
        </Text>
        <Text style={text}>
          Best regards,<br />Your Team
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "normal",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

export const generateEmailHtml = async (props: EmailTemplateProps) => {
  try {
    const html = render(<EmailTemplate {...props} />);
    return html;
  } catch (error) {
    console.error("Error generating email HTML:", error);
    throw error;
  }
};