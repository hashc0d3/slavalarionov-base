'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminButton = void 0;
const react_1 = require("react");
const auth_1 = require("@/shared/lib/auth");
const link_1 = __importDefault(require("next/link"));
const AdminButton_module_css_1 = __importDefault(require("./AdminButton.module.css"));
const AdminButton = () => {
    const [showButton, setShowButton] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setShowButton((0, auth_1.isAdmin)());
    }, []);
    if (!showButton)
        return null;
    return (<link_1.default href="/admin" className={AdminButton_module_css_1.default.adminButton}>
      🔧 Админ-панель
    </link_1.default>);
};
exports.AdminButton = AdminButton;
//# sourceMappingURL=AdminButton.js.map