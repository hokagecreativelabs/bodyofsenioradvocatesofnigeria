import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';

export const InvitationEmail = ({
  userName = 'BOSAN Member',
  activationLink = 'https://example.com/activate',
}) => (
  <Html>
    <Head />
    <Preview>Activate your BOSAN Portal account</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>BOSAN Portal Invitation</Heading>
        <Text style={text}>Dear {userName},</Text>
        <Text style={text}>
          You've been invited to activate your BOSAN portal account. Please click
          the button below to activate your account.
        </Text>
        <Link
          href={activationLink}
          style={button}
          target="_blank"
        >
          Activate Account
        </Link>
        <Text style={text}>
          This link will expire in 3 days. If you have any questions, please contact
          the BOSAN Secretariat.
        </Text>
        <Text style={footer}>Regards,<br />BOSAN Secretariat</Text>
      </Container>
    </Body>
  </Html>
);

export default InvitationEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  borderRadius: '5px',
  margin: '0 auto',
  padding: '20px',
  width: '550px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0',
  textAlign: 'center',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '5px',
  color: '#fff',
  display: 'block',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '30px auto',
  padding: '12px 20px',
  textAlign: 'center',
  textDecoration: 'none',
  width: '200px',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '32px 0 0',
};