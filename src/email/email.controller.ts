import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from 'src/common/email.service';
import { TestEmailDto } from './dto/test-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  async testEmail(@Body() body: TestEmailDto) {
    const { to, subject, content } = body;
    await this.emailService.sendMail(to, subject, content);
    return { message: 'Email sent', to };
  }
}
