import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateRetailCrmOrderDto } from '../retailcrm/dto/create-retailcrm-order.dto';

@Injectable()
export class TelegramService {
  private readonly botToken: string;
  private readonly chatId: string;
  private readonly apiUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN') || '';
    this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID') || '';
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

    console.log('TelegramService инициализирован:', {
      hasBotToken: !!this.botToken,
      hasChatId: !!this.chatId,
      botTokenLength: this.botToken.length,
      chatId: this.chatId,
    });

    if (!this.botToken || !this.chatId) {
      console.warn('⚠️ Telegram credentials не настроены. Проверьте переменные окружения TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID');
    } else {
      console.log('✅ Telegram credentials настроены');
    }
  }

  /**
   * Формирует сообщение для Telegram из данных заказа
   * Поддерживает несколько товаров
   */
  private createOrderMessage(orderDto: CreateRetailCrmOrderDto): string {
    let message = '<b>1.Данные заказа:</b>\n';
    message += `Номер заказа: ${orderDto.orderNumber}\n\n`;

    // Обрабатываем каждый товар
    orderDto.items.forEach((item, index) => {
      if (orderDto.items.length > 1) {
        message += `<b>Товар ${index + 1}:</b>\n`;
      }
      message += `Модель ремешка: ${item.strapModel || 'Не указано'}\n`;
      message += `Цвет кожи: ${item.strapLeatherColor || 'Не выбран'}\n`;
      message += `Модель apple watch: ${item.appleWatchModel || 'Не указано'}\n`;
      message += `Размер корпуса Apple Watch: ${item.appleWatchModelSize || 'Не указано'}\n`;
      message += `Цвет корпуса apple watch: ${item.appleWatchModelColor || 'Не выбран'}\n`;
      message += `Цвет строчки: ${item.stitchingColor || 'Не выбран'}\n`;
      message += `Цвет края: ${item.edgeColor || 'Не выбран'}\n`;
      message += `Цвет пряжки (застежки): ${item.buckleColor || 'Не выбран'}\n`;
      message += `Цвет адаптеров (крепление к часам): ${item.adapterColor || 'Не выбран'}\n`;

      if (item.buckleButterfly?.available) {
        message += `Вид пряжки: ${item.buckleButterfly.choosen ? 'Пряжка бабочка' : 'Стандартная'}\n`;
      }

      message += `Нужны инициалы?: ${item.initials?.choosen ? `Да, (${item.initials.text || 'Текст не набран'})` : 'Нет'}\n`;
      message += `Нужна подарочная упаковка?: ${item.presentBox?.choosen ? 'Да' : 'Нет'}\n`;
      message += `Нужна открытка?: ${item.postCard?.choosen ? `Да, (${item.postCard.text || 'Текст не набран'})` : 'Нет'}\n`;
      message += `Количество: ${item.quantity || 1}\n`;
      message += `Стоимость товара: ${item.productsPrice || 0} руб\n`;
      if (item.additionalOptionsPrice && item.additionalOptionsPrice > 0) {
        message += `Стоимость доп опций: ${item.additionalOptionsPrice} руб\n`;
      }
      message += '\n';
    });

    message += '<b>2.Данные клиента:</b>\n';
    message += `ФИО: ${orderDto.receiverFullname}\n`;
    message += `Email: ${orderDto.email}\n`;
    message += `Номер телефона: ${orderDto.tel}\n\n`;

    message += '<b>3.Доставка:</b>\n';
    message += `Город доставки: ${orderDto.deliveryCity || 'Не указано'}\n`;
    message += `Способ доставки: ${orderDto.deliveryType || 'Не указано'}\n`;

    // Обработка различных типов доставки
    if (
      (orderDto.deliveryType === 'СДЭК до пункта выдачи' ||
        orderDto.deliveryType === 'Постамат OmniCDEK') &&
      orderDto.deliveryPoint
    ) {
      message += `Название пункта выдачи: ${orderDto.deliveryPoint.name || ''}\n`;
      message += `Адрес пункта выдачи: ${orderDto.deliveryPoint.address || ''}\n`;
      if (orderDto.deliveryPoint.workTime) {
        message += `Время работы пункта выдачи: ${orderDto.deliveryPoint.workTime}\n`;
      }
      if (orderDto.deliveryPoint.phone) {
        message += `Телефон пункта выдачи: ${orderDto.deliveryPoint.phone}\n`;
      }
    } else if (
      orderDto.deliveryType === 'СДЭК курьером до двери' &&
      orderDto.deliveryAddressInfo
    ) {
      message += `Улица: ${orderDto.deliveryAddressInfo.street || ''}\n`;
      message += `Дом: ${orderDto.deliveryAddressInfo.building || ''}\n`;
      message += `Квартира: ${orderDto.deliveryAddressInfo.appartament || ''}\n`;
    } else if (orderDto.deliveryType === 'Почта России 1 класс') {
      message += `Адрес: ${orderDto.mailAddress || ''}\n`;
    } else if (orderDto.deliveryType === 'Доставка курьером по Санкт-Петербургу') {
      message += `Адрес: ${orderDto.curierAddress || ''}\n`;
    }

    if (orderDto.deliveryComment) {
      message += `Комментарий к заказу: ${orderDto.deliveryComment}\n`;
    }

    message += '\n<b>4.Стоимость и оплата:</b>\n';
    // Общая стоимость всех товаров
    const totalProductsPrice = orderDto.items.reduce(
      (sum, item) => sum + (item.productsPrice || 0) * (item.quantity || 1),
      0,
    );
    const totalAdditionalOptionsPrice = orderDto.items.reduce(
      (sum, item) => sum + (item.additionalOptionsPrice || 0) * (item.quantity || 1),
      0,
    );

    message += `Стоимость товара: ${totalProductsPrice} руб\n`;
    if (totalAdditionalOptionsPrice > 0) {
      message += `Стоимость доп опций: ${totalAdditionalOptionsPrice} руб\n`;
    }
    message += `Стоимость доставки: ${orderDto.deliveryPrice || 0} руб\n`;

    if (orderDto.promo?.used) {
      message += `Скидка на товар по промокоду: ${orderDto.promo.discountValueFull || orderDto.promo.discountValue}\n`;
    }
    message += `Использованный промокод: ${orderDto.promo?.code || 'Нет'}\n`;
    message += `Итоговая сумма: ${orderDto.totalPrice || 0} руб\n`;
    message += `Способ оплаты: ${orderDto.paymentType || 'Не указано'}\n`;

    return message;
  }

  /**
   * Отправляет сообщение о заказе в Telegram
   */
  async sendOrderMessage(orderDto: CreateRetailCrmOrderDto): Promise<{ success: boolean }> {
    try {
      console.log('TelegramService.sendOrderMessage вызван');
      console.log('Проверка credentials:', {
        hasBotToken: !!this.botToken,
        hasChatId: !!this.chatId,
        apiUrl: this.apiUrl,
      });

      if (!this.botToken || !this.chatId) {
        const errorMsg = 'Telegram credentials не настроены. Проверьте переменные окружения TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID';
        console.error('❌', errorMsg);
        throw new HttpException(
          {
            success: false,
            message: errorMsg,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      console.log('Формирование сообщения для Telegram...');
      const message = this.createOrderMessage(orderDto);
      console.log('Сообщение сформировано, длина:', message.length);

      // Убеждаемся, что chat_id - строка (Telegram API требует строку)
      const chatIdString = String(this.chatId);
      
      console.log('Отправка запроса в Telegram API:', {
        url: this.apiUrl.replace(this.botToken, '***'),
        chatId: chatIdString,
        chatIdType: typeof chatIdString,
        messageLength: message.length,
      });

      const response = await firstValueFrom(
        this.httpService.post(this.apiUrl, {
          chat_id: chatIdString,
          text: message,
          parse_mode: 'HTML',
        }),
      );

      console.log('✅ Ответ от Telegram API:', {
        status: response.status,
        data: response.data,
      });

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('❌ Ошибка в TelegramService.sendOrderMessage:');
      console.error('Тип ошибки:', error.constructor.name);
      console.error('Сообщение:', error.message);
      console.error('Статус:', error.response?.status);
      console.error('Данные ответа:', error.response?.data);
      
      // Обработка специфичных ошибок Telegram API
      const telegramError = error.response?.data;
      if (telegramError) {
        if (telegramError.error_code === 400 && telegramError.description?.includes('chat not found')) {
          console.error('⚠️ ПРОБЛЕМА: Чат не найден. Проверьте:');
          console.error('   1. Правильность TELEGRAM_CHAT_ID (должен быть числом или строкой с минусом для групп)');
          console.error('   2. Бот добавлен в чат/группу');
          console.error('   3. Бот имеет права на отправку сообщений');
        } else if (telegramError.error_code === 401) {
          console.error('⚠️ ПРОБЛЕМА: Неверный токен бота. Проверьте TELEGRAM_BOT_TOKEN');
        } else if (telegramError.error_code === 403) {
          console.error('⚠️ ПРОБЛЕМА: Бот заблокирован пользователем или не имеет доступа к чату');
        }
      }
      
      console.error('Полная ошибка:', error);

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
