### **Mark Custom Table**

This project provides a dynamic, accessible table that fetches JSON data and renders it in a Bootstrap-styled table with sorting functionality. The table can take any JSON url and allows the user to configure table headers on the frontend, requiring a simple 3 line change in your divi element or other html configuration.

---

## **Features**

- Built with accessibility-first methodology to **[World Wide Web Consortium (W3C) guidelines](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/)**
- Fetches JSON data dynamically from a provided URL.
- Uses Bootstrap styling for a clean, responsive table.
- Provides accessible column sorting via keyboard and screen readers.
- Pagination
- Searching
- Custom header names
- Modular implementation for easy reuse across multiple tables.

---

## **Live Demo**

You can view the deployed project here:  
👉 **[GitHub Pages URL]([https://mark-ohanesian.github.io/dynamic-modular-table/](https://mark-ohanesian.github.io/mark-custom-table/))**

---

## **Installation & Setup**

### **1. Clone the Repository**

```bash
git clone https://github.com/your-username/dynamic-table.git
cd dynamic-table
```

### **2. Open the Project Locally**

You can simply open `index.html` in a browser.

### **3. Use the Table on Other Pages**

To use the table in another project, add the following to your HTML file:

```html
<div
  id="data-container"
  data-json-url="https://raw.githubusercontent.com/your-username/dynamic-table/main/snacks.json"
  data-headers="Category, Name, Price"
  data-header-names='{"Category": "Whatevs", "Name": "Snack Name", "Price": "Cost"}'
></div>
<script src="dynamic-table.js"></script>
<link rel="stylesheet" href="dynamic-table.css" />
```

---
replace the data-json-url with your data, add a unique id for your table, and add the header names from your data into data-headers

## **Customization**

### **Change Data Source**

Update the `data-json-url` attribute with a new JSON URL.

### **Modify Column Headers**

Change `data-headers` to match your JSON properties.

---

## **Development & Contribution**

### **1. Make Changes Locally**

```bash
git checkout -b feature/new-update
# Modify code
git add .
git commit -m "Added new feature"
git push origin feature/new-update
```

### **2. Create a Pull Request**

Submit a PR for review.

---

## **Tech Stack**

- **HTML** for structure
- **CSS** for styling
- **JavaScript** for dynamic content
- **Bootstrap 5** for responsive design

---

## **License**

This project is licensed under the MIT License.

---

### **Author**

👤 **Mark Ohanesian**  
📧 **mark.ohanesian@state.ca.gov**  
🔗 [GitHub Profile](https://github.com/mark-ohanesian)
