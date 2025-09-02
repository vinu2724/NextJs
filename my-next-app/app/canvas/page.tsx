"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Download,
  Upload,
  Plus,
  MinusCircle,
  Settings,
  Eye,
  EyeOff,
  Move,
  Copy,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Define the structure for a single item within the table
interface TableItem {
  description: string;
  itemCode: string;
  type: string;
  pcs: number;
  wtct: string;
  rate: string;
  amount: string;
  otherCharges: string;
  makingCharges: string;
  gstAmount: string;
  itemTotal: string;
}

// Define the structure for a billing field
interface BillingField {
  id: string;
  label: string;
  content: string;
  isVisible: boolean;
  type:
    | "text"
    | "table"
    | "total" // This will now refer to the grand total
    | "dynamic"
    | "netTotal"; // Removed individual charges/making/gst types as they are now per-item
  font: string;
  color: string;
  fontSize: number;
  fontWeight?: "normal" | "bold"; // Added for font weight control
  textAlign?: "left" | "center" | "right"; // Added for text alignment control
  isCustomText?: boolean;
  x: number;
  y: number;
  width?: number;
  height?: number; // Height is now optional for dynamic content like tables
  dynamicKey?: string;
  tableColumns?: { key: string; label: string; isVisible: boolean }[];
  chargeColumns?: { key: string; label: string; isVisible: boolean }[]; // Added charge columns back in
  tableData?: TableItem[]; // New property to hold the data for the table
}

// Define common styles for different field types to reduce repetition
const fieldTypeStyles: Record<BillingField["type"], string> = {
  text: "",
  dynamic: "text-blue-600",
  total: "text-right font-semibold text-green-600",
  netTotal: "text-right font-bold border-t border-gray-400 pt-1",
  table: "text-xs", // Table will manage its own internal layout
};

