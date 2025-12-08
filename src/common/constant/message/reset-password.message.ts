export const resetPasswordMessage = async (username: string, code: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Hello ${username},</p>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">You recently requested a password reset for your Pedxo account. Please use the link below to reset your password:</p>
      <div style="margin-top: 20px;">
        <a href="https://pedxo.com/forgot-password/?code=${code}" style="display: inline-block; background-color: #ffcc00; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px;">Reset Password</a>
      </div>
      <p style="font-size: 16px; line-height: 1.5; color: #333; margin-top: 20px;"><strong>Note:</strong> If you did not request a password reset, kindly ignore this email.</p>
    </div>
  `;
};
