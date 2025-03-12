import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BookDemoDto } from '../dto/demo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BookDemo, BookDemoDocument } from '../schema/demo.schema';
import { Model } from 'mongoose';
import { ENVIRONMENT } from 'src/common/constant/enivronment/enviroment';
import { ResponseMessage } from 'src/common/constant/message/message.constant';
import { EmailService } from 'src/common/email.service';

@Injectable()
export class BookDemoService {
  constructor(
    @InjectModel(BookDemo.name) private demoModel: Model<BookDemoDocument>,
    private readonly emailService : EmailService
  ) {}

  async bookdemo(payload: BookDemoDto) {
    const {
      full_Name,
      pick_date,
      company_name,
      knowUs,
      employeeCount,
      email,
      job_title,
      phoneNumber,
    } = payload;
    const demo = await this.demoModel.create({ ...payload });
    if (!demo) {
      throw new InternalServerErrorException('Error Server');
    }

    const ownerEmail = ENVIRONMENT.OWNER.OWNER_EMAIL;
    const demoBooker = await this.emailService.sendMail(
      demo.email,
      ResponseMessage.demoSubject,
      await ResponseMessage.responseToBooker(pick_date),
    );

    // if (demoBooker) {
    //   await this.emailService.sendMail(
    //     ownerEmail,
    //     ResponseMessage.demoSubject,
    //     ResponseMessage.toOwnerDemoTemplate(
    //       full_Name,
    //       pick_date,
    //       company_name,
    //       phoneNumber,
    //       knowUs,
    //       employeeCount,
    //       email,
    //       job_title,
    //     ),
    //   );
    // }

    return `Demo Booked Successfully`;
  }
}
