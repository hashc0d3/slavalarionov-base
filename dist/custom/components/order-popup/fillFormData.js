"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fillFormData;
function fillFormData(options) {
    const formData = new FormData();
    formData.append('1.Данные заказа:', '&nbsp;');
    formData.append('Номер заказа', options.orderNumber);
    formData.append('Модель ремешка', options.strapModel);
    formData.append('Цвет кожи', options.strapLeatherColor);
    formData.append('Модель apple watch', options.appleWatchModel);
    formData.append('Размер корпуса Apple Watch', options.appleWatchModelSize);
    formData.append('Цвет корпуса apple watch', options.appleWatchModelColor);
    formData.append('Цвет строчки', options.stitchingColor);
    formData.append('Цвет края', options.edgeColor);
    formData.append('цвет пряжки (застежки)', options.buckleColor);
    formData.append('Цвет адаптеров (крепление к часам)', options.adapterColor);
    options.buckleButterfly.available &&
        formData.append('Вид пряжки', options.buckleButterfly.choosen ? 'Пряжка бабочка' : 'Стандартная');
    formData.append('Нужны инициалы?', options.initials.choosen
        ? `Да, (${options.initials.text || 'Текст не набран'})`
        : 'Нет');
    formData.append('Нужна подарочная упаковка?', options.presentBox.choosen ? 'Да' : 'Нет');
    formData.append('Нужна открытка?', options.postCard.choosen
        ? `Да, (${options.postCard.text || 'Текст не набран'})`
        : 'Нет');
    formData.append('2.Данные клиента:', '&nbsp;');
    formData.append('ФИО', options.receiverFullname);
    formData.append('Email', options.email);
    formData.append('Номер телефона', options.tel);
    formData.append('3.Доставка:', '&nbsp;');
    formData.append('Город доставки', options.deliveryCity);
    formData.append('Способ доставки', options.deliveryType || '');
    if ((options.deliveryType === 'СДЭК до пункта выдачи' ||
        options.deliveryType === 'Постамат OmniCDEK') &&
        options.deliveryPoint) {
        formData.append('Название пункта выдачи', options.deliveryPoint.name || '');
        formData.append('Адрес пункта выдачи', options.deliveryPoint.address || '');
        formData.append('Время работы пункта выдачи', options.deliveryPoint.workTime || '');
        formData.append('Телефон пункта выдачи', options.deliveryPoint.phone || '');
    }
    else if (options.deliveryType === 'СДЭК курьером до двери' &&
        options.deliveryAddressInfo) {
        formData.append('Улица', options.deliveryAddressInfo.street || '');
        formData.append('Дом', options.deliveryAddressInfo.building || '');
        formData.append('Квартира', options.deliveryAddressInfo.appartament || '');
    }
    else if (options.deliveryType === 'Почта России 1 класс') {
        formData.append('Адрес', options.mailAddress || '');
    }
    else if (options.deliveryType === 'Доставка курьером по Санкт-Петербургу') {
        formData.append('Адрес', options.curierAddress || '');
    }
    !!options.deliveryComment &&
        formData.append('Комментарий к заказу', options.deliveryComment);
    formData.append('4.Стоимость и оплата:', '&nbsp;');
    formData.append('Стоимость товара', `${options.productsPrice} руб`);
    options.additionalOptionsPrice &&
        formData.append('Стоимость доп опций', `${options.additionalOptionsPrice} руб`);
    formData.append('Стоимость доставки', `${options.deliveryPrice || 0} руб`);
    options.promo.used &&
        options.promo.used &&
        formData.append('Скидка на товар по промокоду', options.promo.discountValueFull);
    formData.append('Использованный промокод', options.promo.code);
    formData.append('Итоговая сумма', `${options.totalPrice} руб`);
    formData.append('Способ оплаты', options.paymentType);
    return formData;
}
//# sourceMappingURL=fillFormData.js.map