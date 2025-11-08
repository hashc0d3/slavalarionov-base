'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageUploader = void 0;
const react_1 = require("react");
const ImageUploader_module_css_1 = __importDefault(require("./ImageUploader.module.css"));
const ImageUploader = ({ onImageUpload, currentImage, fallbackUrl }) => {
    const [isDragging, setIsDragging] = (0, react_1.useState)(false);
    const fileInputRef = (0, react_1.useRef)(null);
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };
    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };
    const handleFile = (file) => {
        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите файл изображения');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result;
            onImageUpload(base64);
        };
        reader.readAsDataURL(file);
    };
    const handleClick = () => {
        fileInputRef.current?.click();
    };
    const displayImage = currentImage || fallbackUrl;
    return (<div className={ImageUploader_module_css_1.default.container}>
      <div className={`${ImageUploader_module_css_1.default.dropZone} ${isDragging ? ImageUploader_module_css_1.default.dragging : ''}`} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} onClick={handleClick}>
        {displayImage ? (<div className={ImageUploader_module_css_1.default.imagePreview}>
            <img src={displayImage} alt="Preview"/>
            <div className={ImageUploader_module_css_1.default.overlay}>
              <span>Нажмите или перетащите новое изображение</span>
            </div>
          </div>) : (<div className={ImageUploader_module_css_1.default.placeholder}>
            <div className={ImageUploader_module_css_1.default.uploadIcon}>📁</div>
            <p>Перетащите изображение сюда</p>
            <p className={ImageUploader_module_css_1.default.or}>или</p>
            <button type="button" className={ImageUploader_module_css_1.default.selectButton}>
              Выбрать файл
            </button>
          </div>)}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className={ImageUploader_module_css_1.default.fileInput}/>
      </div>
      
      {currentImage && currentImage !== fallbackUrl && (<div className={ImageUploader_module_css_1.default.imageInfo}>
          <span className={ImageUploader_module_css_1.default.badge}>✓ Загружено с устройства</span>
        </div>)}
      
      {!currentImage && fallbackUrl && (<div className={ImageUploader_module_css_1.default.imageInfo}>
          <span className={ImageUploader_module_css_1.default.badgeUrl}>🔗 Используется URL</span>
        </div>)}
    </div>);
};
exports.ImageUploader = ImageUploader;
//# sourceMappingURL=ImageUploader.js.map