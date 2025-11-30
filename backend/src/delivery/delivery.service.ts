import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface CdekCity {
  cityName: string;
  cityCode: number;
  cityUuid: string;
  country: string;
  countryCode: string;
  region: string;
  subRegion: string;
  regionCode?: number;
  latitude?: number;
  longitude?: number;
  kladr?: string;
}

export interface CdekPvz {
  code: string;
  name: string;
  address: string;
  addressComment?: string;
  type: string;
  city: string;
  cityCode: number;
  workTime?: string;
  postalCode?: string;
  phone?: string;
  phoneDetails?: string;
  coordX?: number;
  coordY?: number;
}

export interface CdekCalculation {
  price: number;
  minDays: number;
  tariffId: number;
}

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);

  private readonly dadataToken: string;
  private readonly dadataSecret: string;
  private readonly cdekClientId: string;
  private readonly cdekClientSecret: string;

  private cdekToken: string | null = null;
  private cdekTokenExpiresAt: number | null = null;

  constructor(private readonly http: HttpService, private readonly config: ConfigService) {
    this.dadataToken = this.config.get<string>('DADATA_API_KEY') || '';
    this.dadataSecret = this.config.get<string>('DADATA_SECRET') || '';
    this.cdekClientId = this.config.get<string>('CDEK_CLIENT_ID') || '';
    this.cdekClientSecret = this.config.get<string>('CDEK_CLIENT_SECRET') || '';
    
    // Логируем наличие учетных данных (с реальными значениями для отладки)
    this.logger.log('CDEK credentials check - FULL DEBUG', {
      hasClientId: !!this.cdekClientId,
      hasClientSecret: !!this.cdekClientSecret,
      clientIdLength: this.cdekClientId?.length || 0,
      clientSecretLength: this.cdekClientSecret?.length || 0,
      clientIdActual: this.cdekClientId,
      clientSecretActual: this.cdekClientSecret,
      clientIdStartsWith: this.cdekClientId?.substring(0, 10) || 'empty',
      clientSecretStartsWith: this.cdekClientSecret?.substring(0, 10) || 'empty',
    });
  }

  private ensureDadataCredentials() {
    if (!this.dadataToken || !this.dadataSecret) {
      throw new InternalServerErrorException('DaData credentials are not configured');
    }
  }

  private ensureCdekCredentials() {
    if (!this.cdekClientId || !this.cdekClientSecret) {
      this.logger.error('CDEK credentials are missing', {
        hasClientId: !!this.cdekClientId,
        hasClientSecret: !!this.cdekClientSecret,
        clientIdLength: this.cdekClientId?.length || 0,
        clientSecretLength: this.cdekClientSecret?.length || 0,
      });
      throw new InternalServerErrorException('CDEK credentials are not configured');
    }
  }

  private async getCdekToken(): Promise<string> {
    this.ensureCdekCredentials();

    const now = Date.now();
    if (this.cdekToken && this.cdekTokenExpiresAt && now < this.cdekTokenExpiresAt) {
      return this.cdekToken;
    }

    try {
      const params = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.cdekClientId,
        client_secret: this.cdekClientSecret,
      });

      // Логируем запрос с реальными значениями для отладки
      const requestBody = params.toString();
      this.logger.log('CDEK OAuth token request - FULL DEBUG', {
        url: 'https://api.cdek.ru/v2/oauth/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body_full: requestBody,
        body_masked: requestBody.replace(/client_secret=[^&]*/, 'client_secret=***HIDDEN***'),
        client_id_actual: this.cdekClientId,
        client_id_length: this.cdekClientId?.length || 0,
        client_secret_actual: this.cdekClientSecret,
        client_secret_length: this.cdekClientSecret?.length || 0,
        has_client_id: !!this.cdekClientId,
        has_client_secret: !!this.cdekClientSecret,
        client_id_starts_with: this.cdekClientId?.substring(0, 10) || 'empty',
        client_secret_starts_with: this.cdekClientSecret?.substring(0, 10) || 'empty',
      });

      const response = await firstValueFrom(
        this.http.post('https://api.cdek.ru/v2/oauth/token', params.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        }),
      );

      // Логируем успешный ответ
      this.logger.log('CDEK OAuth token response', {
        status: response.status,
        has_token: !!response.data?.access_token,
        token_length: response.data?.access_token?.length || 0,
        expires_in: response.data?.expires_in,
      });

      const { access_token, expires_in } = response.data as { access_token: string; expires_in: number };
      if (!access_token) {
        throw new Error('Empty token received from CDEK');
      }

      this.cdekToken = access_token;
      const ttl = Number.isFinite(expires_in) ? (expires_in as number) : 3600;
      this.cdekTokenExpiresAt = now + (ttl - 60) * 1000; // refresh token 1 minute before expiration
      return this.cdekToken;
    } catch (error: any) {
      const errorMessage = error?.response?.data 
        ? JSON.stringify(error.response.data)
        : error?.message || 'Unknown error';
      const statusCode = error?.response?.status || 'N/A';
      const errorDetails = error?.response?.data || {};
      
      this.logger.error(
        `Failed to obtain CDEK access token. Status: ${statusCode}, Error: ${errorMessage}`,
        {
          statusCode,
          errorMessage,
          errorDetails,
          hasClientId: !!this.cdekClientId,
          clientIdLength: this.cdekClientId?.length || 0,
          hasClientSecret: !!this.cdekClientSecret,
          clientSecretLength: this.cdekClientSecret?.length || 0,
          url: 'https://api.cdek.ru/v2/oauth/token',
          stack: error?.stack,
        }
      );
      
      // Если это ошибка авторизации от CDEK, возвращаем более информативное сообщение
      if (statusCode === 401 || statusCode === 403) {
        throw new InternalServerErrorException(
          `CDEK API authorization failed: ${errorDetails?.error_description || errorDetails?.error || errorMessage}. Check CDEK_CLIENT_ID and CDEK_CLIENT_SECRET in backend/.env`
        );
      }
      
      throw new InternalServerErrorException('Failed to authorize with CDEK API');
    }
  }

  async searchCdekCities(query: string): Promise<CdekCity[]> {
    if (!query || !query.trim()) {
      return [];
    }

    const token = await this.getCdekToken();

    try {
      const requestParams = {
        city: query.trim(),
        country_codes: 'RU',
        size: 10,
      };

      // Логируем запрос
      this.logger.log('CDEK API request: searchCdekCities', {
        url: 'https://api.cdek.ru/v2/location/cities',
        method: 'GET',
        params: requestParams,
        has_token: !!token,
        token_preview: token ? `${token.substring(0, 20)}...` : 'no token',
      });

      const response = await firstValueFrom(
        this.http.get('https://api.cdek.ru/v2/location/cities', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          params: requestParams,
        }),
      );

      // Логируем ответ
      this.logger.log('CDEK API response: searchCdekCities', {
        status: response.status,
        statusText: response.statusText,
        entities_count: response.data?.entity?.length || 0,
        data_preview: response.data ? JSON.stringify(response.data).substring(0, 200) : 'no data',
      });

      const entities: any[] = response.data?.entity || [];

      return entities.map((item) => ({
        cityName: item.city || item.city_name || '',
        cityCode: item.code || item.city_code,
        cityUuid: item.uuid || item.city_uuid || '',
        country: item.country || item.country_name || '',
        countryCode: item.country_code || item.country_codes || '',
        region: item.region || item.region_name || '',
        subRegion: item.sub_region || item.subregion || '',
        regionCode: item.region_code,
        latitude: item.latitude,
        longitude: item.longitude,
        kladr: item.kladr,
      })) as CdekCity[];
    } catch (error: any) {
      const errorMessage = error?.response?.data 
        ? JSON.stringify(error.response.data)
        : error?.message || 'Unknown error';
      const statusCode = error?.response?.status || 'N/A';
      
      this.logger.error(`Failed to fetch CDEK cities: query="${query}"`, {
        query,
        statusCode,
        errorMessage,
        errorDetails: error?.response?.data,
        url: 'https://api.cdek.ru/v2/location/cities',
        hasToken: !!token,
        stack: error?.stack,
      });
      throw new InternalServerErrorException('Не удалось получить список городов CDEK');
    }
  }

  async getCdekPvzList(cityCode: number): Promise<CdekPvz[]> {
    if (!cityCode) {
      return [];
    }
    const token = await this.getCdekToken();

    try {
      const requestParams = {
        city_code: cityCode,
        type: 'ALL',
      };

      // Логируем запрос
      this.logger.log('CDEK API request: getCdekPvzList', {
        url: 'https://api.cdek.ru/v2/deliverypoints',
        method: 'GET',
        params: requestParams,
        has_token: !!token,
        token_preview: token ? `${token.substring(0, 20)}...` : 'no token',
      });

      const response = await firstValueFrom(
        this.http.get('https://api.cdek.ru/v2/deliverypoints', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          params: requestParams,
        }),
      );

      // Логируем ответ
      this.logger.log('CDEK API response: getCdekPvzList', {
        status: response.status,
        statusText: response.statusText,
        points_count: Array.isArray(response.data) ? response.data.length : 0,
        data_preview: response.data ? JSON.stringify(response.data).substring(0, 200) : 'no data',
      });

      const entities: any[] = response.data || [];

      return entities.map((item) => ({
        code: item.code,
        name: item.name,
        address: item.location?.address || item.address,
        addressComment: item.address_comment,
        type: item.type,
        city: item.location?.city || item.city,
        cityCode: item.location?.city_code || item.city_code,
        workTime: item.work_time,
        postalCode: item.location?.postal_code || item.postal_code,
        phone: item.phone,
        phoneDetails: item.phone_additional,
        coordX: item.location?.longitude ?? item.longitude,
        coordY: item.location?.latitude ?? item.latitude,
      })) as CdekPvz[];
    } catch (error: any) {
      const errorMessage = error?.response?.data 
        ? JSON.stringify(error.response.data)
        : error?.message || 'Unknown error';
      const statusCode = error?.response?.status || 'N/A';
      
      this.logger.error(`Failed to fetch CDEK delivery points: cityCode=${cityCode}`, {
        cityCode,
        statusCode,
        errorMessage,
        errorDetails: error?.response?.data,
        url: 'https://api.cdek.ru/v2/deliverypoints',
        hasToken: !!token,
        stack: error?.stack,
      });
      throw new InternalServerErrorException('Не удалось получить список пунктов выдачи CDEK');
    }
  }

  async calculateCdekTariffs(cityCode: number): Promise<CdekCalculation[]> {
    if (!cityCode) {
      return [];
    }

    const token = await this.getCdekToken();

    const payload = {
      currency: 'RUB',
      from_location: { code: 137 },
      to_location: { code: cityCode },
      packages: [
        {
          weight: 0.5,
          length: 20,
          width: 10,
          height: 10,
        },
      ],
      tariff_codes: [136, 137],
    };

    try {
      // Логируем запрос
      this.logger.log('CDEK API request: calculateCdekTariffs', {
        url: 'https://api.cdek.ru/v2/calculator/tarifflist',
        method: 'POST',
        payload: payload,
        has_token: !!token,
        token_preview: token ? `${token.substring(0, 20)}...` : 'no token',
      });

      const response = await firstValueFrom(
        this.http.post('https://api.cdek.ru/v2/calculator/tarifflist', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }),
      );

      // Логируем ответ
      this.logger.log('CDEK API response: calculateCdekTariffs', {
        status: response.status,
        statusText: response.statusText,
        data_preview: response.data ? JSON.stringify(response.data).substring(0, 300) : 'no data',
      });

      const results: any[] = response.data?.tariff_codes || response.data?.result || [];

      return results
        .filter((item) => !item.errors || item.errors.length === 0)
        .map((item) => ({
          price: item.delivery_sum ?? item.total_sum ?? 0,
          minDays: item.period_min ?? item.delivery_mode?.min_days ?? item.period ?? 0,
          tariffId: item.tariff_code ?? item.tariff_id ?? 0,
        })) as CdekCalculation[];
    } catch (error: any) {
      const errorMessage = error?.response?.data 
        ? JSON.stringify(error.response.data)
        : error?.message || 'Unknown error';
      const statusCode = error?.response?.status || 'N/A';
      
      this.logger.error(`Failed to calculate CDEK tariffs: cityCode=${cityCode}`, {
        cityCode,
        statusCode,
        errorMessage,
        errorDetails: error?.response?.data,
        url: 'https://api.cdek.ru/v2/calculator/tarifflist',
        hasToken: !!token,
        payload: JSON.stringify(payload),
        stack: error?.stack,
      });
      throw new InternalServerErrorException('Не удалось рассчитать стоимость доставки CDEK');
    }
  }

  async proxyCdekWidget(
    action: string,
    method: string,
    query: Record<string, any>,
    body: any,
  ): Promise<any> {
    this.ensureCdekCredentials();
    const token = await this.getCdekToken();

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };

    if (action === 'offices') {
      const params = { ...query };
      delete params.action;

      try {
        const response = await firstValueFrom(
          this.http.get('https://api.cdek.ru/v2/deliverypoints', {
            headers,
            params,
          }),
        );
        return response.data;
      } catch (error) {
        this.logger.error('Failed to proxy CDEK widget offices request', error);
        throw new InternalServerErrorException('Не удалось получить список пунктов выдачи CDEK');
      }
    }

    if (action === 'calculate') {
      const payload =
        method === 'POST' && body && Object.keys(body).length
          ? { ...body }
          : { ...query };
      delete payload.action;

      try {
        const response = await firstValueFrom(
          this.http.post('https://api.cdek.ru/v2/calculator/tarifflist', payload, {
            headers: {
              ...headers,
              'Content-Type': 'application/json',
            },
          }),
        );
        return response.data;
      } catch (error) {
        this.logger.error('Failed to proxy CDEK widget calculate request', error);
        throw new InternalServerErrorException('Не удалось рассчитать доставку через CDEK');
      }
    }

    throw new BadRequestException(`Unsupported CDEK widget action: ${action}`);
  }

  async searchStreets(query: string, cityName: string): Promise<any[]> {
    if (!query || !query.trim()) {
      return [];
    }

    this.ensureDadataCredentials();

    try {
      const response = await firstValueFrom(
        this.http.post(
          'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
          {
            query: query.trim(),
            count: 10,
            from_bound: { value: 'street' },
            to_bound: { value: 'street' },
            locations: cityName ? [{ city: cityName }] : undefined,
            restrict_value: true,
          },
          {
            headers: {
              Authorization: `Token ${this.dadataToken}`,
              'X-Secret': this.dadataSecret,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return response.data?.suggestions || [];
    } catch (error) {
      this.logger.error('Failed to fetch DaData street suggestions', error);
      throw new InternalServerErrorException('Не удалось получить подсказки улиц');
    }
  }

  async searchBuildings(streetFiasId: string, query: string): Promise<any[]> {
    if (!streetFiasId || !query) {
      return [];
    }

    this.ensureDadataCredentials();

    try {
      const response = await firstValueFrom(
        this.http.post(
          'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
          {
            query: query.trim(),
            count: 10,
            from_bound: { value: 'house' },
            to_bound: { value: 'house' },
            locations: [{ street_fias_id: streetFiasId }],
            restrict_value: true,
          },
          {
            headers: {
              Authorization: `Token ${this.dadataToken}`,
              'X-Secret': this.dadataSecret,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return response.data?.suggestions || [];
    } catch (error) {
      this.logger.error('Failed to fetch DaData building suggestions', error);
      throw new InternalServerErrorException('Не удалось получить подсказки домов');
    }
  }
}

