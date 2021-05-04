export interface SendSMS {
  Message: string;
  PhoneNumber: string;
}
export interface SendEmail {
  to: string;
  subject: string;
  text: string;
}
