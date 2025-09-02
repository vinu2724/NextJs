"use client";

import { useState, useRef } from "react";

const RawBTPrinterPage = () => {
  const [paperWidth, setPaperWidth] = useState<number>(32);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Sample receipt data
  const receiptData = {
    storeName: "DEMO STORE",
    address: ["123 Main Street", "City, ST 12345"],
    phone: "(555) 123-4567",
    receiptNumber: "R001234",
    date: new Date().toLocaleDateString(),
    items: [
      { name: "Coffee - Large", price: 4.5 },
      { name: "Sandwich - BLT", price: 7.95 },
      { name: "Cookie - Choc Chip", price: 2.25 },
    ],
    subtotal: 14.7,
    tax: 1.25,
    total: 15.95,
  };

  // Handle print using Android Print Service
  const handlePrint = () => {
    const printContent = receiptRef.current;

    if (!printContent) return;

    // Create a print-friendly version
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            body { 
              font-family: monospace; 
              font-size: 12px; 
              width: ${paperWidth * 6}px;
              margin: 0;
              padding: 10px;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .separator { border-bottom: 1px dashed #000; margin: 5px 0; }
            .right-align { text-align: right; }
            .item-row { display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      // printWindow.close(); // Optional: close after printing
    }, 250);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        ESC/POS RawBT Printer
      </h1>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Receipt Preview */}
        <div
          ref={receiptRef}
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            padding: "15px",
            border: "1px solid #ccc",
            width: `${paperWidth * 6}px`,
            minWidth: `${paperWidth * 6}px`,
          }}
        >
          {/* Header */}
          <div
            className="center bold"
            style={{ fontSize: "16px", marginBottom: "10px" }}
          >
            {receiptData.storeName}
          </div>

          {receiptData.address.map((line, i) => (
            <div key={i} className="center">
              {line}
            </div>
          ))}

          <div className="center" style={{ marginBottom: "10px" }}>
            {receiptData.phone}
          </div>

          <div className="separator"></div>

          {/* Receipt info */}
          <div>Date: {receiptData.date}</div>
          <div>Receipt #: {receiptData.receiptNumber}</div>

          <div className="separator"></div>

          {/* Items */}
          {receiptData.items.map((item, i) => (
            <div key={i} className="item-row">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}

          <div className="separator"></div>

          {/* Totals */}
          <div className="item-row">
            <span>Subtotal:</span>
            <span>${receiptData.subtotal.toFixed(2)}</span>
          </div>

          <div className="item-row">
            <span>Tax (8.5%):</span>
            <span>${receiptData.tax.toFixed(2)}</span>
          </div>

          <div className="item-row bold" style={{ fontSize: "14px" }}>
            <span>TOTAL:</span>
            <span>${receiptData.total.toFixed(2)}</span>
          </div>

          <div className="separator"></div>

          {/* Footer */}
          <div className="center" style={{ marginTop: "10px" }}>
            Thank you for your visit!
          </div>
          <div className="center">Please come again</div>
        </div>

        {/* Controls */}
        <div style={{ minWidth: "250px" }}>
          <h2>Print Settings</h2>

          <div style={{ marginBottom: "15px" }}>
            <label>
              Paper Width (characters):
              <input
                type="number"
                value={paperWidth}
                onChange={(e) => setPaperWidth(Number(e.target.value))}
                min="20"
                max="80"
                style={{ width: "100%", marginTop: "5px", padding: "5px" }}
              />
            </label>
            <small>Common values: 32 (58mm), 42 (80mm)</small>
          </div>

          <button
            onClick={handlePrint}
            style={{
              width: "100%",
              backgroundColor: "#059669",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Print Receipt
          </button>

          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#f0f9ff",
            }}
          >
            <h3>Instructions:</h3>
            <ol style={{ paddingLeft: "20px", fontSize: "14px" }}>
              <li>Install RawBT Printer app on Android device</li>
              <li>Set RawBT as your default print service</li>
              <li>Click Print Receipt to open print dialog</li>
              <li>Select RawBT from the printer options</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RawBTPrinterPage;
