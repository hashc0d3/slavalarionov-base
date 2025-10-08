"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrapDesignPreview = void 0;
const mobx_react_lite_1 = require("mobx-react-lite");
const configurator_store_1 = require("@/shared/store/configurator.store");
const StrapDesignPreview_module_css_1 = __importDefault(require("./StrapDesignPreview.module.css"));
exports.StrapDesignPreview = (0, mobx_react_lite_1.observer)(function StrapDesignPreview({ className, variant = 'default', layout = 'flex' }) {
    const selectedStrapModel = configurator_store_1.configuratorStore.selectedStrapModel;
    const selectedFrameColor = configurator_store_1.configuratorStore.selectedFrameColor;
    const selectedLeatherColor = configurator_store_1.configuratorStore.selectedLeatherColor;
    const selectedStitchingColor = configurator_store_1.configuratorStore.selectedStitchingColor;
    const selectedEdgeColor = configurator_store_1.configuratorStore.selectedEdgeColor;
    const selectedBuckleColor = configurator_store_1.configuratorStore.selectedBuckleColor;
    const selectedAdapterColor = configurator_store_1.configuratorStore.selectedAdapterColor;
    if (!selectedStrapModel) {
        return null;
    }
    const strapData = selectedStrapModel.attributes.watch_strap;
    const baseImageUrl = 'https://api.slavalarionov.store/uploads';
    const getImageUrl = (type, view) => {
        const colorName = type === 'leather' ? selectedLeatherColor?.color_title?.toLowerCase() || 'white' :
            type === 'stitching' ? selectedStitchingColor?.color_title?.toLowerCase() || 'white' :
                type === 'edge' ? selectedEdgeColor?.color_title?.toLowerCase() || 'white' :
                    type === 'buckle' ? selectedBuckleColor?.color_title?.toLowerCase() || 'silver' :
                        type === 'adapter' ? selectedAdapterColor?.color_title?.toLowerCase() || 'silver' : 'white';
        const getColorHash = (colorName, type, view) => {
            const baseHashes = {
                'белый': '86adc58985',
                'чёрный': '9c801e142a',
                'бежевый': '6169213005',
                'чароит': '653977efb4',
                'зеленовато-желтый': '2364420848',
                'шоколадный': '1d1db68de2',
                'зелёный': 'c17ca133b5',
                'фуксия': 'ca2dcc2f02',
                'голубой': 'a88df8430f',
                'марсала': '75bd7cd494',
                'мятный': 'a0816126e4',
                'оранжевый': '95c42a67f7',
                'пудра': '4bc43c08dd',
                'красный': '8913d26f63',
                'королевский синий': '9d09637ac0',
                'серый': '6014a4e990',
                'ультрамарин': '212e9a998f',
                'фиолетовый': 'ebebddb95c',
                'жёлтый': '298301fe98',
                'серебряный': '16b6862ef4',
                'розовое золото': 'bb2fe92f54',
                'роз. золото': 'bb2fe92f54',
                'синий': 'a918feda5c',
                'зелёный': '26a256f55a'
            };
            if (view === 2) {
                const view2Hashes = {
                    'белый': 'f88b2a322e',
                    'чёрный': 'a6dcdbde19',
                    'бежевый': 'b64acbe902',
                    'чароит': 'fdde96690d',
                    'зеленовато-желтый': '53662de960',
                    'шоколадный': '497ce25484',
                    'зелёный': '44e0fe8e3d',
                    'фуксия': '55b09ef2af',
                    'голубой': 'fe0efcf272',
                    'марсала': '69560e2855',
                    'мятный': '218aec500a',
                    'оранжевый': 'eb0eec4abd',
                    'пудра': '3ddd0e9f1b',
                    'красный': 'c0081a5a24',
                    'королевский синий': 'fcb638174b',
                    'серый': 'e17919735e',
                    'ультрамарин': '2abcbe8398',
                    'фиолетовый': '2ac621e263',
                    'жёлтый': 'dc6909aa8f'
                };
                return view2Hashes[colorName] || baseHashes[colorName] || '86adc58985';
            }
            else if (view === 3) {
                const view3Hashes = {
                    'белый': 'd023ce495f',
                    'чёрный': '849bbdbed1',
                    'бежевый': '83ea932857',
                    'чароит': 'cb2997252d',
                    'зеленовато-желтый': '873a3a716c',
                    'шоколадный': 'ba3bb399c5',
                    'зелёный': 'd083d34833',
                    'фуксия': '395089cccc',
                    'голубой': 'e4d834d19a',
                    'марсала': '9508f04d60',
                    'мятный': 'e2816e0b0e',
                    'оранжевый': '6c5e86ceb9',
                    'пудра': '4dd996bd53',
                    'красный': '746d8b7ee1',
                    'королевский синий': '1380a4d0f0',
                    'серый': '92b8a8a38a',
                    'ультрамарин': 'a885e06cfe',
                    'фиолетовый': '7a9b262388',
                    'жёлтый': 'a0212fbfc2'
                };
                return view3Hashes[colorName] || baseHashes[colorName] || '86adc58985';
            }
            return baseHashes[colorName] || '86adc58985';
        };
        const colorMapping = {
            'белый': 'white',
            'чёрный': 'black',
            'бежевый': 'beige',
            'чароит': 'charoite',
            'зеленовато-желтый': 'chartrouse',
            'шоколадный': 'chocolate',
            'зелёный': 'forest',
            'фуксия': 'fuchsia',
            'голубой': 'louisblue',
            'марсала': 'marsala',
            'мятный': 'mint',
            'оранжевый': 'orange',
            'пудра': 'pudra',
            'красный': 'red',
            'королевский синий': 'royalblue',
            'серый': 'spacegray',
            'ультрамарин': 'ultramarine',
            'фиолетовый': 'violet',
            'жёлтый': 'yellow',
            'серебряный': 'silver',
            'розовое золото': 'rosegold',
            'роз. золото': 'rosegold',
            'синий': 'blue',
            'зелёный': 'green'
        };
        const mappedColor = colorMapping[colorName] || colorName;
        const hash = getColorHash(colorName, type, view);
        if (strapData.strap_name === 'brogue') {
            return `${baseImageUrl}/${type}_brogue_${mappedColor}_${view}_${hash}.png`;
        }
        else {
            return `${baseImageUrl}/${type}_classic_${mappedColor}_${view}_${hash}.png`;
        }
    };
    const getWatchImageUrl = (view) => {
        const frameColor = selectedFrameColor?.color_name?.toLowerCase() || 'starlight';
        const getWatchHash = (color, viewNum) => {
            const hashes = {
                'silver': { 1: 'c934eac370', 2: 'e0541c47ae', 3: 'e0541c47ae' },
                'black': { 1: '4487db25f0', 2: 'f0755d2934', 3: 'f0755d2934' },
                'red': { 1: '71beb18575', 2: '0e42bec469', 3: '0e42bec469' },
                'blue': { 1: '2a5db7479a', 2: '8eac170faa', 3: '8eac170faa' },
                'green': { 1: 'ade7cd8b2b', 2: '44d4c02d5d', 3: '44d4c02d5d' },
                'starlight': { 1: 'ad610ff403', 2: '8c161b111d', 3: '8c161b111d' }
            };
            return hashes[color]?.[viewNum] || hashes['starlight'][viewNum];
        };
        const colorMapping = {
            'silver': 'silver',
            'black': 'midnight',
            'red': 'red',
            'blue': 'blue',
            'green': 'green',
            'starlight': 'starlight'
        };
        const mappedColor = colorMapping[frameColor] || 'starlight';
        const hash = getWatchHash(mappedColor, view);
        return `${baseImageUrl}/watch_classic_${mappedColor}_${view}_${hash}.png`;
    };
    return (<div className={`${variant === 'final' ? StrapDesignPreview_module_css_1.default.previewFinal : StrapDesignPreview_module_css_1.default.preview} ${className || ''}`}>
			<div className={`${StrapDesignPreview_module_css_1.default.previewContainer} ${layout === 'grid' ? StrapDesignPreview_module_css_1.default.previewContainerGrid : StrapDesignPreview_module_css_1.default.previewContainerFlex}`}>
				
				<div className={StrapDesignPreview_module_css_1.default.previewView}>
					<img src={`${baseImageUrl}/base_${strapData.strap_name}_1_739ae2aa10.png`} alt="Strap view 1" className={StrapDesignPreview_module_css_1.default.baseImage}/>
					
					{selectedFrameColor && (<img src={getWatchImageUrl(1)} alt="Watch frame" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
					
					{selectedLeatherColor && (<img src={getImageUrl('leather', 1)} alt="Leather color" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
					{selectedStitchingColor && (<img src={getImageUrl('stitching', 1)} alt="Stitching color" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
					{selectedEdgeColor && (<img src={getImageUrl('edge', 1)} alt="Edge color" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
					{selectedBuckleColor && (<img src={getImageUrl('buckle', 1)} alt="Buckle color" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
					{selectedAdapterColor && (<img src={getImageUrl('adapter', 1)} alt="Adapter color" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
				</div>

				
				<div className={StrapDesignPreview_module_css_1.default.previewView}>
					<img src={`${baseImageUrl}/base_${strapData.strap_name}_2_26fa993a75.png`} alt="Strap view 2" className={StrapDesignPreview_module_css_1.default.baseImage}/>
					
					{selectedFrameColor && (<img src={getWatchImageUrl(2)} alt="Watch frame" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
					{selectedLeatherColor && (<img src={getImageUrl('leather', 2)} alt="Leather color" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
					{selectedStitchingColor && (<img src={getImageUrl('stitching', 2)} alt="Stitching color" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
					{selectedEdgeColor && (<img src={getImageUrl('edge', 2)} alt="Edge color" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
					{selectedBuckleColor && (<img src={getImageUrl('buckle', 2)} alt="Buckle color" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
					{selectedAdapterColor && (<img src={getImageUrl('adapter', 2)} alt="Adapter color" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
				</div>

				
				<div className={StrapDesignPreview_module_css_1.default.previewView}>
					<img src={`${baseImageUrl}/base_${strapData.strap_name}_3_50228196b7.png`} alt="Strap view 3" className={StrapDesignPreview_module_css_1.default.baseImage}/>
					
					{selectedFrameColor && (<img src={getWatchImageUrl(3)} alt="Watch frame" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
					{selectedLeatherColor && (<img src={getImageUrl('leather', 3)} alt="Leather color" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
					{selectedStitchingColor && (<img src={getImageUrl('stitching', 3)} alt="Stitching color" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
					{selectedEdgeColor && (<img src={getImageUrl('edge', 3)} alt="Edge color" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
					{selectedBuckleColor && (<img src={getImageUrl('buckle', 3)} alt="Buckle color" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
					{selectedAdapterColor && (<img src={getImageUrl('adapter', 3)} alt="Adapter color" className={StrapDesignPreview_module_css_1.default.overlayImage}/>)}
				</div>
			</div>
		</div>);
});
//# sourceMappingURL=StrapDesignPreview.js.map