import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CmsService {
  private readonly cmsApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.cmsApiUrl = this.configService.get<string>('CMS_API_URL', 'http://localhost:3001/api');
  }

  async getWatchModels() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.cmsApiUrl}/watch-models`, {
          params: {
            limit: 100,
          }
        })
      );
      
      // Filter active models
      const activeModels = response.data.docs.filter(model => model.is_active !== false);
      
      return activeModels.map(model => ({
        model_name: model.model_name,
        watch_model_name: model.watch_model_name,
        watch_model_manufacturer: model.watch_model_manufacturer,
        main_image: model.main_image?.url || model.main_image,
        choosen: false,
        watch_sizes: (model.watch_sizes || []).map(size => ({
          watch_size: size.watch_size,
          choosen: false,
        })),
        frame_colors: (model.frame_colors || []).map(color => ({
          color_name: color.color_name,
          color_code: color.color_code,
          choosen: false,
        })),
      }));
    } catch (error) {
      console.error('CMS Error:', error.message, error.response?.data);
      throw new HttpException(
        `Failed to fetch watch models: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getWatchStraps() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.cmsApiUrl}/watch-straps`, {
          params: {
            limit: 100,
          }
        })
      );
      
      // Filter active straps
      const activeStraps = response.data.docs.filter(strap => strap.is_active !== false);
      
      return activeStraps.map(strap => ({
        choosen: false,
        dataFetched: false,
        attributes: {
          watch_strap: {
            id: strap.id,
            strap_name: strap.strap_name,
            strap_title: strap.strap_title,
            strap_description: strap.strap_description,
            strap_short_description: strap.strap_short_description,
            price: strap.price,
            preview_image: strap.preview_image?.url || strap.preview_image,
            ultra_preview_image: strap.ultra_preview_image?.url || strap.ultra_preview_image,
            buckle_butterfly_choosen: false,
            has_buckle_butterfly: strap.has_buckle_butterfly,
            strap_params: null, // Will be fetched separately
          }
        }
      }));
    } catch (error) {
      throw new HttpException(
        `Failed to fetch watch straps: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getStrapParams(strapId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.cmsApiUrl}/strap-params`, {
          params: {
            where: {
              watch_strap: { equals: strapId }
            },
            limit: 1,
          }
        })
      );

      if (response.data.docs.length === 0) {
        return null;
      }

      const params = response.data.docs[0];
      
      return {
        strap_name: params.strap_name,
        leather_colors: params.leather_colors?.map(color => ({
          color_title: color.color_title,
          color_code: color.color_code,
          choosen: false,
          price: color.price || 0,
        })) || [],
        stitching_colors: params.stitching_colors?.map(color => ({
          color_title: color.color_title,
          color_code: color.color_code,
          choosen: false,
          price: color.price || 0,
        })) || [],
        edge_colors: params.edge_colors?.map(color => ({
          color_title: color.color_title,
          color_code: color.color_code,
          choosen: false,
          price: color.price || 0,
        })) || [],
        buckle_colors: params.buckle_colors?.map(color => ({
          color_title: color.color_title,
          color_code: color.color_code,
          choosen: false,
          price: color.price || 0,
        })) || [],
        adapter_colors: params.adapter_colors?.map(color => ({
          color_title: color.color_title,
          color_code: color.color_code,
          choosen: false,
          price: color.price || 0,
        })) || [],
        buckle_butterfly_price: params.buckle_butterfly_price || 0,
        has_buckle_butterfly: false,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to fetch strap params: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAdditionalOptions() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.cmsApiUrl}/additional-options`, {
          params: {
            limit: 1,
          }
        })
      );

      if (response.data.docs.length === 0) {
        return null;
      }

      const options = response.data.docs[0];
      
      return {
        data: {
          attributes: {
            title: options.title,
            description: options.description,
            additional_options: options.additional_options.map(opt => ({
              option_name: opt.option_name,
              option_title: opt.option_title,
              option_description: opt.option_description,
              option_placeholder: opt.option_placeholder,
              option_price: opt.option_price,
              option_type: opt.option_type,
              choosen: false,
            })),
          }
        }
      };
    } catch (error) {
      throw new HttpException(
        `Failed to fetch additional options: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validatePromoCode(code: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.cmsApiUrl}/promo-codes`, {
          params: {
            where: {
              code: { equals: code.toUpperCase() },
              is_active: { equals: true }
            },
            limit: 1,
          }
        })
      );

      if (response.data.docs.length === 0) {
        return {
          promoFound: false,
          type: null,
          value: 0,
          minOrderAmount: 0,
        };
      }

      const promo = response.data.docs[0];
      
      // Check validity dates
      const now = new Date();
      if (promo.valid_from && new Date(promo.valid_from) > now) {
        return {
          promoFound: false,
          type: null,
          value: 0,
          minOrderAmount: 0,
        };
      }
      
      if (promo.valid_until && new Date(promo.valid_until) < now) {
        return {
          promoFound: false,
          type: null,
          value: 0,
          minOrderAmount: 0,
        };
      }

      // Check usage limit
      if (promo.usage_limit && promo.usage_count >= promo.usage_limit) {
        return {
          promoFound: false,
          type: null,
          value: 0,
          minOrderAmount: 0,
        };
      }

      return {
        promoFound: true,
        type: promo.discount_type,
        value: promo.discount_value,
        minOrderAmount: promo.min_order_amount || 0,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to validate promo code: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async incrementPromoUsage(code: string) {
    try {
      // First, get the promo code ID
      const response = await firstValueFrom(
        this.httpService.get(`${this.cmsApiUrl}/promo-codes`, {
          params: {
            where: {
              code: { equals: code.toUpperCase() }
            },
            limit: 1,
          }
        })
      );

      if (response.data.docs.length === 0) {
        return;
      }

      const promo = response.data.docs[0];
      
      // Update usage count
      await firstValueFrom(
        this.httpService.patch(
          `${this.cmsApiUrl}/promo-codes/${promo.id}`,
          {
            usage_count: (promo.usage_count || 0) + 1,
          }
        )
      );
    } catch (error) {
      // Don't throw error, just log it
      console.error(`Failed to increment promo usage: ${error.message}`);
    }
  }
}

