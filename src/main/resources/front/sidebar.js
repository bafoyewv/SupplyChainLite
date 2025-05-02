import React from "react";

const menu = [
    { key: "dashboard", label: "Dashboard" },
    { key: "products", label: "Products" },
    { key: "inventory", label: "Inventory" },
    { key: "orders", label: "Orders" },
    { key: "order-details", label: "Order Details" },
    { key: "suppliers", label: "Suppliers" },
    { key: "users", label: "Users" },
];

export default function Sidebar({ setPage, page }) {
    return (
        <div style={{
            width: 220,
            background: "#eaf1fb",
            padding: "24px 0",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            boxShadow: "2px 0 8px #e0e7ef"
        }}>
            <div style={{ fontWeight: "bold", fontSize: 22, marginBottom: 32, textAlign: "center" }}>
                SupplyChainLite
            </div>
            {menu.map(item => (
                <div
                    key={item.key}
                    onClick={() => setPage(item.key)}
                    style={{
                        padding: "12px 32px",
                        background: page === item.key ? "#d0e3ff" : "transparent",
                        color: "#1a237e",
                        cursor: "pointer",
                        borderRadius: "0 20px 20px 0",
                        fontWeight: page === item.key ? "bold" : "normal"
                    }}
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
}