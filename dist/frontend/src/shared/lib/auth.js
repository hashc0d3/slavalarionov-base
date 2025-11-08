"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAdminRole = exports.setAdminRole = exports.isAdmin = void 0;
const isAdmin = () => {
    if (typeof window === 'undefined')
        return false;
    const role = localStorage.getItem('ROLE');
    return role === 'ADMIN';
};
exports.isAdmin = isAdmin;
const setAdminRole = () => {
    if (typeof window === 'undefined')
        return;
    localStorage.setItem('ROLE', 'ADMIN');
};
exports.setAdminRole = setAdminRole;
const removeAdminRole = () => {
    if (typeof window === 'undefined')
        return;
    localStorage.removeItem('ROLE');
};
exports.removeAdminRole = removeAdminRole;
//# sourceMappingURL=auth.js.map