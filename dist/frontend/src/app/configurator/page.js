'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Page;
const SectionConfigurator_1 = require("@/widgets/configurator/ui/SectionConfigurator");
const configurator_store_1 = require("@/shared/store/configurator.store");
const AdminButton_1 = require("@/features/admin/ui/AdminButton");
const react_1 = require("react");
function Page() {
    (0, react_1.useEffect)(() => {
        configurator_store_1.configuratorStore.loadWatchModelsFromAPI();
    }, []);
    return (<>
			<AdminButton_1.AdminButton />
			<SectionConfigurator_1.SectionConfigurator />
		</>);
}
//# sourceMappingURL=page.js.map