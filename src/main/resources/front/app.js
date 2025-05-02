import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Suppliers from "./pages/Suppliers";
import Users from "./pages/Users";
import Sidebar from "./components/Sidebar";

function App() {
    const [page, setPage] = useState("dashboard");

    const renderPage = () => {
        switch (page) {
            case "dashboard": return <Dashboard />;
            case "products": return <Products />;
            case "inventory": return <Inventory />;
            case "orders": return <Orders />;
            case "order-details": return <OrderDetails />;
            case "suppliers": return <Suppliers />;
            case "users": return <Users />;
            default: return <Dashboard />;
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", background: "#f6f9fc" }}>
            <Sidebar setPage={setPage} page={page} />
            <div style={{ flex: 1, padding: "32px" }}>
                {renderPage()}
            </div>
        </div>
    );
}

export default App;