declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }

declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number
    spread?: number
    origin?: { x?: number; y?: number }
    colors?: string[]
    [key: string]: any
  }
  
  function confetti(options?: ConfettiOptions): void
  export default confetti
}

declare module 'nodemailer' {
  interface TransportOptions {
    host?: string
    port?: number
    secure?: boolean
    auth?: {
      user?: string
      pass?: string
    }
  }
  
  interface MailOptions {
    from?: string
    to?: string
    subject?: string
    html?: string
    text?: string
  }
  
  interface Transporter {
    sendMail(mailOptions: MailOptions): Promise<any>
  }
  
  export function createTransport(options: TransportOptions): Transporter
}