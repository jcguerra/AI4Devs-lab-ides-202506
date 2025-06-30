import nodemailer from 'nodemailer';
import { Candidate } from '@prisma/client';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailOptions {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private defaultFrom: string;

  constructor() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '1025'),
      secure: false, // Mailpit no usa SSL/TLS
      auth: undefined // Mailpit no requiere autenticación en desarrollo
    };

    this.defaultFrom = process.env.EMAIL_FROM || 'ATS Sistema <ats@company.com>';
    
    this.transporter = nodemailer.createTransport(config);
  }

  /**
   * Enviar email genérico
   */
  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email enviado exitosamente a ${options.to}:`, result.messageId);
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      throw new Error(`Error enviando email: ${error}`);
    }
  }

  /**
   * Notificar creación de candidato
   */
  async notifyCandidateCreated(candidate: Candidate, recruiterEmail: string): Promise<void> {
    const template = this.getCandidateCreatedTemplate(candidate);
    
    await this.sendEmail({
      to: recruiterEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  /**
   * Notificar candidato al candidato mismo
   */
  async notifyCandidateWelcome(candidate: Candidate): Promise<void> {
    const template = this.getCandidateWelcomeTemplate(candidate);
    
    await this.sendEmail({
      to: candidate.email,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  /**
   * Notificar actualización de candidato
   */
  async notifyCandidateUpdated(candidate: Candidate, recruiterEmail: string): Promise<void> {
    const template = this.getCandidateUpdatedTemplate(candidate);
    
    await this.sendEmail({
      to: recruiterEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  /**
   * Verificar conexión con el servidor de email
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Conexión SMTP verificada exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error verificando conexión SMTP:', error);
      return false;
    }
  }

  /**
   * Plantilla para candidato creado (para reclutador)
   */
  private getCandidateCreatedTemplate(candidate: Candidate): EmailTemplate {
    const subject = `Nuevo Candidato Registrado: ${candidate.firstName} ${candidate.lastName}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f8f9fa; }
            .candidate-info { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Nuevo Candidato en el ATS</h1>
            </div>
            <div class="content">
              <p>Se ha registrado un nuevo candidato en el sistema ATS.</p>
              
              <div class="candidate-info">
                <h3>📋 Información del Candidato</h3>
                <p><strong>Nombre:</strong> ${candidate.firstName} ${candidate.lastName}</p>
                <p><strong>Email:</strong> ${candidate.email}</p>
                <p><strong>Teléfono:</strong> ${candidate.phone}</p>
                <p><strong>Dirección:</strong> ${candidate.address}</p>
                <p><strong>Fecha de registro:</strong> ${new Date(candidate.createdAt).toLocaleDateString('es-ES')}</p>
              </div>
              
              <p>Puedes revisar el perfil completo en el sistema ATS.</p>
            </div>
            <div class="footer">
              <p>Sistema ATS - Gestión de Candidatos<br/>
              Este es un email automático, no responder.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Nuevo Candidato Registrado: ${candidate.firstName} ${candidate.lastName}

Información del Candidato:
- Nombre: ${candidate.firstName} ${candidate.lastName}
- Email: ${candidate.email}
- Teléfono: ${candidate.phone}
- Dirección: ${candidate.address}
- Fecha de registro: ${new Date(candidate.createdAt).toLocaleDateString('es-ES')}

Puedes revisar el perfil completo en el sistema ATS.

---
Sistema ATS - Gestión de Candidatos
Este es un email automático, no responder.
    `;

    return { subject, html, text };
  }

  /**
   * Plantilla de bienvenida para candidato
   */
  private getCandidateWelcomeTemplate(candidate: Candidate): EmailTemplate {
    const subject = `¡Bienvenido al proceso de selección, ${candidate.firstName}!`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f0fdf4; }
            .welcome-box { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ¡Bienvenido ${candidate.firstName}!</h1>
            </div>
            <div class="content">
              <div class="welcome-box">
                <p>Estimado/a <strong>${candidate.firstName} ${candidate.lastName}</strong>,</p>
                
                <p>Nos complace informarte que tu perfil ha sido registrado exitosamente en nuestro sistema de gestión de candidatos.</p>
                
                <p><strong>📝 Información registrada:</strong></p>
                <ul>
                  <li>Email: ${candidate.email}</li>
                  <li>Teléfono: ${candidate.phone}</li>
                  <li>Fecha de registro: ${new Date(candidate.createdAt).toLocaleDateString('es-ES')}</li>
                </ul>
                
                <p>Nuestro equipo de recursos humanos revisará tu perfil y te contactaremos pronto si tu experiencia coincide con alguna de nuestras oportunidades laborales.</p>
                
                <p>¡Gracias por tu interés en formar parte de nuestro equipo!</p>
              </div>
            </div>
            <div class="footer">
              <p>Equipo de Recursos Humanos<br/>
              Este es un email automático, no responder.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
¡Bienvenido ${candidate.firstName}!

Estimado/a ${candidate.firstName} ${candidate.lastName},

Nos complace informarte que tu perfil ha sido registrado exitosamente en nuestro sistema de gestión de candidatos.

Información registrada:
- Email: ${candidate.email}
- Teléfono: ${candidate.phone}
- Fecha de registro: ${new Date(candidate.createdAt).toLocaleDateString('es-ES')}

Nuestro equipo de recursos humanos revisará tu perfil y te contactaremos pronto si tu experiencia coincide con alguna de nuestras oportunidades laborales.

¡Gracias por tu interés en formar parte de nuestro equipo!

---
Equipo de Recursos Humanos
Este es un email automático, no responder.
    `;

    return { subject, html, text };
  }

  /**
   * Plantilla para candidato actualizado
   */
  private getCandidateUpdatedTemplate(candidate: Candidate): EmailTemplate {
    const subject = `Candidato Actualizado: ${candidate.firstName} ${candidate.lastName}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ea580c; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #fef7f0; }
            .update-info { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔄 Candidato Actualizado</h1>
            </div>
            <div class="content">
              <p>Se ha actualizado la información de un candidato en el sistema ATS.</p>
              
              <div class="update-info">
                <h3>📋 Candidato Actualizado</h3>
                <p><strong>Nombre:</strong> ${candidate.firstName} ${candidate.lastName}</p>
                <p><strong>Email:</strong> ${candidate.email}</p>
                <p><strong>Teléfono:</strong> ${candidate.phone}</p>
                <p><strong>Última actualización:</strong> ${new Date(candidate.updatedAt).toLocaleString('es-ES')}</p>
              </div>
              
              <p>Revisa los cambios en el sistema ATS para más detalles.</p>
            </div>
            <div class="footer">
              <p>Sistema ATS - Gestión de Candidatos<br/>
              Este es un email automático, no responder.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Candidato Actualizado: ${candidate.firstName} ${candidate.lastName}

Se ha actualizado la información de un candidato en el sistema ATS.

Candidato:
- Nombre: ${candidate.firstName} ${candidate.lastName}
- Email: ${candidate.email}
- Teléfono: ${candidate.phone}
- Última actualización: ${new Date(candidate.updatedAt).toLocaleString('es-ES')}

Revisa los cambios en el sistema ATS para más detalles.

---
Sistema ATS - Gestión de Candidatos
Este es un email automático, no responder.
    `;

    return { subject, html, text };
  }
} 