// Main App component
export default function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize] = useState({ width: 300, height: 600 });

  // Initial format configuration for the invoice fields
  const [format, setFormat] = useState<BillingField[]>([
    {
      id: "header",
      label: "Shop Name/Header",
      content: "JEWELLPLUS",
      isVisible: true,
      type: "text",
      font: "Inter",
      color: "#1f2937",
      fontSize: 18,
      fontWeight: "bold", // Default font weight
      textAlign: "center", // Default text alignment
      x: 85,
      y: 10,
      width: 130,
      height: 25,
    },
    {
      id: "subHeader",
      label: "Document Type",
      content: "ESTIMATE",
      isVisible: true,
      type: "text",
      font: "Inter",
      color: "#374151",
      fontSize: 12,
      textAlign: "center",
      x: 120,
      y: 35,
      width: 60,
      height: 18,
    },
    {
      id: "billNumber",
      label: "Card/Bill Number",
      content: "{Card_No}",
      isVisible: true,
      type: "dynamic",
      font: "Inter",
      color: "#374151",
      fontSize: 10,
      textAlign: "left",
      x: 20,
      y: 60,
      width: 120,
      height: 15,
      dynamicKey: "Card_No",
    },
    {
      id: "date",
      label: "Date & Time",
      content: "{Dt} {Dt_Time}",
      isVisible: true,
      type: "dynamic",
      font: "Inter",
      color: "#374151",
      fontSize: 10,
      textAlign: "left",
      x: 20,
      y: 80,
      width: 200,
      height: 15,
      dynamicKey: "dateTime",
    },
    {
      id: "customerName",
      label: "Customer Name",
      content: "{Name}",
      isVisible: true,
      type: "dynamic",
      font: "Inter",
      color: "#111827",
      fontSize: 11,
      textAlign: "left",
      x: 20,
      y: 100,
      width: 260,
      height: 18,
      dynamicKey: "Name",
    },
    {
      id: "divider",
      label: "Description Label",
      content: "Description",
      isVisible: true,
      type: "text",
      font: "Inter",
      color: "#374151",
      fontSize: 10,
      textAlign: "left",
      x: 20,
      y: 125,
      width: 260,
      height: 15,
    },
    {
      id: "itemTable",
      label: "Items Table",
      content: "",
      isVisible: true,
      type: "table",
      font: "Inter",
      color: "#374151",
      fontSize: 9,
      textAlign: "left", // Added
      x: 20,
      y: 145, // Initial Y, will be dynamically adjusted by autoArrangeFields
      width: 260,
      tableColumns: [
        { key: "type", label: "Type", isVisible: true },
        { key: "pcs", label: "Pcs", isVisible: true },
        { key: "wtct", label: "Wt./CT", isVisible: true },
        { key: "rate", label: "Rate", isVisible: true },
        { key: "amount", label: "Amount", isVisible: true },
      ],
      chargeColumns: [
        { key: "otherCharges", label: "Other Charges", isVisible: true },
        { key: "makingCharges", label: "Making Charges", isVisible: true },
        { key: "gstAmount", label: "GST Amount", isVisible: true },
      ],
      tableData: [
        // Sample data for table items, now including per-item charges/totals
        {
          description: "Gold Ring 18K 2.50K",
          itemCode: "GR001",
          type: "Gold",
          pcs: 1,
          wtct: "2.50",
          rate: "4500.00",
          amount: "11250.00",
          otherCharges: "50.00",
          makingCharges: "200.00",
          gstAmount: "100.00",
          itemTotal: "11550.00",
        },
        {
          description: "Gold Chain 22K 5.20K",
          itemCode: "GC002",
          type: "Gold",
          pcs: 1,
          wtct: "5.20",
          rate: "5200.00",
          amount: "27040.00",
          otherCharges: "75.00",
          makingCharges: "350.00",
          gstAmount: "150.00",
          itemTotal: "27615.00",
        },
      ],
    },
    // Grand net total and footer are still separate fields, positioned at the bottom
    {
      id: "netTotal",
      label: "Net Total",
      content: "Net Total: ₹{netTotal}",
      isVisible: true,
      type: "netTotal",
      font: "Inter",
      color: "#059669",
      fontSize: 12,
      fontWeight: "bold", // Default font weight
      textAlign: "right", // Default text alignment
      x: 160,
      y: 9999,
      width: 120,
      height: 20,
      dynamicKey: "netTotal",
    },
    {
      id: "footer",
      label: "Thank You Message",
      content: "THANK YOU !",
      isVisible: true,
      type: "text",
      font: "Inter",
      color: "#6b7280",
      fontSize: 11,
      textAlign: "center", // Default text alignment
      x: 105,
      y: 9999,
      width: 90,
      height: 18,
    },
  ]);

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [newFieldData, setNewFieldData] = useState({
    label: "",
    content: "",
    type: "text" as BillingField["type"],
  });
  const [isDragging, setIsDragging] = useState(false);
  const [overlappingFields, setOverlappingFields] = useState<string[]>([]);
  const [isFieldsListOpen, setIsFieldsListOpen] = useState(true);
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [isStylePanelOpen, setIsStylePanelOpen] = useState(false);

  // Function to check for overlapping fields
  const checkOverlap = useCallback(() => {
    const overlapping: string[] = [];
    const visibleFields = format.filter((f) => f.isVisible);

    for (let i = 0; i < visibleFields.length; i++) {
      for (let j = i + 1; j < visibleFields.length; j++) {
        const field1 = visibleFields[i];
        const field2 = visibleFields[j];

        const field1Right = field1.x + (field1.width || 100);
        const field1Bottom = field1.y + (field1.height || 20);
        const field2Right = field2.x + (field2.width || 100);
        const field2Bottom = field2.y + (field2.height || 20);

        if (
          field1.x < field2Right &&
          field1Right > field2.x &&
          field1.y < field2Bottom &&
          field1Bottom > field2.y
        ) {
          overlapping.push(field1.id, field2.id);
        }
      }
    }
    setOverlappingFields(Array.from(new Set(overlapping)));
  }, [format]);

  useEffect(() => {
    checkOverlap();
  }, [format, checkOverlap]);

  // Auto-arrange fields to prevent overlap and position bottom elements
  const autoArrangeFields = useCallback(() => {
    const topAlignedFields: BillingField[] = [];
    const bottomAlignedFields: BillingField[] = [];

    // Separate fields into top-aligned and bottom-aligned categories
    format.forEach((field) => {
      if (["netTotal", "footer"].includes(field.id)) {
        // Only netTotal and footer are bottom-aligned now
        bottomAlignedFields.push({ ...field }); // Create a copy to modify
      } else {
        topAlignedFields.push({ ...field }); // Create a copy to modify
      }
    });

    // Sort top-aligned fields by their current Y position for stable ordering
    topAlignedFields.sort((a, b) => a.y - b.y);

    let currentY = 10; // Starting Y position from the top of the canvas
    topAlignedFields.forEach((field) => {
      if (field.isVisible) {
        field.y = currentY;
        currentY += (field.height || 20) + 5; // Add 5px spacing between fields
      }
    });

    // Sort bottom-aligned fields by their current Y position (for consistent relative order)
    bottomAlignedFields.sort((a, b) => a.y - b.y);

    let currentBottomY = canvasSize.height - 10; // Starting Y position from the bottom of the canvas, minus a margin
    // Iterate bottom-aligned fields in reverse to place them upwards from the canvas bottom
    for (let i = bottomAlignedFields.length - 1; i >= 0; i--) {
      const field = bottomAlignedFields[i];
      if (field.isVisible) {
        const fieldHeight = field.height || 20;
        field.y = currentBottomY - fieldHeight;
        currentBottomY -= fieldHeight + 5; // Move upwards for the next field
      }
    }

    // Combine and update the main format state
    setFormat((prevFormat) =>
      prevFormat.map((field) => {
        const updatedField =
          topAlignedFields.find((f) => f.id === field.id) ||
          bottomAlignedFields.find((f) => f.id === field.id);
        if (updatedField) {
          // Only update x, y, width, height if they were part of the arrangement
          return {
            ...field,
            x: updatedField.x,
            y: updatedField.y,
            width: updatedField.width,
            height: updatedField.height,
          };
        }
        return field;
      })
    );
  }, [format, canvasSize.height]);

  const handleCheckboxChange = (id: string) => {
    setFormat((prevFormat) =>
      prevFormat.map((field) =>
        field.id === id ? { ...field, isVisible: !field.isVisible } : field
      )
    );
  };

  const handleAddField = () => {
    if (newFieldData.label && newFieldData.content) {
      const newFieldId = `custom-${Date.now()}`;
      const newField: BillingField = {
        id: newFieldId,
        label: newFieldData.label,
        content: newFieldData.content,
        isVisible: true,
        type: newFieldData.type,
        font: "Inter",
        color: "#374151",
        fontSize: 10,
        fontWeight: "normal", // Default font weight
        textAlign: "left", // Default text alignment
        isCustomText: true,
        x: 20,
        y:
          format
            .filter((f) => f.isVisible)
            .reduce((maxY, f) => Math.max(maxY, f.y + (f.height || 20)), 10) +
          10, // Position below last visible field
        width: 200,
        height: 18,
      };
      setFormat((prevFormat) => [...prevFormat, newField]);
      setNewFieldData({ label: "", content: "", type: "text" });
    }
  };

  const handleClearFields = () => {
    setFormat([]);
    setSelectedFieldId(null);
  };

  const handleRemoveField = (id: string) => {
    setFormat((prevFormat) => prevFormat.filter((field) => field.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  const handleStyleChange = (
    key: "font" | "color" | "fontSize" | "fontWeight" | "textAlign", // Updated key type
    value: string | number
  ) => {
    if (selectedFieldId) {
      setFormat((prevFormat) =>
        prevFormat.map((field) =>
          field.id === selectedFieldId ? { ...field, [key]: value } : field
        )
      );
    }
  };

  const handleContentChange = (id: string, value: string) => {
    setFormat((prevFormat) =>
      prevFormat.map((field) =>
        field.id === id ? { ...field, content: value } : field
      )
    );
  };

  const handleTableColumnVisibilityChange = (
    fieldId: string,
    columnKey: string
  ) => {
    setFormat((prevFormat) =>
      prevFormat.map((field) => {
        if (field.id === fieldId && field.tableColumns) {
          return {
            ...field,
            tableColumns: field.tableColumns.map((col) =>
              col.key === columnKey
                ? { ...col, isVisible: !col.isVisible }
                : col
            ),
          };
        }
        return field;
      })
    );
  };

  const handleTableChargeVisibilityChange = (
    fieldId: string,
    chargeKey: string
  ) => {
    setFormat((prevFormat) =>
      prevFormat.map((field) => {
        if (field.id === fieldId && field.chargeColumns) {
          return {
            ...field,
            chargeColumns: field.chargeColumns.map((col) =>
              col.key === chargeKey
                ? { ...col, isVisible: !col.isVisible }
                : col
            ),
          };
        }
        return field;
      })
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          try {
            const json = JSON.parse(e.target.result);
            if (Array.isArray(json)) {
              setFormat(json);
            } else {
              // Using a custom message box instead of alert()
              const messageBox = document.createElement("div");
              messageBox.className =
                "fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50";
              messageBox.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-xl text-center">
                  <p class="text-lg font-semibold mb-4">Invalid JSON format. Expected an array.</p>
                  <button id="closeMessageBox" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">OK</button>
                </div>
              `;
              document.body.appendChild(messageBox);
              document
                .getElementById("closeMessageBox")
                ?.addEventListener("click", () => {
                  document.body.removeChild(messageBox);
                });
            }
          } catch (error) {
            console.log(error);
            // Using a custom message box instead of alert()
            const messageBox = document.createElement("div");
            messageBox.className =
              "fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50";
            messageBox.innerHTML = `
              <div class="bg-white p-6 rounded-lg shadow-xl text-center">
                <p class="text-lg font-semibold mb-4">Error parsing JSON file.</p>
                <button id="closeMessageBox" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">OK</button>
              </div>
            `;
            document.body.appendChild(messageBox);
            document
              .getElementById("closeMessageBox")
              ?.addEventListener("click", () => {
                document.body.removeChild(messageBox);
              });
          }
        }
      };
    }
  };

  const handleDownload = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(format, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "jewelry-invoice-format.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleCopyJSON = () => {
    // Using document.execCommand('copy') for better iframe compatibility
    const jsonString = JSON.stringify(format, null, 2);
    const textArea = document.createElement("textarea");
    textArea.value = jsonString;
    textArea.style.position = "fixed"; // Avoid scrolling to bottom
    textArea.style.left = "-9999px"; // Move out of screen
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      // Using a custom message box instead of alert()
      const messageBox = document.createElement("div");
      messageBox.className =
        "fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50";
      messageBox.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl text-center">
          <p class="text-lg font-semibold mb-4">JSON copied to clipboard!</p>
          <button id="closeMessageBox" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
      document
        .getElementById("closeMessageBox")
        ?.addEventListener("click", () => {
          document.body.removeChild(messageBox);
        });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Using a custom message box instead of alert()
      const messageBox = document.createElement("div");
      messageBox.className =
        "fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50";
      messageBox.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl text-center">
          <p class="text-lg font-semibold mb-4">Failed to copy JSON to clipboard.</p>
          <button id="closeMessageBox" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
      document
        .getElementById("closeMessageBox")
        ?.addEventListener("click", () => {
          document.body.removeChild(messageBox);
        });
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsDragging(true);
    setSelectedFieldId(id);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const startX = e.clientX;
    const startY = e.clientY;

    const field = format.find((f) => f.id === id);
    if (!field) return;

    const startFieldX = field.x;
    const startFieldY = field.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const newX = Math.max(
        0,
        Math.min(canvasSize.width - (field.width || 100), startFieldX + deltaX)
      );
      const newY = Math.max(
        0,
        Math.min(canvasSize.height - (field.height || 20), startFieldY + deltaY)
      );

      setFormat((prevFormat) =>
        prevFormat.map((f) => (f.id === id ? { ...f, x: newX, y: newY } : f))
      );
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const selectedField = format.find((field) => field.id === selectedFieldId);

  // Helper function to render individual fields based on their type
  const renderField = (field: BillingField) => {
    const commonStyle = {
      fontFamily: field.font,
      color: field.color,
      fontSize: `${field.fontSize}px`,
      width: `${field.width || "auto"}px`,
      minHeight: `${field.height || "auto"}px`, // Ensure minHeight is auto for tables
      lineHeight: "1.2",
      wordBreak: "break-word" as const,
      whiteSpace: "normal" as const,
      fontWeight: field.fontWeight || "normal", // Apply font weight
      textAlign: field.textAlign || "left", // Apply text alignment
    };

    const typeClassName = fieldTypeStyles[field.type];

    if (field.type === "table") {
      const visibleColumns =
        field.tableColumns?.filter((col) => col.isVisible) || [];
      const visibleChargeColumns =
        field.chargeColumns?.filter((col) => col.isVisible) || [];
      return (
        <div style={commonStyle} className={typeClassName}>
          {field.tableData?.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className="mb-2 border-b border-dashed border-gray-300 pb-2"
            >
              <div className="font-semibold mb-1">{item.description}</div>
              <div className="flex justify-between text-xs mb-1">
                <span>
                  {item.type} {item.itemCode}
                </span>
                <span>{item.itemCode}</span>
              </div>

              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b">
                    {visibleColumns.map((col) => (
                      <th key={col.key} className="text-left py-1 px-1 text-xs">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {visibleColumns.map((col) => (
                      <td key={col.key} className="py-1 px-1 text-xs">
                        {item[col.key as keyof TableItem]}{" "}
                        {/* Access data dynamically */}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>

              {/* Per-item charges, making, GST, and total */}
              <div className="text-right text-xs mt-2 space-y-0.5">
                {visibleChargeColumns.some(
                  (col) => col.key === "otherCharges"
                ) &&
                  item.otherCharges && (
                    <div className="text-orange-600">
                      Other Charges: {item.otherCharges}
                    </div>
                  )}
                {visibleChargeColumns.some(
                  (col) => col.key === "makingCharges"
                ) &&
                  item.makingCharges && (
                    <div className="text-purple-600">
                      Making: {item.makingCharges}
                    </div>
                  )}
                {visibleChargeColumns.some((col) => col.key === "gstAmount") &&
                  item.gstAmount && (
                    <div className="text-indigo-600">GST: {item.gstAmount}</div>
                  )}
                {item.itemTotal && (
                  <div className="font-semibold text-green-600 border-t border-gray-300 pt-1">
                    Item Total: {item.itemTotal}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div style={commonStyle} className={typeClassName}>
        {field.content}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Sidebar - Left Panel */}
      <div className="w-full lg:w-1/2 bg-white shadow-2xl border-r border-slate-200 flex flex-col h-full lg:h-screen overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <h1 className="text-2xl font-bold">Jewelry Invoice Builder</h1>
          <p className="text-purple-100 text-sm mt-1">
            Create custom jewelry invoice formats
          </p>
        </div>

        {/* File Operations & Actions */}
        <div className="p-4 border-b border-slate-200">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <label className="flex items-center justify-center px-2 py-2 bg-slate-100 text-slate-700 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-200 transition-all duration-200 text-xs">
              <Upload size={14} className="mr-1" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center px-2 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 text-xs font-medium"
            >
              <Download size={14} className="mr-1" />
              Export
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleCopyJSON}
              className="flex items-center justify-center px-2 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-all duration-200 text-xs font-medium"
            >
              <Copy size={14} className="mr-1" />
              Copy
            </button>
            <button
              onClick={autoArrangeFields}
              className="flex items-center justify-center px-2 py-2 bg-yellow-600 text-white rounded-lg shadow-sm hover:bg-yellow-700 transition-all duration-200 text-xs font-medium"
            >
              <Move size={14} className="mr-1" />
              Arrange
            </button>
            <button
              onClick={handleClearFields}
              className="flex items-center justify-center px-2 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-all duration-200 text-xs font-medium"
            >
              <Trash2 size={14} className="mr-1" />
              Clear
            </button>
          </div>
        </div>

        {/* Overlap Warning */}
        {overlappingFields.length > 0 && (
          <div className="p-3 mx-4 mt-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle size={16} className="text-red-600" />
              <span className="text-red-800 text-sm font-medium">
                {overlappingFields.length} fields are overlapping
              </span>
            </div>
            <button
              onClick={autoArrangeFields}
              className="mt-2 text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Auto Fix
            </button>
          </div>
        )}

        {/* Collapsible Sections */}
        <div className="flex-1 overflow-y-auto">
          {/* Fields List Section */}
          <div className="border-b border-slate-200">
            <button
              onClick={() => setIsFieldsListOpen(!isFieldsListOpen)}
              className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center">
                <span className="mr-2">Fields</span>
                <span className="text-xs text-slate-500">
                  ({format.filter((f) => f.isVisible).length} visible)
                </span>
              </div>
              {isFieldsListOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
            {isFieldsListOpen && (
              <div className="p-4 space-y-2">
                {format.map((field) => (
                  <div
                    key={field.id}
                    className={`group flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                      selectedFieldId === field.id
                        ? "border-purple-500 bg-purple-50"
                        : overlappingFields.includes(field.id)
                        ? "border-red-500 bg-red-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                    onClick={() => {
                      setSelectedFieldId(field.id);
                      setIsStylePanelOpen(true);
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange(field.id);
                        }}
                        className="flex-shrink-0"
                      >
                        {field.isVisible ? (
                          <Eye size={16} className="text-green-600" />
                        ) : (
                          <EyeOff size={16} className="text-slate-400" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-slate-800 truncate">
                          {field.label}
                          {overlappingFields.includes(field.id) && (
                            <AlertTriangle
                              size={12}
                              className="inline ml-1 text-red-500"
                            />
                          )}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          <span
                            className={`mr-2 px-2 py-0.5 rounded text-xs ${fieldTypeStyles[
                              field.type
                            ]
                              .split(" ")[0]
                              .replace("text-", "bg-")
                              .replace("font-semibold", "")
                              .replace("font-bold", "")} ${
                              fieldTypeStyles[field.type].split(" ")[0]
                            }`}
                          >
                            {field.type}
                          </span>
                          {field.content.length > 15
                            ? `${field.content.substring(0, 15)}...`
                            : field.content}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {selectedFieldId === field.id && (
                        <Move size={14} className="text-purple-600" />
                      )}
                      {field.isCustomText && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveField(field.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-all duration-200"
                        >
                          <MinusCircle size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Style Panel Section */}
          {selectedField && (
            <div className="border-b border-slate-200">
              <button
                onClick={() => setIsStylePanelOpen(!isStylePanelOpen)}
                className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center">
                  <Settings size={16} className="text-slate-600 mr-2" />
                  <span>Style: {selectedField.label}</span>
                </div>
                {isStylePanelOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {isStylePanelOpen && (
                <div className="p-4 space-y-4">
                  {/* General Style Controls */}
                  <div className="flex flex-wrap gap-4 items-end">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Font
                      </label>
                      <select
                        className="px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={selectedField.font}
                        onChange={(e) =>
                          handleStyleChange("font", e.target.value)
                        }
                      >
                        <option value="Inter">Inter</option>
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="monospace">Monospace</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Size
                      </label>
                      <select
                        className="px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={selectedField.fontSize}
                        onChange={(e) =>
                          handleStyleChange(
                            "fontSize",
                            parseInt(e.target.value)
                          )
                        }
                      >
                        {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32].map(
                          (size) => (
                            <option key={size} value={size}>
                              {size}px
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Color
                      </label>
                      <input
                        type="color"
                        value={selectedField.color}
                        onChange={(e) =>
                          handleStyleChange("color", e.target.value)
                        }
                        className="w-10 h-8 border border-slate-300 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* New controls for font weight and text alignment */}
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Font Weight
                      </label>
                      <select
                        className="px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={selectedField.fontWeight || "normal"}
                        onChange={(e) =>
                          handleStyleChange(
                            "fontWeight",
                            e.target.value as "normal" | "bold"
                          )
                        }
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Text Align
                      </label>
                      <select
                        className="px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={selectedField.textAlign || "left"}
                        onChange={(e) =>
                          handleStyleChange(
                            "textAlign",
                            e.target.value as "left" | "center" | "right"
                          )
                        }
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Content
                    </label>
                    <input
                      type="text"
                      value={selectedField.content}
                      onChange={(e) =>
                        handleContentChange(selectedField.id, e.target.value)
                      }
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Use {fieldName} for dynamic content"
                    />
                  </div>

                  {/* Table Column Configuration */}
                  {selectedField.type === "table" &&
                    selectedField.tableColumns && (
                      <div className="pt-4 border-t border-slate-200">
                        <h5 className="font-semibold text-sm mb-2">
                          Table Columns
                        </h5>
                        <div className="flex flex-wrap gap-3">
                          {selectedField.tableColumns.map((col) => (
                            <label
                              key={col.key}
                              className="flex items-center text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={col.isVisible}
                                onChange={() =>
                                  handleTableColumnVisibilityChange(
                                    selectedField.id,
                                    col.key
                                  )
                                }
                                className="mr-2 h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                              />
                              <span className="text-slate-700">
                                {col.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Per-Item Charges Configuration */}
                  {selectedField.type === "table" &&
                    selectedField.chargeColumns && (
                      <div className="pt-4 border-t border-slate-200">
                        <h5 className="font-semibold text-sm mb-2">
                          Per-Item Charges
                        </h5>
                        <div className="flex flex-wrap gap-3">
                          {selectedField.chargeColumns.map((col) => (
                            <label
                              key={col.key}
                              className="flex items-center text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={col.isVisible}
                                onChange={() =>
                                  handleTableChargeVisibilityChange(
                                    selectedField.id,
                                    col.key
                                  )
                                }
                                className="mr-2 h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                              />
                              <span className="text-slate-700">
                                {col.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          )}

          {/* Add New Field Section */}
          <div className="border-b border-slate-200">
            <button
              onClick={() => setIsAddFieldOpen(!isAddFieldOpen)}
              className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <span>Add Custom Field</span>
              {isAddFieldOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
            {isAddFieldOpen && (
              <div className="p-4 space-y-3 bg-slate-50">
                <input
                  type="text"
                  placeholder="Field name"
                  value={newFieldData.label}
                  onChange={(e) =>
                    setNewFieldData({ ...newFieldData, label: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Field content (use {fieldName} for dynamic)"
                  value={newFieldData.content}
                  onChange={(e) =>
                    setNewFieldData({
                      ...newFieldData,
                      content: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <select
                  value={newFieldData.type}
                  onChange={(e) =>
                    setNewFieldData({
                      ...newFieldData,
                      type: e.target.value as BillingField["type"],
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="text">Static Text</option>
                  <option value="dynamic">Dynamic Field</option>
                  <option value="netTotal">Net Total</option>
                </select>
                <button
                  onClick={handleAddField}
                  disabled={!newFieldData.label || !newFieldData.content}
                  className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
                >
                  <Plus size={16} className="mr-2" />
                  Add Field
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Canvas Area - Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 bg-gradient-to-br from-slate-50 to-slate-100 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full">
          <div className="relative">
            <div
              ref={canvasRef}
              className="bg-white shadow-2xl rounded-lg border border-slate-200 relative overflow-hidden"
              style={{ width: canvasSize.width, height: canvasSize.height }}
              onClick={() => setSelectedFieldId(null)}
            >
              {/* Canvas Background Pattern */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                  backgroundSize: "15px 15px",
                }}
              />

              {/* Render all visible fields */}
              {format
                .filter((field) => field.isVisible)
                .map((field) => (
                  <div
                    key={field.id}
                    onMouseDown={(e) => handleMouseDown(e, field.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFieldId(field.id);
                    }}
                    className={`absolute cursor-move transition-all duration-150 hover:ring-2 hover:ring-purple-300 hover:ring-opacity-50 ${
                      selectedFieldId === field.id
                        ? "ring-2 ring-purple-500 ring-opacity-75 bg-purple-50 bg-opacity-20"
                        : ""
                    } ${isDragging ? "cursor-grabbing" : "cursor-grab"} ${
                      overlappingFields.includes(field.id)
                        ? "ring-2 ring-red-500 bg-red-50 bg-opacity-30"
                        : ""
                    }`}
                    style={{
                      left: `${field.x}px`,
                      top: `${field.y}px`,
                      zIndex: selectedFieldId === field.id ? 10 : 1,
                    }}
                  >
                    {renderField(field)}
                  </div>
                ))}
            </div>

            {/* Canvas Info */}
            <div className="absolute -bottom-6 left-0 text-xs text-slate-500">
              Invoice Size: {canvasSize.width} × {canvasSize.height}px
            </div>

            {/* Field Type Legend and Canvas Size Controls */}
          </div>
        </div>
      </div>
    </div>
  );
}
