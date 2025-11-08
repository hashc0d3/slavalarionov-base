import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  private readonly tochkaApiUrl = 'https://enter.tochka.com/uapi/acquiring/v1.0/payments';
  private readonly customerCode: string;
  private readonly merchantId: string;
  private readonly token: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.customerCode = this.configService.get<string>('TOCHKA_CUSTOMER_CODE') || '';
    this.merchantId = this.configService.get<string>('TOCHKA_MERCHANT_ID') || '';
    this.token = this.configService.get<string>('TOCHKA_TOKEN') || '';

    if (!this.customerCode || !this.merchantId || !this.token) {
      console.warn('Точка Банк credentials не настроены. Проверьте переменные окружения.');
    }
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    try {
      // Валидация redirectUrl - должен быть https
      let redirectUrl = createPaymentDto.redirectUrl || 'https://slavalarionov.com/success';
      if (!redirectUrl.startsWith('https://')) {
        // Если передан http, заменяем на https
        redirectUrl = redirectUrl.replace(/^http:\/\//, 'https://');
      }

      const data = {
        Data: {
          customerCode: this.customerCode,
          amount: String(createPaymentDto.amount),
          purpose: createPaymentDto.purpose,
          paymentMode: createPaymentDto.paymentMode || ['card', 'sbp'],
          redirectUrl: redirectUrl,
          merchantId: this.merchantId,
        },
      };

      const response = await firstValueFrom(
        this.httpService.post(this.tochkaApiUrl, data, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const errorData = error.response?.data || { message: error.message };

      throw new HttpException(
        {
          success: false,
          status,
          data: errorData,
        },
        status,
      );
    }
  }
}

