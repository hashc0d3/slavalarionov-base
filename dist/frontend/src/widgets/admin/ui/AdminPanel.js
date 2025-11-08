'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPanel = void 0;
const mobx_react_lite_1 = require("mobx-react-lite");
const configurator_store_1 = require("@/shared/store/configurator.store");
const react_1 = require("react");
const ImageUploader_1 = require("@/shared/ui/ImageUploader");
const AdminPanel_module_css_1 = __importDefault(require("./AdminPanel.module.css"));
exports.AdminPanel = (0, mobx_react_lite_1.observer)(() => {
    const [editingIndex, setEditingIndex] = (0, react_1.useState)(null);
    const [isAdding, setIsAdding] = (0, react_1.useState)(false);
    const [uploadedImage, setUploadedImage] = (0, react_1.useState)('');
    const [fallbackUrl, setFallbackUrl] = (0, react_1.useState)('');
    const [formData, setFormData] = (0, react_1.useState)({
        model_name: '',
        watch_model_name: '',
        watch_model_manufacturer: '',
        main_image: '',
        watch_sizes: [],
        frame_colors: []
    });
    const fileInputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        configurator_store_1.configuratorStore.loadWatchModelsFromAPI();
    }, []);
    const startEdit = (index) => {
        setEditingIndex(index);
        const model = configurator_store_1.configuratorStore.watchModels[index];
        const isBase64 = model.main_image?.startsWith('data:image');
        setUploadedImage(isBase64 ? model.main_image || '' : '');
        setFallbackUrl(!isBase64 ? model.main_image || '' : '');
        setFormData({
            model_name: model.model_name,
            watch_model_name: model.watch_model_name,
            watch_model_manufacturer: model.watch_model_manufacturer,
            main_image: model.main_image,
            watch_sizes: [...model.watch_sizes],
            frame_colors: [...model.frame_colors]
        });
        setIsAdding(false);
    };
    const startAdd = () => {
        setIsAdding(true);
        setEditingIndex(null);
        setUploadedImage('');
        setFallbackUrl('');
        setFormData({
            model_name: '',
            watch_model_name: '',
            watch_model_manufacturer: '',
            main_image: '',
            watch_sizes: [],
            frame_colors: []
        });
    };
    const cancelEdit = () => {
        setEditingIndex(null);
        setIsAdding(false);
        setUploadedImage('');
        setFallbackUrl('');
        setFormData({
            model_name: '',
            watch_model_name: '',
            watch_model_manufacturer: '',
            main_image: '',
            watch_sizes: [],
            frame_colors: []
        });
    };
    const handleImageUpload = (base64) => {
        setUploadedImage(base64);
        setFormData({ ...formData, main_image: base64 });
    };
    const saveModel = async () => {
        if (!formData.model_name || !formData.watch_model_name) {
            alert('Заполните обязательные поля: model_name и watch_model_name');
            return;
        }
        const finalImage = uploadedImage || fallbackUrl || '';
        const modelData = {
            model_name: formData.model_name,
            watch_model_name: formData.watch_model_name,
            watch_model_manufacturer: formData.watch_model_manufacturer || '',
            main_image: finalImage,
            choosen: false,
            watch_sizes: formData.watch_sizes || [],
            frame_colors: formData.frame_colors || []
        };
        try {
            if (isAdding) {
                await configurator_store_1.configuratorStore.addWatchModel(modelData);
            }
            else if (editingIndex !== null) {
                await configurator_store_1.configuratorStore.updateWatchModel(editingIndex, modelData);
            }
            cancelEdit();
        }
        catch (error) {
            alert('Ошибка при сохранении модели. Проверьте консоль.');
        }
    };
    const deleteModel = async (index) => {
        if (confirm('Вы уверены, что хотите удалить эту модель?')) {
            try {
                await configurator_store_1.configuratorStore.deleteWatchModel(index);
            }
            catch (error) {
                alert('Ошибка при удалении модели. Проверьте консоль.');
            }
        }
    };
    const handleBackup = async () => {
        try {
            await configurator_store_1.configuratorStore.createBackup();
            alert('Бэкап успешно создан и скачан!');
        }
        catch (error) {
            alert('Ошибка при создании бэкапа. Проверьте консоль.');
        }
    };
    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };
    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (!file.name.endsWith('.json')) {
            alert('Пожалуйста, выберите JSON файл');
            return;
        }
        if (!confirm(`Восстановить данные из файла "${file.name}"? Это удалит все текущие модели и заменит их данными из бэкапа.`)) {
            return;
        }
        try {
            const result = await configurator_store_1.configuratorStore.restoreFromBackup(file);
            alert(`✓ Бэкап успешно восстановлен! Загружено ${result.restoredCount} моделей.`);
        }
        catch (error) {
            alert('Ошибка при восстановлении бэкапа. Проверьте формат файла и консоль.');
            console.error(error);
        }
        if (e.target) {
            e.target.value = '';
        }
    };
    const addColor = () => {
        const name = prompt('Название цвета:');
        const code = prompt('Код цвета (например, #000000):');
        if (name) {
            const newColors = [...(formData.frame_colors || [])];
            newColors.push({ color_name: name, color_code: code || '', choosen: false });
            setFormData({ ...formData, frame_colors: newColors });
        }
    };
    const deleteColor = (colorIndex) => {
        const newColors = [...(formData.frame_colors || [])];
        newColors.splice(colorIndex, 1);
        setFormData({ ...formData, frame_colors: newColors });
    };
    const addSize = () => {
        const size = prompt('Размер (например, 40):');
        if (size) {
            const newSizes = [...(formData.watch_sizes || [])];
            newSizes.push({ watch_size: size, choosen: false });
            setFormData({ ...formData, watch_sizes: newSizes });
        }
    };
    const deleteSize = (sizeIndex) => {
        const newSizes = [...(formData.watch_sizes || [])];
        newSizes.splice(sizeIndex, 1);
        setFormData({ ...formData, watch_sizes: newSizes });
    };
    const resetToDefault = () => {
        if (confirm('Вы уверены, что хотите сбросить все модели к начальным данным? Все изменения будут удалены.')) {
            configurator_store_1.configuratorStore.resetWatchModelsToDefault();
            cancelEdit();
        }
    };
    return (<div className={AdminPanel_module_css_1.default.adminPanel}>
      <div className={AdminPanel_module_css_1.default.header}>
        <h1>Админ-панель: Управление моделями часов</h1>
        <div className={AdminPanel_module_css_1.default.headerButtons}>
          {!isAdding && editingIndex === null && (<>
              <button onClick={handleBackup} className={AdminPanel_module_css_1.default.backupButton}>
                💾 Скачать бэкап
              </button>
              <button onClick={handleRestoreClick} className={AdminPanel_module_css_1.default.restoreButton}>
                📂 Загрузить бэкап
              </button>
              <input ref={fileInputRef} type="file" accept=".json,application/json" onChange={handleFileSelect} style={{ display: 'none' }}/>
              <button onClick={resetToDefault} className={AdminPanel_module_css_1.default.resetButton}>
                🔄 Сбросить к начальным
              </button>
              <button onClick={startAdd} className={AdminPanel_module_css_1.default.addButton}>
                + Добавить новую модель
              </button>
            </>)}
        </div>
      </div>

      {(isAdding || editingIndex !== null) && (<div className={AdminPanel_module_css_1.default.editForm}>
          <h2>{isAdding ? 'Новая модель' : 'Редактирование модели'}</h2>
          
          <div className={AdminPanel_module_css_1.default.formGroup}>
            <label>
              Название модели (model_name) *
              <input type="text" value={formData.model_name || ''} onChange={(e) => setFormData({ ...formData, model_name: e.target.value })} placeholder="Apple Watch"/>
            </label>
          </div>

          <div className={AdminPanel_module_css_1.default.formGroup}>
            <label>
              Серия модели (watch_model_name) *
              <input type="text" value={formData.watch_model_name || ''} onChange={(e) => setFormData({ ...formData, watch_model_name: e.target.value })} placeholder="4-6 серия, SE"/>
            </label>
          </div>

          <div className={AdminPanel_module_css_1.default.formGroup}>
            <label>
              Производитель (watch_model_manufacturer)
              <input type="text" value={formData.watch_model_manufacturer || ''} onChange={(e) => setFormData({ ...formData, watch_model_manufacturer: e.target.value })} placeholder="Apple Watch"/>
            </label>
          </div>

          <div className={AdminPanel_module_css_1.default.formGroup}>
            <label>Изображение модели</label>
            <ImageUploader_1.ImageUploader onImageUpload={handleImageUpload} currentImage={uploadedImage} fallbackUrl={fallbackUrl}/>
          </div>

          <div className={AdminPanel_module_css_1.default.formGroup}>
            <label>
              URL картинки (запасной вариант)
              <input type="text" value={fallbackUrl} onChange={(e) => setFallbackUrl(e.target.value)} placeholder="https://api.slavalarionov.store/uploads/..."/>
            </label>
            <p className={AdminPanel_module_css_1.default.hint}>
              💡 Этот URL будет использоваться, если изображение не загружено с устройства
            </p>
          </div>

          <div className={AdminPanel_module_css_1.default.formGroup}>
            <label>Размеры</label>
            <div className={AdminPanel_module_css_1.default.list}>
              {formData.watch_sizes?.map((size, idx) => (<div key={idx} className={AdminPanel_module_css_1.default.listItem}>
                  <span>{size.watch_size}mm</span>
                  <button onClick={() => deleteSize(idx)} className={AdminPanel_module_css_1.default.deleteBtn}>
                    ✕
                  </button>
                </div>))}
            </div>
            <button onClick={addSize} className={AdminPanel_module_css_1.default.addSmallBtn}>
              + Добавить размер
            </button>
          </div>

          <div className={AdminPanel_module_css_1.default.formGroup}>
            <label>Цвета корпуса</label>
            <div className={AdminPanel_module_css_1.default.list}>
              {formData.frame_colors?.map((color, idx) => (<div key={idx} className={AdminPanel_module_css_1.default.listItem}>
                  <div className={AdminPanel_module_css_1.default.colorItem}>
                    <div className={AdminPanel_module_css_1.default.colorPreview} style={{ backgroundColor: color.color_code }}/>
                    <span>{color.color_name}</span>
                  </div>
                  <button onClick={() => deleteColor(idx)} className={AdminPanel_module_css_1.default.deleteBtn}>
                    ✕
                  </button>
                </div>))}
            </div>
            <button onClick={addColor} className={AdminPanel_module_css_1.default.addSmallBtn}>
              + Добавить цвет
            </button>
          </div>

          <div className={AdminPanel_module_css_1.default.formActions}>
            <button onClick={saveModel} className={AdminPanel_module_css_1.default.saveBtn}>
              {isAdding ? 'Добавить' : 'Сохранить'}
            </button>
            <button onClick={cancelEdit} className={AdminPanel_module_css_1.default.cancelBtn}>
              Отмена
            </button>
          </div>
        </div>)}

      <div className={AdminPanel_module_css_1.default.modelsList}>
        <h2>Существующие модели ({configurator_store_1.configuratorStore.watchModels.length})</h2>
        {configurator_store_1.configuratorStore.watchModels.map((model, index) => (<div key={index} className={AdminPanel_module_css_1.default.modelCard}>
            <div className={AdminPanel_module_css_1.default.modelHeader}>
              {model.main_image && (<img src={model.main_image} alt={model.watch_model_name} className={AdminPanel_module_css_1.default.modelImage}/>)}
              <div className={AdminPanel_module_css_1.default.modelInfo}>
                <h3>{model.watch_model_name}</h3>
                <p className={AdminPanel_module_css_1.default.modelName}>{model.model_name}</p>
                {model.watch_model_manufacturer && (<p className={AdminPanel_module_css_1.default.manufacturer}>{model.watch_model_manufacturer}</p>)}
              </div>
            </div>

            <div className={AdminPanel_module_css_1.default.modelDetails}>
              <div className={AdminPanel_module_css_1.default.detailSection}>
                <strong>Размеры:</strong>
                <div className={AdminPanel_module_css_1.default.tags}>
                  {model.watch_sizes.map((size, idx) => (<span key={idx} className={AdminPanel_module_css_1.default.tag}>
                      {size.watch_size}mm
                    </span>))}
                </div>
              </div>

              <div className={AdminPanel_module_css_1.default.detailSection}>
                <strong>Цвета корпуса:</strong>
                <div className={AdminPanel_module_css_1.default.colors}>
                  {model.frame_colors.map((color, idx) => (<div key={idx} className={AdminPanel_module_css_1.default.colorTag}>
                      <div className={AdminPanel_module_css_1.default.colorCircle} style={{ backgroundColor: color.color_code }}/>
                      <span>{color.color_name}</span>
                    </div>))}
                </div>
              </div>
            </div>

            <div className={AdminPanel_module_css_1.default.modelActions}>
              <button onClick={() => startEdit(index)} className={AdminPanel_module_css_1.default.editBtn}>
                Редактировать
              </button>
              <button onClick={() => deleteModel(index)} className={AdminPanel_module_css_1.default.deleteButton}>
                Удалить
              </button>
            </div>
          </div>))}
      </div>
    </div>);
});
//# sourceMappingURL=AdminPanel.js.map