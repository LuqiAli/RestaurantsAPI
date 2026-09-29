import { Resend } from 'resend';
import { RESEND_API_KEY } from '../config/env';
import { authTypes } from '../schemas/auth.schema';

const resend = new Resend(RESEND_API_KEY);

export async function sendVerificationEmail(email: authTypes["emailSchema"], token: authTypes["tokenSchema"]) {

    try {

        const verificationUrl = `localhost:5000/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`
        
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verify your email address',
            html: `
                <h1>Verify your email address</h1>

                <p>
                    Thanks for creating an account.
                    Please click the link below to verify your email address.
                </p>

                <p>
                    <a href="${verificationUrl}">
                        Verify email - ${verificationUrl}
                    </a>
                </p>

                <p>
                    This link will expire after 1 hour.
                </p>
            `
        });  
        
    } catch (err) {
        console.log(err)
        throw new Error(`Failed to send verification email: ${err}`);
    }
}

export async function sendPasswordResetEmail(email: authTypes["emailSchema"], token: authTypes["tokenSchema"]) {

    try {

        const resetUrl = `localhost:5000/api/v1/auth/reset-password?token=${encodeURIComponent(token)}`
        
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Reset your password',
            html: `
                <h1>Reset your password</h1>

                <p>
                    We received a request to reset your password.
                </p>

                <p>
                    <a href="${resetUrl}">
                        Verify email - ${resetUrl}
                    </a>
                </p>

                <p>
                    This link will expire after 1 hour.
                </p>

                <p>
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>
            `
        });  
        
    } catch (err) {
        console.log(err)
        throw new Error(`Failed to send password reset email: ${err}`);
    }
}