"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchModelsApi = exports.mapStoreToAPI = exports.mapDBToStore = void 0;
const API_URL = '/api/watch-models';
const mapDBToStore = (dbModel) => ({
    model_name: dbModel.model_name,
    watch_model_name: dbModel.watch_model_name,
    watch_model_manufacturer: dbModel.watch_model_manufacturer || undefined,
    main_image: dbModel.main_image || undefined,
    choosen: false,
    watch_sizes: dbModel.watch_sizes.map(s => ({
        watch_size: s.watch_size,
        choosen: false
    })),
    frame_colors: dbModel.frame_colors.map(c => ({
        color_name: c.color_name,
        color_code: c.color_code || undefined,
        choosen: false
    }))
});
exports.mapDBToStore = mapDBToStore;
const mapStoreToAPI = (storeModel) => ({
    model_name: storeModel.model_name,
    watch_model_name: storeModel.watch_model_name,
    watch_model_manufacturer: storeModel.watch_model_manufacturer,
    main_image: storeModel.main_image,
    watch_sizes: storeModel.watch_sizes.map(s => ({ watch_size: s.watch_size })),
    frame_colors: storeModel.frame_colors.map(c => ({
        color_name: c.color_name,
        color_code: c.color_code
    }))
});
exports.mapStoreToAPI = mapStoreToAPI;
exports.watchModelsApi = {
    async getAll() {
        const response = await fetch(API_URL);
        if (!response.ok)
            throw new Error('Failed to fetch watch models');
        const data = await response.json();
        return data.map(exports.mapDBToStore);
    },
    async getOne(id) {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok)
            throw new Error('Failed to fetch watch model');
        const data = await response.json();
        return (0, exports.mapDBToStore)(data);
    },
    async create(model) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify((0, exports.mapStoreToAPI)(model))
        });
        if (!response.ok)
            throw new Error('Failed to create watch model');
        const data = await response.json();
        return (0, exports.mapDBToStore)(data);
    },
    async update(id, model) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify((0, exports.mapStoreToAPI)(model))
        });
        if (!response.ok)
            throw new Error('Failed to update watch model');
        const data = await response.json();
        return (0, exports.mapDBToStore)(data);
    },
    async delete(id) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok)
            throw new Error('Failed to delete watch model');
    },
    async backup() {
        const response = await fetch(`${API_URL}/backup`);
        if (!response.ok)
            throw new Error('Failed to create backup');
        return response.json();
    },
    async restore(backupData) {
        const response = await fetch(`${API_URL}/restore`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: backupData })
        });
        if (!response.ok)
            throw new Error('Failed to restore from backup');
        return response.json();
    }
};
//# sourceMappingURL=watchModels.api.js.map