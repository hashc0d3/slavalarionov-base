'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminPage;
const react_1 = require("react");
const AdminPanel_1 = require("@/widgets/admin/ui/AdminPanel");
const auth_1 = require("@/shared/lib/auth");
const page_module_css_1 = __importDefault(require("./page.module.css"));
function AdminPage() {
    const [hasAccess, setHasAccess] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const checkAccess = () => {
            const access = (0, auth_1.isAdmin)();
            setHasAccess(access);
            setIsLoading(false);
        };
        checkAccess();
    }, []);
    if (isLoading) {
        return (<div className={page_module_css_1.default.container}>
        <div className={page_module_css_1.default.loading}>Загрузка...</div>
      </div>);
    }
    if (!hasAccess) {
        return (<div className={page_module_css_1.default.container}>
        <div className={page_module_css_1.default.accessDenied}>
          <h1>Доступ запрещен</h1>
          <p>У вас нет прав для просмотра этой страницы.</p>
          <p className={page_module_css_1.default.hint}>
            Для доступа в консоли браузера выполните:<br />
            <code>localStorage.setItem('ROLE', 'ADMIN')</code>
          </p>
          <a href="/" className={page_module_css_1.default.homeLink}>
            Вернуться на главную
          </a>
        </div>
      </div>);
    }
    return (<div className={page_module_css_1.default.container}>
      <AdminPanel_1.AdminPanel />
    </div>);
}
//# sourceMappingURL=page.js.map