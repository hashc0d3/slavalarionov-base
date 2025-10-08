"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Greeting = void 0;
const react_1 = require("react");
const Greeting = () => {
    const [greeting, setGreeting] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        fetch('/api/greeting')
            .then(res => res.json())
            .then(data => setGreeting(data.message));
    }, []);
    return (<div>
      {greeting ? greeting : 'Загрузка...'}
    </div>);
};
exports.Greeting = Greeting;
//# sourceMappingURL=Greeting.js.map