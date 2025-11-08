import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateRetailCrmOrderDto } from './dto/create-retailcrm-order.dto';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class RetailCrmService {
  private readonly apiToken: string;
  private readonly apiUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly telegramService: TelegramService,
  ) {
    this.apiToken = this.configService.get<string>('RETAIL_CRM_API_TOKEN') || '';
    this.apiUrl = this.configService.get<string>('RETAIL_CRM_API_URL') || '';

    if (!this.apiToken || !this.apiUrl) {
      console.warn('RetailCRM credentials не настроены. Проверьте переменные окружения.');
    }
  }

  private cleanProperties(properties: any[]) {
    return properties.filter(
      (prop) => prop.value !== '' && prop.value !== null && prop.value !== undefined,
    );
  }

  // Точная копия PHP функции array_filter_recursive
  // Удаляет только null и пустые строки '', но НЕ удаляет числа 0
  private arrayFilterRecursive(input: any): any {
    if (Array.isArray(input)) {
      const filtered = input
        .map((item) => this.arrayFilterRecursive(item))
        .filter((item) => item !== null && item !== '');
      return filtered.length > 0 ? filtered : null;
    }
    if (typeof input === 'object' && input !== null) {
      const filtered: any = {};
      for (const [key, value] of Object.entries(input)) {
        const cleaned = this.arrayFilterRecursive(value);
        // В PHP array_filter удаляет только null и '', числа 0 сохраняются
        if (cleaned !== null && cleaned !== '') {
          filtered[key] = cleaned;
        }
      }
      return Object.keys(filtered).length > 0 ? filtered : null;
    }
    // Для чисел (включая 0) - всегда сохраняем (как в PHP)
    if (typeof input === 'number') {
      return input;
    }
    // Для boolean - сохраняем
    if (typeof input === 'boolean') {
      return input;
    }
    // Удаляем только null и пустые строки
    return input !== null && input !== '' ? input : null;
  }

  async createOrder(orderDto: CreateRetailCrmOrderDto) {
    try {
      // Обрабатываем каждый товар из массива (как в PHP, но для нескольких товаров)
      const items = orderDto.items.map((item) => {
        // Формируем productName точно как в PHP: конкатенация с пробелами
        // В PHP: ($orderData['strapModel'] ?? '') . ' ' . ($orderData['appleWatchModel'] ?? '') . ' ' . ($orderData['appleWatchModelSize'] ?? '') . 'мм'
        // ВАЖНО: проверяем, что значения не undefined и не строка "undefined"
        const strapModel = (item.strapModel && item.strapModel !== 'undefined') ? String(item.strapModel).trim() : '';
        const appleWatchModel = (item.appleWatchModel && item.appleWatchModel !== 'undefined') ? String(item.appleWatchModel).trim() : '';
        // В PHP добавляется 'мм' в конце, но у нас уже может быть 'мм' в appleWatchModelSize
        const appleWatchModelSize = (item.appleWatchModelSize && item.appleWatchModelSize !== 'undefined') ? String(item.appleWatchModelSize).trim() : '';
        
        // Формируем productName как в PHP (конкатенация с пробелами)
        // Фильтруем пустые части перед объединением
        const productNameParts = [strapModel, appleWatchModel, appleWatchModelSize]
          .filter(part => part && part !== 'undefined' && part.trim() !== '');
        
        const productName = productNameParts.length > 0 
          ? productNameParts.join(' ').trim() 
          : 'Ремешок';
        
        // Вычисляем цену товара (в PHP: $orderData['productsPrice'] ?? null)
        const productsPrice = item.productsPrice ?? null;
        const additionalOptionsPrice = item.additionalOptionsPrice ?? 0;
        // В PHP: $orderData['productsPrice'] ?? null - может быть null, но мы должны сохранить число
        const itemPrice = productsPrice !== null && productsPrice !== undefined 
          ? Number(productsPrice) + Number(additionalOptionsPrice || 0)
          : 0;

        console.log(`Товар обработан:`, {
          strapModel,
          appleWatchModel,
          appleWatchModelSize,
          productName,
          productsPrice,
          additionalOptionsPrice,
          itemPrice
        });

        return {
          productName,
          quantity: item.quantity ?? 1,
          initialPrice: itemPrice,
          properties: this.cleanProperties([
            { name: 'Цвет кожи', value: item.strapLeatherColor || 'Не выбран' },
            { name: 'Цвет строчки', value: item.stitchingColor || 'Не выбран' },
            { name: 'Цвет края', value: item.edgeColor || 'Не выбран' },
            { name: 'Цвет пряжки', value: item.buckleColor || 'Не выбран' },
            { name: 'Цвет адаптера', value: item.adapterColor || 'Не выбран' },
            {
              name: 'Инициалы',
              value: item.initials?.choosen ? (item.initials.text || 'Да') : 'Нет',
            },
            {
              name: 'Подарочная коробка',
              value: item.presentBox?.choosen ? 'Да' : 'Нет',
            },
            {
              name: 'Открытка',
              value: item.postCard?.choosen ? (item.postCard.text || 'Да') : 'Нет',
            },
            {
              name: 'Бабочка',
              value: item.buckleButterfly?.choosen ? 'Да' : 'Нет',
            },
            { name: 'Промокод', value: orderDto.promo.code || 'Нет' },
          ]),
        };
      });

      // Формируем заказ точно как в PHP
      const order: any = {
        number: orderDto.orderNumber ?? null,
        firstName: orderDto.receiverFullname ?? null,
        email: orderDto.email ?? null,
        phone: orderDto.tel ?? null,
        promoCode: orderDto.promo.code ?? null,
        delivery: {
          code: 'cdek-pvz',
          cost: orderDto.deliveryPrice ?? null,
          address: {
            region: orderDto.deliveryCity ?? null,
            city: orderDto.deliveryCity ?? null,
            street: orderDto.deliveryAddressInfo?.street ?? null,
            building: orderDto.deliveryAddressInfo?.building ?? null,
            housing: orderDto.deliveryAddressInfo?.appartament ?? null,
            test: orderDto.deliveryComment ?? null,
          },
        },
        items: items,
        summ: orderDto.totalPrice ?? null,
      };

      // Очищаем свойства от пустых значений для каждого товара (как в PHP)
      order.items = order.items.map((item: any) => ({
        ...item,
        properties: this.cleanProperties(item.properties),
      }));

      // Логируем для отладки ДО очистки
      console.log('RetailCRM order BEFORE cleaning:', JSON.stringify(order, null, 2));
      console.log('Items before cleaning:', order.items);
      console.log('Summ before cleaning:', order.summ);
      
      // Очищаем весь заказ от пустых и null (как в PHP: array_filter_recursive)
      // ВАЖНО: в PHP array_filter_recursive НЕ удаляет числа 0, только null и ''
      // НО: мы должны сохранить items и summ даже если они содержат 0
      // Также важно: сохраняем productName, quantity, initialPrice для каждого товара
      let cleanedOrder = this.arrayFilterRecursive(order);
      
      // Убеждаемся, что items и summ присутствуют (даже если они были удалены фильтром)
      if (!cleanedOrder || !cleanedOrder.items || cleanedOrder.items.length === 0) {
        cleanedOrder = { ...order };
      } else {
        // Восстанавливаем важные поля для каждого товара
        cleanedOrder.items = cleanedOrder.items.map((cleanedItem: any, index: number) => {
          const originalItem = order.items[index];
          return {
            productName: cleanedItem.productName || originalItem.productName || 'Ремешок',
            quantity: cleanedItem.quantity !== undefined && cleanedItem.quantity !== null 
              ? cleanedItem.quantity 
              : (originalItem.quantity || 1),
            initialPrice: cleanedItem.initialPrice !== undefined && cleanedItem.initialPrice !== null
              ? cleanedItem.initialPrice
              : (originalItem.initialPrice || 0),
            properties: cleanedItem.properties || originalItem.properties || []
          };
        });
      }
      
      // Восстанавливаем summ если он был удален
      if (cleanedOrder.summ === undefined || cleanedOrder.summ === null) {
        cleanedOrder.summ = order.summ !== null && order.summ !== undefined ? order.summ : 0;
      }
      
      // Логируем для отладки ПОСЛЕ очистки
      console.log('RetailCRM order AFTER cleaning:', JSON.stringify(cleanedOrder, null, 2));
      console.log('Items after cleaning:', cleanedOrder.items);
      console.log('Summ after cleaning:', cleanedOrder.summ);

      const params = new URLSearchParams({
        apiKey: this.apiToken,
        order: JSON.stringify(cleanedOrder, null, 0),
      });

      const response = await firstValueFrom(
        this.httpService.post(this.apiUrl, params.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );

      // Отправляем сообщение в Telegram после успешного создания заказа
      console.log('📤 Начинаю отправку сообщения в Telegram...');
      console.log('TelegramService доступен:', !!this.telegramService);
      
      try {
        const telegramResult = await this.telegramService.sendOrderMessage(orderDto);
        console.log('✅ Сообщение успешно отправлено в Telegram:', telegramResult);
      } catch (telegramError: any) {
        // Логируем ошибку, но не прерываем выполнение
        // Заказ уже создан в RetailCRM, поэтому не нужно откатывать транзакцию
        console.error('❌ Ошибка отправки сообщения в Telegram:');
        console.error('   Сообщение:', telegramError.message);
        console.error('   Статус:', telegramError.status || telegramError.response?.status);
        console.error('   Данные:', telegramError.response?.data || telegramError.data || telegramError);
        console.error('   Полная ошибка:', JSON.stringify(telegramError, null, 2));
      }

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

