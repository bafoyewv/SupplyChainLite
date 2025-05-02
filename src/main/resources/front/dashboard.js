import React from "react";

export default function Dashboard() {
    return (
        <div>
            <h1 style={{ fontSize: 32, fontWeight: 700 }}>Dashboard</h1>
            <div style={{ display: "flex", gap: 24, margin: "32px 0" }}>
                <InfoCard title="Total Products" value="350" />
                <InfoCard title="Active Users" value="128" />
                <InfoCard title="Inventory Level" value="1.200" />
            </div>
            <h2 style={{ fontSize: 22, margin: "24px 0 12px" }}>Recent Orders</h2>
            <table style={{ width: "100%", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #e0e7ef" }}>
                <thead>
                <tr style={{ background: "#f0f4fa" }}>
                    <th style={th}>Order ID</th>
                    <th style={th}>Customer</th>
                    <th style={th}>Date</th>
                    <th style={th}>Amount</th>
                    <th style={th}>Status</th>
                </tr>
                </thead>
                <tbody>
                <OrderRow id="1001" name="John Doe" date="2024-04-22" amount="$500.00" status="Pending" />
                <OrderRow id="1002" name="Jane Smith" date="2024-04-21" amount="$300.00" status="Shipped" />
                <OrderRow id="1003" name="Michael Johnson" date="2024-02-20" amount="$750.00" status="Delivered" />
                <OrderRow id="1004" name="Emily Brown" date="2024-04-19" amount="$450.00" status="Pending" />
                </tbody>
            </table>
        </div>
    );
}

function InfoCard({ title, value }) {
    return (
        <div style={{
            background: "#fff",
            borderRadius: 12,
            padding: "24px 32px",
            minWidth: 180,
            boxShadow: "0 2px 8px #e0e7ef",
            textAlign: "center"
        }}>
            <div style={{ fontSize: 16, color: "#607d8b" }}>{title}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{value}</div>
        </div>
    );
}

function OrderRow({ id, name, date, amount, status }) {
    const statusColor = {
        Pending: "#90caf9",
        Shipped: "#81c784",
        Delivered: "#64b5f6"
    }[status] || "#e0e0e0";
    return (
        <tr>
            <td style={td}>{id}</td>
            <td style={td}>{name}</td>
            <td style={td}>{date}</td>
            <td style={td}>{amount}</td>
            <td style={td}>
        <span style={{
            background: statusColor,
            color: "#1a237e",
            borderRadius: 8,
            padding: "2px 12px",
            fontWeight: 500
        }}>{status}</span>
            </td>
        </tr>
    );
}

const th = { padding: "12px 16px", textAlign: "left", fontWeight: 600 };
const td = { padding: "12px 16px", borderBottom: "1px solid #f0f4fa" };